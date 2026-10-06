import Accreditations from "@/components/home/Accreditations";
import Businesses from "@/components/home/Businesses";
import Careers from "@/components/home/Careers";
import Closing from "@/components/home/Closing";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import News from "@/components/home/News";
import Vacancies from "@/components/home/Vacancies";
import Work from "@/components/home/Work";
import Preloader from "@/components/Preloader";

/* The homepage: the live page's modules, restaged on the jdavisgc.com layout. Client feedback (2026-10-06) moved the
   accreditations up under Our Businesses and added the vacancies row after careers. */
export default function Home() {
  return <>
    <Preloader />
    <Hero />
    <Intro />
    <Businesses />
    <Accreditations />
    <Work />
    <Careers />
    <Vacancies />
    <Closing />
    <News />
  </>;
}
