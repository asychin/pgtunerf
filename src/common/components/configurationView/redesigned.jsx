import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import hljs from 'highlight.js/lib/core'
import iniLang from 'highlight.js/lib/languages/ini'
import sqlLang from 'highlight.js/lib/languages/sql'
import solarizedLight from './solarized-light'
import solarizedDark from './solarized-dark'
import { Copy, Check } from 'lucide-react'
import { useLanguage } from '@common/components/languageContext'
import { Button } from '@common/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@common/components/ui/card'
import { APP_THEMES_LIGHT, TAB_CONFIG, TAB_ALTER_SYSTEM } from '@features/settings/constants'
import {
  selectDBVersion,
  selectOSType,
  selectDBType,
  selectTotalMemory,
  selectTotalMemoryUnit,
  selectCPUNum,
  selectConnectionNum,
  selectHDType,
  selectMaxConnections,
  selectHugePages,
  selectSharedBuffers,
  selectEffectiveCacheSize,
  selectMaintenanceWorkMem,
  selectCheckpointSegments,
  selectCheckpointCompletionTarget,
  selectWalBuffers,
  selectDefaultStatisticsTarget,
  selectRandomPageCost,
  selectEffectiveIoConcurrency,
  selectParallelSettings,
  selectWorkMem,
  selectWarningInfoMessages,
  selectWalLevel
} from '@features/configuration/configurationSlice'
import {
  openConfigTab,
  selectTabSettings,
  selectThemeSettings
} from '@features/settings/settingsSlice'

hljs.registerLanguage('ini', iniLang)
hljs.registerLanguage('sql', sqlLang)

const KB_UNIT_MAP = {
  KB_PER_MB: 1024,
  KB_PER_GB: 1048576
}

const formatValue = (value) => {
  const result = (() => {
    if (value % KB_UNIT_MAP['KB_PER_GB'] === 0) {
      return {
        value: Math.floor(value / KB_UNIT_MAP['KB_PER_GB']),
        unit: 'GB'
      }
    }
    if (value % KB_UNIT_MAP['KB_PER_MB'] === 0) {
      return {
        value: Math.floor(value / KB_UNIT_MAP['KB_PER_MB']),
        unit: 'MB'
      }
    }
    return {
      value,
      unit: 'kB'
    }
  })()

  return `${result.value}${result.unit}`
}

const renderCodeInlineCss = (codeHighlightStyle) => {
  return Object.keys(codeHighlightStyle).map((className) => {
    const content = codeHighlightStyle[className]
    const body = Object.keys(content)
      .map((key) => `${key}: ${content[key]};`)
      .join('')

    return `.${className} { ${body} }`
  })
}

const renderHightlightedCode = (code, isAlterSystem) => {
  return hljs.highlight(code, { language: isAlterSystem ? 'sql' : 'ini' }).value
}

