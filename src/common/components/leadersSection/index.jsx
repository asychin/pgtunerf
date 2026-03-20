import React from 'react'
import { useLanguage } from '@common/components/languageContext'
import { Card, CardContent } from '@common/components/ui/card'
import putinImg from '@common/assets/putin.png'
import medvedevImg from '@common/assets/medvedev.png'
import zhirinovskyImg from '@common/assets/zhirinovsky.png'
import lavrovImg from '@common/assets/lavrov.png'
import shoiguImg from '@common/assets/shoigu.png'
import peskovImg from '@common/assets/peskov.png'

const LeadersSection = () => {
  const { t } = useLanguage()

  if (!t.leaders) return null

  const leaders = [
    { ...t.leaders[0], img: putinImg },
    { ...t.leaders[1], img: medvedevImg },
    { ...t.leaders[2], img: zhirinovskyImg },
    { ...t.leaders[3], img: lavrovImg },
    { ...t.leaders[4], img: shoiguImg },
    { ...t.leaders[5], img: peskovImg }
  ]

  return (
    <section className="py-16">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">{t.leadersTitle}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {leaders.map((leader) => (
          <Card key={leader.name} className="glassmorphism overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <img
                  src={leader.img}
                  alt={leader.name}
                  className="h-20 w-20 rounded-full object-cover flex-shrink-0 border-2 border-primary/30"
                />
                <div>
                  <p className="text-sm italic text-muted-foreground mb-3">
                    &laquo;{leader.quote}&raquo;
                  </p>
                  <p className="font-bold text-foreground">{leader.name}</p>
                  <p className="text-xs text-muted-foreground">{leader.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

export default LeadersSection
