import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@common/components/header'
import Footer from '@common/components/footer'
import AppUpdate from '@common/components/appUpdate'
import kremlinImg from '@common/assets/kremlin.png'

const AppLayout = () => {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header />
      <AppUpdate />

      {/* Hero background */}
      <div className="relative" style={{ flex: '1 1 0%' }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5 pointer-events-none"
          style={{ backgroundImage: `url(${kremlinImg})` }}
        />
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default AppLayout
