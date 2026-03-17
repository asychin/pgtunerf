import React from 'react'
import { Database } from 'lucide-react'
import Configurator from '@common/components/configurator/redesigned'
import LeadersSection from '@common/components/leadersSection'
import { useLanguage } from '@common/components/languageContext'
import bannerImg from '@common/assets/banner.png'

const DashboardPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Database className="h-12 w-12 text-primary" />
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
