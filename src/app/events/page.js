import React from 'react'
import Header from '../components/header'
import Events from '../components/Events'
import PastEvents from '../components/PastEvents'
import Footer from '../components/footer'

function EventsPage() {
  return (
    <div>
      <Header />
      <Events />
      <div className="relative z-10">
        <PastEvents />
      </div>
      <Footer />
    </div>
  )
}

export default EventsPage
