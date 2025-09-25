"use client"
import AnimateOnScroll from './components/AnimateOnScroll';
import AboutPreview from './components/AboutUsPreview';
import CTA from './components/CTA';
import Footer from './components/footer';
import Header from './components/header';
import Hero from './components/hero';
import Initiatives from './components/Initiatives';
import SuccessStories from './components/SuccessStories';
import Newsletter from './components/Newsletter';


function Home() {
  return (
    <div>
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
                 <Newsletter />
               </AnimateOnScroll>
         <AnimateOnScroll>
           <CTA />
         </AnimateOnScroll>
         <AnimateOnScroll>
           <Footer />
         </AnimateOnScroll>
    </div>
  )
}

export default Home