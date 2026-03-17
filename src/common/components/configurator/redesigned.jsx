import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsConfigured, resetConfiguration } from '@features/configuration/configurationSlice'
import ConfigurationForm from '@common/components/configurationForm/redesigned'
import ConfigurationView from '@common/components/configurationView/redesigned'
import { useLanguage } from '@common/components/languageContext'

const Configurator = () => {
  const dispatch = useDispatch()
  const isConfigured = useSelector(selectIsConfigured)
  const { t } = useLanguage()

  useEffect(() => {
    return () => dispatch(resetConfiguration())
  }, [dispatch])

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto animate-fade-in">
      <div>
        <ConfigurationForm />
      </div>
      <div>
        {isConfigured ? (
          <ConfigurationView />
        ) : (
          <div className="glassmorphism rounded-lg p-8 text-center">
            <p className="text-muted-foreground text-lg">{t.subtitle}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Configurator
