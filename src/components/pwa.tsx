"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return null;
}

function subscribe() {
  return () => undefined;
}

function hintVisible() {
  const standalone = window.matchMedia("(display-mode: standalone)").matches;
  return !standalone && window.sessionStorage.getItem("avas-install-hint") !== "1";
}

export function InstallHint() {
  const eligible = useSyncExternalStore(subscribe, hintVisible, () => false);
  const [dismissed, setDismissed] = useState(false);

  if (!eligible || dismissed) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center justify-between gap-3 border border-black/15 bg-cream py-2 pr-2 pl-4 text-sm text-ink sm:hidden">
      <p>Garder AvaStudio sur l&apos;écran d&apos;accueil.</p>
      <button
        type="button"
        className="border border-ink px-3 py-2 text-xs"
        onClick={() => {
          window.sessionStorage.setItem("avas-install-hint", "1");
          setDismissed(true);
        }}
      >
        OK
      </button>
    </div>
  );
}
