import React from 'react'
import Header from '../components/header'
import GetInvolved from '../components/GetInvoled'
import Donations from '../components/Donations'
import Footer from '../components/footer'

function GetInvolvedPage() {
  return (
    <div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-blue-50 
        dark:from-emerald-950 dark:to-blue-950" />
      <Header />    
      <div>
      
        <GetInvolved />
        </div>    
      <Donations />
      <Footer />
    </div>
  )
}

export default GetInvolvedPage
