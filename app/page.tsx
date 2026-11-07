import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Problem } from "@/components/problem";
import { ModelLayersScroll } from "@/components/model-layers-scroll";
import { BentoGrid } from "@/components/bento-grid";
import { Results } from "@/components/results";
import { Team } from "@/components/team";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <Problem />
        <ModelLayersScroll />
        <BentoGrid />
        <Results />
        <Team />
      </main>
      <Footer />
    </>
  );
}
