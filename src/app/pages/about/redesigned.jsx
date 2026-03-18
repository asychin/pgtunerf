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
            <strong className="text-foreground">{t.title}</strong> {t.aboutPageText}
          </p>

          <h3 className="text-lg font-semibold text-foreground">{t.aboutHowTitle}</h3>
          <ol className="list-decimal list-inside space-y-2">
            <li>{t.aboutHowStep1}</li>
            <li>{t.aboutHowStep2}</li>
            <li>{t.aboutHowStep3}</li>
          </ol>

          <p className="text-sm italic">{t.aboutWarning}</p>

          <h3 className="text-lg font-semibold text-foreground">{t.aboutSourceCode}</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <a
                href="https://github.com/asychin/pgtunerf"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/asychin/pgtunerf
              </a>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export default AboutPage
