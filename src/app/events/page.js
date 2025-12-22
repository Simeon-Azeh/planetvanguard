import React from 'react'
import Header from '../components/header'
import EventsHero from '../components/EventsHero'
import UpcomingEvents from '../components/UpcomingEvents'
import PastEvents from '../components/PastEventsDynamic'
import Footer from '../components/footer'

export const metadata = {
  title: 'Events | Planet Vanguard',
  description: 'Join Planet Vanguard events - workshops, summits, and community initiatives for environmental change across Africa.',
}

function EventsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Header />
      <main className="pt-16">
        <EventsHero />
        <UpcomingEvents />
        <PastEvents />
      </main>
      <Footer />
    </div>
  )
}

export default EventsPage
