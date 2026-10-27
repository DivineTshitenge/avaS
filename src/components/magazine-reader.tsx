"use client";

import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, FileText, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Mode = "flip" | "pdf";
type Dir = "next" | "prev";

type Turn = {
  dir: Dir;
  from: number;
  to: number;
  phase: "prep" | "run";
};

type View = {
  left: number | null;
  right: number | null;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => { width: number; height: number };
  render: (options: {
    canvas: HTMLCanvasElement;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void> };
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(value * 100) / 100));
}

type Sheet = { url: string; width: number };

type PdfDoc = {
  numPages: number;
  getPage: (page: number) => Promise<PdfPage>;
  destroy: () => Promise<void> | void;
};

type PdfEngine = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (source: { url: string }) => { promise: Promise<PdfDoc> };
};

function loadPdfEngine() {
  const win = window as Window & { __pdfjs?: PdfEngine; __pdfjsPromise?: Promise<PdfEngine> };
  if (win.__pdfjs) return Promise.resolve(win.__pdfjs);
  if (win.__pdfjsPromise) return win.__pdfjsPromise;
  win.__pdfjsPromise = new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("pdf.js indisponible")), 20000);
    window.addEventListener(
      "pdfjs-ready",
      () => {
        window.clearTimeout(timer);
        if (win.__pdfjs) resolve(win.__pdfjs);
        else reject(new Error("pdf.js indisponible"));
      },
      { once: true },
    );
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import("/pdf-polyfill.mjs")
        .then(() => import("/pdf.min.mjs"))
        .then((pdfjs) => {
          window.__pdfjs = pdfjs;
          window.dispatchEvent(new Event("pdfjs-ready"));
        })
        .catch((error) => {
          window.__pdfjsError = error instanceof Error ? error.message : String(error);
          window.dispatchEvent(new Event("pdfjs-fail"));
        });
    `;
    window.addEventListener(
      "pdfjs-fail",
      () => {
        window.clearTimeout(timer);
        reject(new Error((win as Window & { __pdfjsError?: string }).__pdfjsError || "pdf.js indisponible"));
      },
      { once: true },
    );
    script.onerror = () => {
      window.clearTimeout(timer);
      reject(new Error("pdf.js indisponible"));
    };
    document.head.appendChild(script);
  });
  return win.__pdfjsPromise;
}

function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function viewOf(anchor: number, wide: boolean, total: number): View {
  if (total < 1) return { left: null, right: null };
  if (!wide) {
    const page = Math.min(Math.max(anchor, 1), total);
    return { left: page, right: page };
  }
  if (anchor <= 1) return { left: null, right: 1 };
  return {
    left: anchor <= total ? anchor : null,
    right: anchor + 1 <= total ? anchor + 1 : null,
  };
}

function nextAnchor(anchor: number, wide: boolean, total: number) {
  if (!wide) return anchor >= total ? null : anchor + 1;
  if (anchor <= 1) return total >= 2 ? 2 : null;
  const next = anchor + 2;
  return next <= total ? next : null;
}

function prevAnchor(anchor: number, wide: boolean) {
  if (!wide) return anchor <= 1 ? null : anchor - 1;
  if (anchor <= 1) return null;
  if (anchor === 2) return 1;
  return anchor - 2;
}

function pagesOf(view: View) {
  return [view.left, view.right].filter((page): page is number => page != null);
}

function Paper({
  page,
  src,
  edge,
}: {
  page: number | null;
  src?: string;
  edge: "left" | "right" | "none";
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f4f0e8]">
      {page == null ? (
        <div className="h-full w-full bg-[#ebe4d8]" />
      ) : src ? (
        // Blob URLs rendered from the PDF, not remote images.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" draggable={false} className="h-full w-full select-none object-fill" />
      ) : (
        <div className="grid h-full place-items-center text-xs text-black/35">Ouverture…</div>
      )}
      {edge === "left" ? (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-black/25 to-transparent" />
      ) : null}
      {edge === "right" ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/20 to-transparent" />
      ) : null}
    </div>
  );
}

export function MagazineReader({ title, pdf }: { title: string; pdf: string }) {
  const wide = useMedia("(min-width: 768px)");
  const reduce = useMedia("(prefers-reduced-motion: reduce)");
  const [mode, setMode] = useState<Mode>("flip");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [pageCount, setPageCount] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [anchor, setAnchor] = useState(1);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [sheets, setSheets] = useState<Record<number, string>>({});
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [zoom, setZoom] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<PdfDoc | null>(null);
  const cacheRef = useRef(new Map<number, Sheet>());
  const inflightRef = useRef(new Map<number, { wanted: number; promise: Promise<Sheet | null> }>());
  const turnRef = useRef<Turn | null>(null);
  const pointerX = useRef<number | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ dist: number; zoom: number } | null>(null);
  const zoomRef = useRef(1);
  turnRef.current = turn;
  zoomRef.current = zoom;

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const measure = () => {
      const w = node.clientWidth;
      const h = node.clientHeight;
      setFrame((current) =>
        Math.abs(current.w - w) < 2 && Math.abs(current.h - h) < 2 ? current : { w, h },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => {
    let dead = false;
    const cache = cacheRef.current;
    setStatus("loading");
    setPageCount(0);
    setRatio(0);
    setAnchor(1);
    setTurn(null);
    setZoom(1);
    setSheets({});

    (async () => {
      const pdfjs = await loadPdfEngine();
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      const doc = await pdfjs.getDocument({ url: pdf }).promise;
      if (dead) {
        await doc.destroy();
        return;
      }
      docRef.current = doc;
      const first = await doc.getPage(1);
      const viewport = first.getViewport({ scale: 1 });
      if (dead) return;
      setRatio(viewport.width / viewport.height);
      setPageCount(doc.numPages);
      setStatus("ready");
    })().catch(() => {
      if (!dead) setStatus("error");
    });

    return () => {
      dead = true;
      void docRef.current?.destroy();
      docRef.current = null;
      for (const sheet of cache.values()) URL.revokeObjectURL(sheet.url);
      cache.clear();
    };
  }, [pdf]);

  useEffect(() => {
    setTurn(null);
    setAnchor((current) => {
      if (!wide) return Math.max(1, current);
      if (current <= 1) return 1;
      return current % 2 === 0 ? current : current - 1;
    });
  }, [wide]);

  useEffect(() => {
    const doc = docRef.current;
    if (status !== "ready" || !doc || pageCount < 1 || frame.w < 40) return;
    const cache = cacheRef.current;
    const needed = new Set<number>();
    const add = (page: number) => {
      const view = viewOf(page, wide, pageCount);
      for (const item of pagesOf(view)) needed.add(item);
    };
    add(anchor);
    const previous = prevAnchor(anchor, wide);
    const next = nextAnchor(anchor, wide, pageCount);
    if (previous) add(previous);
    if (next) add(next);
    if (turn) {
      add(turn.from);
      add(turn.to);
    }
    const pageCss = Math.max(frame.w, 1) / (wide ? 2 : 1);
    const wanted = Math.min(2800, Math.ceil(pageCss * zoom * Math.min(window.devicePixelRatio || 1, 2)));

    let cancel = false;
    (async () => {
      for (const page of needed) {
        const cached = cache.get(page);
        if (cancel || (cached && cached.width + 48 >= wanted)) continue;
        try {
          let pending = inflightRef.current.get(page);
          if (!pending || pending.wanted + 48 < wanted) {
            const jobWanted = wanted;
            const promise = (async () => {
              const pdfPage = await doc.getPage(page);
              const base = pdfPage.getViewport({ scale: 1 });
              const scale = Math.min(3, Math.max(jobWanted, 900) / base.width);
              const viewport = pdfPage.getViewport({ scale });
              const canvas = document.createElement("canvas");
              canvas.width = Math.floor(viewport.width);
              canvas.height = Math.floor(viewport.height);
              await pdfPage.render({ canvas, viewport }).promise;
              const blob = await new Promise<Blob | null>((resolve) => {
                canvas.toBlob(resolve, "image/jpeg", 0.86);
              });
              if (!blob) return null;
              return { url: URL.createObjectURL(blob), width: canvas.width };
            })();
            pending = { wanted: jobWanted, promise };
            inflightRef.current.set(page, pending);
          }
          const sheet = await pending.promise;
          if (inflightRef.current.get(page)?.promise === pending.promise) inflightRef.current.delete(page);
          if (!sheet || cancel) return;
          const previous = cache.get(page);
          if (previous && previous.url !== sheet.url) URL.revokeObjectURL(previous.url);
          if (!previous || sheet.width >= previous.width) cache.set(page, sheet);
          if (cache.size > 10) {
            for (const [oldest, oldSheet] of [...cache.entries()]) {
              if (cache.size <= 10) break;
              if (needed.has(oldest)) continue;
              cache.delete(oldest);
              URL.revokeObjectURL(oldSheet.url);
            }
          }
          setSheets(Object.fromEntries([...cache].map(([key, value]) => [key, value.url])));
        } catch {
          inflightRef.current.delete(page);
          if (!cancel) setStatus("error");
          return;
        }
      }
    })();

    return () => {
      cancel = true;
    };
  }, [anchor, frame.w, pageCount, status, turn, wide, zoom]);

  useEffect(() => {
    if (!turn || turn.phase !== "prep") return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        setTurn((current) => (current && current.phase === "prep" ? { ...current, phase: "run" } : current));
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [turn]);

  useEffect(() => {
    if (!turn || turn.phase !== "run") return;
    const timeout = window.setTimeout(() => finishTurn(), 980);
    return () => window.clearTimeout(timeout);
  }, [turn]);

  function finishTurn() {
    const current = turnRef.current;
    if (!current || current.phase !== "run") return;
    setAnchor(current.to);
    setTurn(null);
  }

  useEffect(() => {
    if (mode !== "flip") return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        travel("next");
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        travel("prev");
      } else if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((current) => clampZoom(current + 0.25));
      } else if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setZoom((current) => clampZoom(current - 0.25));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const node = frameRef.current;
    if (!node || mode !== "flip") return;
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      setZoom((current) => clampZoom(current * (event.deltaY < 0 ? 1.08 : 0.92)));
    };
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [mode]);

  function travel(dir: Dir) {
    if (turn || status !== "ready") return;
    const to = dir === "next" ? nextAnchor(anchor, wide, pageCount) : prevAnchor(anchor, wide);
    if (to == null) return;
    if (reduce) {
      setAnchor(to);
      return;
    }
    setTurn({ dir, from: anchor, to, phase: "prep" });
  }

  const view = viewOf(anchor, wide, pageCount);
  const moving = (() => {
    if (!turn) return null;
    const from = viewOf(turn.from, wide, pageCount);
    const to = viewOf(turn.to, wide, pageCount);
    if (!wide && turn.dir === "prev") {
      return { base: from, front: to.right, back: from.right };
    }
    if (turn.dir === "next") {
      return {
        base: wide ? { left: from.left, right: to.right } : to,
        front: from.right,
        back: wide ? to.left : to.right,
      };
    }
    return {
      base: { left: to.left, right: from.right },
      front: to.right,
      back: from.left,
    };
  })();

  const shown = moving ? moving.base : view;
  const angle = !turn ? 0 : turn.dir === "next" ? (turn.phase === "run" ? -180 : 0) : turn.phase === "run" ? 0 : -180;
  const across = wide ? 2 : 1;
  const pageRatio = ratio || 0.72;
  const gutter = wide ? 40 : 12;
  const widthCap = wide ? Math.min(frame.w - gutter * 2, 1040) : frame.w - gutter * 2;
  const maxW = Math.max(widthCap, 0);
  const maxH = Math.max(frame.h - (wide ? 20 : 8), 0);
  let baseW = maxW;
  let baseH = pageRatio > 0 ? baseW / (pageRatio * across) : 0;
  if (baseH > maxH && maxH > 0) {
    baseH = maxH;
    baseW = baseH * pageRatio * across;
  }
  const bookW = baseW * zoom;
  const bookH = baseH * zoom;
  const fits = bookW <= frame.w + 1 && bookH <= frame.h + 1;

  const atStart = prevAnchor(anchor, wide) == null;
  const atEnd = nextAnchor(anchor, wide, pageCount) == null;
  const label = !wide || view.left == null
    ? `${view.right ?? 1} / ${pageCount || "…"}`
    : view.right == null
      ? `${view.left} / ${pageCount}`
      : `${view.left}–${view.right} / ${pageCount}`;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
        <Link href="/#couvertures" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold">
          <ArrowLeft className="size-4" />
          Retour
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-sm font-semibold">{title}</h1>
        <div className="flex shrink-0 items-center gap-2">
          <div role="group" aria-label="Mode de lecture" className="flex rounded-full bg-white/10 p-0.5 text-xs font-semibold">
            <button
              type="button"
              aria-pressed={mode === "flip"}
              onClick={() => setMode("flip")}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 ${mode === "flip" ? "bg-[#25f4ee] text-[#111]" : "text-white/80"}`}
            >
              <BookOpen className="size-3.5" />
              <span className="sr-only sm:not-sr-only">Feuilleter</span>
            </button>
            <button
              type="button"
              aria-pressed={mode === "pdf"}
              onClick={() => setMode("pdf")}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 ${mode === "pdf" ? "bg-[#25f4ee] text-[#111]" : "text-white/80"}`}
            >
              <FileText className="size-3.5" />
              <span className="sr-only sm:not-sr-only">PDF</span>
            </button>
          </div>
          <a href={pdf} className="hidden text-sm font-semibold text-[#25f4ee] sm:inline">
            Ouvrir
          </a>
        </div>
      </div>

      {mode === "pdf" ? (
        <iframe src={pdf} title={`Lire ${title}`} className="min-h-0 w-full flex-1 border-0 bg-white" />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col bg-[#161412]">
          <div className="relative min-h-0 flex-1">
          <div ref={frameRef} className="absolute inset-0 overflow-auto">
            {status === "error" ? (
              <div className="grid h-full place-items-center px-6 text-center">
                <div>
                  <p className="text-sm">Le feuilletage n&apos;a pas pu s&apos;ouvrir.</p>
                  <button type="button" onClick={() => setMode("pdf")} className="mt-3 text-sm font-semibold text-[#25f4ee]">
                    Lire le PDF
                  </button>
                </div>
              </div>
            ) : bookW > 0 && bookH > 0 && status === "ready" ? (
              <div className={`flex min-h-full min-w-full ${fits ? "items-center justify-center" : "items-start justify-start"}`}>
                <div className="relative shrink-0" style={{ width: bookW, height: bookH, perspective: "2400px" }}>
                  <div
                    className="absolute inset-0"
                    style={{ transformStyle: "preserve-3d" }}
                    onPointerDown={(event) => {
                      if ((event.target as HTMLElement).closest("button")) return;
                      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
                      if (pointers.current.size === 2) {
                        const [a, b] = [...pointers.current.values()];
                        pinchRef.current = {
                          dist: Math.hypot(a.x - b.x, a.y - b.y),
                          zoom: zoomRef.current,
                        };
                      }
                      pointerX.current = event.clientX;
                    }}
                    onPointerMove={(event) => {
                      if (!pointers.current.has(event.pointerId)) return;
                      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
                      const pinch = pinchRef.current;
                      if (pointers.current.size < 2 || !pinch || pinch.dist < 8) return;
                      const [a, b] = [...pointers.current.values()];
                      const dist = Math.hypot(a.x - b.x, a.y - b.y);
                      setZoom(clampZoom(pinch.zoom * (dist / pinch.dist)));
                    }}
                    onPointerUp={(event) => {
                      const pinched = pinchRef.current != null;
                      pointers.current.delete(event.pointerId);
                      if (pointers.current.size < 2) pinchRef.current = null;
                      const start = pointerX.current;
                      pointerX.current = null;
                      if (pinched || zoomRef.current > 1.01 || turn || start == null) return;
                      if ((event.target as HTMLElement).closest("button")) return;
                      const box = event.currentTarget.getBoundingClientRect();
                      const dx = event.clientX - start;
                      if (dx <= -42) travel("next");
                      else if (dx >= 42) travel("prev");
                      else if (event.clientX - box.left < box.width * 0.28) travel("prev");
                      else if (event.clientX - box.left > box.width * 0.72) travel("next");
                    }}
                    onPointerCancel={(event) => {
                      pointers.current.delete(event.pointerId);
                      if (pointers.current.size < 2) pinchRef.current = null;
                    }}
                  >
                    <div className="absolute inset-0 bg-[#f4f0e8] shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
                      {wide ? (
                        <>
                          <div className="absolute inset-y-0 left-0 w-1/2">
                            <Paper page={shown.left} src={shown.left ? sheets[shown.left] : undefined} edge="left" />
                          </div>
                          <div className="absolute inset-y-0 right-0 w-1/2">
                            <Paper page={shown.right} src={shown.right ? sheets[shown.right] : undefined} edge="right" />
                          </div>
                          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-black/40" />
                        </>
                      ) : (
                        <Paper page={shown.right} src={shown.right ? sheets[shown.right] : undefined} edge="none" />
                      )}
                    </div>

                    {moving ? (
                      <div
                        className="absolute top-0 z-20 h-full"
                        onTransitionEnd={(event) => {
                          if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
                          finishTurn();
                        }}
                        style={{
                          left: wide ? "50%" : 0,
                          width: wide ? "50%" : "100%",
                          transformOrigin: "left center",
                          transform: `rotateY(${angle}deg)`,
                          transition: turn?.phase === "run" ? "transform 780ms cubic-bezier(0.45, 0.05, 0.2, 1)" : "none",
                          transformStyle: "preserve-3d",
                        }}
                      >
                        <div className="absolute inset-0 overflow-hidden bg-white shadow-xl" style={{ backfaceVisibility: "hidden" }}>
                          <Paper page={moving.front} src={moving.front ? sheets[moving.front] : undefined} edge="none" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
                        </div>
                        <div
                          className="absolute inset-0 overflow-hidden bg-white shadow-xl"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <Paper page={moving.back} src={moving.back ? sheets[moving.back] : undefined} edge="none" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/10" />
                        </div>
                      </div>
                    ) : null}

                  </div>
                </div>
              </div>
            ) : (
              <div className="grid h-full place-items-center text-sm text-white/70">Ouverture du magazine…</div>
            )}
          </div>
          {status === "ready" && bookW > 0 ? (
            <>
              <button
                type="button"
                aria-label="Page précédente"
                disabled={atStart || Boolean(turn)}
                onClick={() => travel("prev")}
                className="absolute top-1/2 left-3 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                aria-label="Page suivante"
                disabled={atEnd || Boolean(turn)}
                onClick={() => travel("next")}
                className="absolute top-1/2 right-3 z-30 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white disabled:opacity-30"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}
        </div>
          <div className="flex items-center justify-between gap-3 px-3 pt-2 pb-3">
            <div className="flex items-center rounded-full bg-white p-0.5 text-[#111]" role="group" aria-label="Zoom">
              <button
                type="button"
                aria-label="Dézoomer"
                disabled={zoom <= MIN_ZOOM || status !== "ready"}
                onClick={() => setZoom((current) => clampZoom(current - 0.25))}
                className="grid size-9 place-items-center rounded-full disabled:opacity-30"
              >
                <ZoomOut className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Taille d'origine"
                onClick={() => setZoom(1)}
                className="min-w-12 px-1 text-xs font-semibold tabular-nums"
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                aria-label="Zoomer"
                disabled={zoom >= MAX_ZOOM || status !== "ready"}
                onClick={() => setZoom((current) => clampZoom(current + 0.25))}
                className="grid size-9 place-items-center rounded-full disabled:opacity-30"
              >
                <ZoomIn className="size-4" />
              </button>
            </div>
            <p className="text-xs tracking-wide text-white/70" aria-live="polite">
              {status === "ready" ? label : "Ouverture du magazine…"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