const ConfigurationView = () => {
  const dispatch = useDispatch()
  const { t } = useLanguage()
  const [copied, setCopied] = React.useState(false)

  // hardware configuration
  const dbVersion = useSelector(selectDBVersion)
  const osType = useSelector(selectOSType)
  const dbType = useSelector(selectDBType)
  const totalMemory = useSelector(selectTotalMemory)
  const totalMemoryUnit = useSelector(selectTotalMemoryUnit)
  const cpuNum = useSelector(selectCPUNum)
  const connectionNum = useSelector(selectConnectionNum)
  const hdType = useSelector(selectHDType)
  // computed settings
  const maxConnectionsVal = useSelector(selectMaxConnections)
  const hugePagesVal = useSelector(selectHugePages)
  const sharedBuffersVal = useSelector(selectSharedBuffers)
  const effectiveCacheSizeVal = useSelector(selectEffectiveCacheSize)
  const maintenanceWorkMemVal = useSelector(selectMaintenanceWorkMem)
  const checkpointSegmentsVal = useSelector(selectCheckpointSegments)
  const walLevelVal = useSelector(selectWalLevel)
  const checkpointCompletionTargetVal = useSelector(selectCheckpointCompletionTarget)
  const walBuffersVal = useSelector(selectWalBuffers)
  const defaultStatisticsTargetVal = useSelector(selectDefaultStatisticsTarget)
  const randomPageCostVal = useSelector(selectRandomPageCost)
  const effectiveIoConcurrencyVal = useSelector(selectEffectiveIoConcurrency)
  const parallelSettingsVal = useSelector(selectParallelSettings)
  const workMemVal = useSelector(selectWorkMem)
  // warnings
  const warningInfoMessagesVal = useSelector(selectWarningInfoMessages)
  // tab state
  const tabState = useSelector(selectTabSettings)
  // app theme
  const theme = useSelector(selectThemeSettings)
  // tab click state
  const handleClickTab = useCallback((tab) => dispatch(openConfigTab(tab)), [dispatch])

  const isAlterSystem = TAB_ALTER_SYSTEM === tabState

  const warningInfo = () =>
    warningInfoMessagesVal.map((item) => `${isAlterSystem ? '--' : '#'} ${item}`).join('\n')

  const hardwareConfiguration = () =>
    [
      [t.configCommentDbVersion || 'DB Version', dbVersion],
      [t.configCommentOsType || 'OS Type', osType],
      [t.configCommentDbType || 'DB Type', dbType],
      [t.configCommentTotalMemory || 'Total Memory (RAM)', `${totalMemory} ${totalMemoryUnit}`],
      [t.configCommentCpuNum || 'CPUs num', cpuNum],
      [t.configCommentConnectionNum || 'Connections num', connectionNum],
      [t.configCommentDataStorage || 'Data Storage', hdType]
    ]
      .filter((item) => !!item[1])
      .map((item) => `${isAlterSystem ? '--' : '#'} ${item[0]}: ${item[1]}`)
      .join('\n')

  const getCheckpointSegments = () =>
    checkpointSegmentsVal.map((item) => {
      if (item.key === 'checkpoint_segments') {
        return [item.key, item.value]
      }
      return [item.key, formatValue(item.value)]
    })

  const getWalLevel = () => walLevelVal.map((item) => [item.key, item.value])

  const getParallelSettings = () => parallelSettingsVal.map((item) => [item.key, item.value])

  const postgresqlConfig = () => {
    const configData = [
      ['max_connections', maxConnectionsVal],
      ['shared_buffers', formatValue(sharedBuffersVal)],
      ['effective_cache_size', formatValue(effectiveCacheSizeVal)],
      ['maintenance_work_mem', formatValue(maintenanceWorkMemVal)],
      ['checkpoint_completion_target', checkpointCompletionTargetVal],
      ['wal_buffers', formatValue(walBuffersVal)],
      ['default_statistics_target', defaultStatisticsTargetVal],
      ['random_page_cost', randomPageCostVal],
      ['effective_io_concurrency', effectiveIoConcurrencyVal],
      ['work_mem', formatValue(workMemVal)],
      ['huge_pages', hugePagesVal]
    ]
      .concat(getCheckpointSegments())
      .concat(getParallelSettings())
      .concat(getWalLevel())

    return configData
      .filter((item) => !!item[1])
      .map((item) =>
        isAlterSystem ? `ALTER SYSTEM SET\n ${item[0]} = '${item[1]}';` : `${item[0]} = ${item[1]}`
      )
      .join('\n')
  }

  const generateConfig = () => {
    const tunedByLine = `${isAlterSystem ? '--' : '#'} ${t.tunedBy || 'Tuned by пгтюн.рф'}`
    let config = [hardwareConfiguration(), tunedByLine, '', postgresqlConfig()]

    if (warningInfoMessagesVal.length > 0) {
      config = [warningInfo(), '', ...config]
    }
    return config.join('\n')
  }

  const handleCopy = () => {
    const text = generateConfig()
    if (!navigator.clipboard) {
      console.warn('Clipboard API not available')
      return
    }
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch((err) => {
        console.warn('Failed to copy to clipboard:', err)
      })
  }

  const codeHighlightStyle = APP_THEMES_LIGHT === theme ? solarizedLight : solarizedDark
  const generatedConfigRes = generateConfig()

  const buildApiUrl = (format) => {
    const params = new URLSearchParams()
    params.set('db_version', dbVersion)
    params.set('os_type', osType)
    params.set('db_type', dbType)
    params.set('total_memory', totalMemory)
    params.set('total_memory_unit', totalMemoryUnit)
    if (cpuNum) params.set('cpus', cpuNum)
    if (connectionNum) params.set('connections', connectionNum)
    params.set('hd_type', hdType)
    params.set('format', format)
    return `/api/config?${params.toString()}`
  }

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t.result}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={TAB_CONFIG === tabState ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleClickTab(TAB_CONFIG)}
          >
            {t.postgresqlConf || 'postgresql.conf'}
          </Button>
          <Button
            variant={TAB_ALTER_SYSTEM === tabState ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleClickTab(TAB_ALTER_SYSTEM)}
          >
            {t.alterSystem || 'ALTER SYSTEM'}
          </Button>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {isAlterSystem ? (
            <>
              <strong>ALTER SYSTEM</strong>{' '}
              {t.alterSystemDesc ||
                'writes the given parameter setting to the postgresql.auto.conf file, which is read in addition to postgresql.conf'}
            </>
          ) : (
            t.confDesc || (
              <>
                Add/modify this settings in <strong>postgresql.conf</strong> and restart database
              </>
            )
          )}
        </p>

        {/* Code block */}
        <pre className="rounded-lg border bg-card p-4 overflow-x-auto text-sm">
          <code
            style={{ whiteSpace: 'pre' }}
            dangerouslySetInnerHTML={{
              __html: renderHightlightedCode(generatedConfigRes, isAlterSystem)
            }}
          />
        </pre>

        {/* Copy button */}
        <Button onClick={handleCopy} variant="outline" className="w-full">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              {t.copied}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              {t.copyConfiguration || t.copyConfig}
            </>
          )}
        </Button>

        {/* API links */}
        <div className="border-t border-border/40 pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-2">{t.apiLinksTitle || 'API'}</h4>
          <p className="text-sm text-muted-foreground mb-2">{t.apiLinksDesc}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={buildApiUrl('json')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline border border-border/40 rounded px-2 py-1"
            >
              {t.apiLinkJson || 'JSON'}
            </a>
            <a
              href={buildApiUrl('conf')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline border border-border/40 rounded px-2 py-1"
            >
              {t.apiLinkConf || 'postgresql.conf'}
            </a>
            <a
              href={buildApiUrl('alter')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline border border-border/40 rounded px-2 py-1"
            >
              {t.apiLinkAlter || 'ALTER SYSTEM'}
            </a>
          </div>
        </div>

        <style>{renderCodeInlineCss(codeHighlightStyle)}</style>
      </CardContent>
    </Card>
  )
}

export default ConfigurationView
