import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@common/components/ui/card'
import { useLanguage } from '@common/components/languageContext'

const AboutPage = () => {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t.nav_how}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">{t.title}</strong> {t.aboutPageText}{' '}
            <a
              href="https://en.wikipedia.org/wiki/No_Silver_Bullet"
              className="text-primary hover:underline"
            >
              {t.aboutSilverBullet}
            </a>{' '}
            {t.aboutPageText2}
          </p>
          <h3 className="text-lg font-semibold text-foreground">{t.aboutUsefulLinks}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a href="https://github.com/le0pard/pgtune" className="text-primary hover:underline">
                {t.aboutSourceCode}
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AboutPage
