import Accreditations from "@/components/home/Accreditations";
import Businesses from "@/components/home/Businesses";
import Careers from "@/components/home/Careers";
import Closing from "@/components/home/Closing";
import Hero from "@/components/home/Hero";
import Intro from "@/components/home/Intro";
import News from "@/components/home/News";
import Work from "@/components/home/Work";
import Preloader from "@/components/Preloader";

/* The homepage: the live page's modules in the live order (hero, strapline + image/text, businesses, case studies,
   careers, closing strapline, news, accreditations), restaged on the jdavisgc.com layout. */
export default function Home() {
  return <>
    <Preloader />
    <Hero />
    <Intro />
    <Businesses />
    <Work />
    <Careers />
    <Closing />
    <News />
    <Accreditations />
  </>;
}
