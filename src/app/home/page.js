"use client"
import AnimateOnScroll from '../components/AnimateOnScroll';
import AboutPreview from '../components/AboutUsPreview';
import CTA from '../components/CTA';
import Footer from '../components/footer';
import Header from '../components/header';
import Hero from '../components/hero';
import Initiatives from '../components/Initiatives';
import SuccessStories from '../components/SuccessStories';


export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <Hero />
      <AnimateOnScroll>
        <AboutPreview />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Initiatives />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <SuccessStories />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <CTA />
      </AnimateOnScroll>
      <AnimateOnScroll>
        <Footer />
      </AnimateOnScroll>
    </div>
  );
}