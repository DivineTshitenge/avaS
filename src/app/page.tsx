import { AboutAva } from "@/components/about-ava";
import { Covers } from "@/components/covers";
import { Faq } from "@/components/faq";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Houses } from "@/components/houses";
import { Pricing } from "@/components/pricing";
import { TopWorks } from "@/components/top-works";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AboutAva />
        <TopWorks />
        <Houses />
        <Covers />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
