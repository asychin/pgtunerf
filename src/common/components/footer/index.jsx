import React from 'react'
import { useLanguage } from '@common/components/languageContext'

const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto">
      <div className="tricolor-stripe h-2" />
      <div className="bg-card py-8 text-center">
        <p className="text-muted-foreground text-sm">{t.footer}</p>
        <p className="text-muted-foreground text-xs mt-3 max-w-2xl mx-auto opacity-60">
          {t.disclaimer}
        </p>
      </div>
    </footer>
  )
}

export default Footer
