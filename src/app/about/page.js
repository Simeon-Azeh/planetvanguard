import React from 'react'
import Header from '../components/header'
import MissionVision from '../components/MissionVision'
import Goals from '../components/goals'
import Team from '../components/Team'
import Footer from '../components/footer'

function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="pt-16">
        <MissionVision />
      </div>
      <Goals />
      <Team />
      <Footer />
    </div>
  )
}

export default AboutPage