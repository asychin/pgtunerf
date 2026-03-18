import React from 'react'
import Configurator from '@common/components/configurator/redesigned'
import LeadersSection from '@common/components/leadersSection'
import { useLanguage } from '@common/components/languageContext'
import bannerImg from '@common/assets/banner.png'
import logoImg from '@common/assets/logo.png'

const DashboardPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          <img src={logoImg} alt="пгтюн.рф" className="h-24 w-24 rounded-lg" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            пгтюн.рф
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
      </div>

      <div className="mb-12 max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-lg">
        <img
          src={bannerImg}
          alt="пгтюн.рф — Настрой PostgreSQL по-русски"
          className="w-full object-cover"
          style={{ height: '260px', objectPosition: 'top' }}
        />
      </div>

      <Configurator />

      <LeadersSection />
    </div>
  )
}

export default DashboardPage
