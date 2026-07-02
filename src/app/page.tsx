import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Showcase from "@/components/Showcase";
import Download from "@/components/Download";
import OpenSource from "@/components/OpenSource";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Features />
        <Showcase />
        <Download />
        <OpenSource />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
