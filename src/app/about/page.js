import React from 'react'
import Header from '../components/header'
import AboutHero from '../components/AboutHero'
import MissionVision from '../components/MissionVision'
import OurStory from '../components/OurStory'
import Goals from '../components/goals'
import Team from '../components/Team'
import Footer from '../components/footer'

function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="pt-16">
        <AboutHero />
      </div>
      <MissionVision />
      <OurStory />
      <Goals />
      <Team />
      <Footer />
    </div>
  )
}

export default AboutPage