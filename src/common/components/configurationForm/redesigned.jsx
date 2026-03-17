import React, { useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { isEmpty } from 'lodash-es'
import { Formik, Field, Form } from 'formik'
import { Rocket } from 'lucide-react'
import { useLanguage } from '@common/components/languageContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/components/ui/select'
import { Input } from '@common/components/ui/input'
import { Button } from '@common/components/ui/button'
import { Label } from '@common/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@common/components/ui/card'
import { submitConfiguration } from '@app/actions/configurator'
import { validationSchema } from './validation'
import {
  DEFAULT_DB_VERSION,
  DB_VERSIONS,
  OS_LINUX,
  OS_MAC,
  OS_WINDOWS,
  DB_TYPE_WEB,
  DB_TYPE_OLTP,
  DB_TYPE_DW,
  DB_TYPE_DESKTOP,
  DB_TYPE_MIXED,
  HARD_DRIVE_SSD,
  HARD_DRIVE_SAN,
  HARD_DRIVE_HDD,
  SIZE_UNIT_GB,
  MAX_NUMERIC_VALUE
} from '@features/configuration/constants'

const FORM_DEFAULTS = {
  dbVersion: DEFAULT_DB_VERSION,
  osType: OS_LINUX,
  dbType: DB_TYPE_WEB,
  cpuNum: '',
  totalMemory: '',
  totalMemoryUnit: SIZE_UNIT_GB,
  connectionNum: '',
  hdType: HARD_DRIVE_SSD
}

const FORM_FIELDS = Object.keys(FORM_DEFAULTS)

const filterFormParams = (params = {}) => {
  const paramKeys = Object.keys(params)
  return FORM_FIELDS.reduce((arr, key) => {
    if (paramKeys.includes(key)) {
      arr[key] = params[key]
    }
    return arr
  }, {})
}

const SelectField = ({ value, label, options, onValueChange }) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Select value={String(value)} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
)

SelectField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  onValueChange: PropTypes.func.isRequired
}

const ConfigurationForm = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useLanguage()

  const handleGenerateConfig = (values, { setSubmitting }) => {
    setSearchParams(new URLSearchParams(values))
    setSubmitting(false)
  }

  const urlParams = useMemo(() => {
    return filterFormParams(Object.fromEntries(searchParams.entries()))
  }, [searchParams])

  const formParams = useMemo(() => {
    if (isEmpty(urlParams)) {
      return FORM_DEFAULTS
    }

    let vParams = urlParams

    try {
      validationSchema.validateSync(vParams)
    } catch (e) {
      console.warn('Url params error', e)
      vParams = {}
    }

    return Object.assign({}, FORM_DEFAULTS, vParams)
  }, [urlParams])

  useEffect(() => {
    dispatch(submitConfiguration(formParams))
  }, [dispatch, formParams])

  const dbVersionOptions = DB_VERSIONS.map((v) => ({
    label: `PostgreSQL ${v}`,
    value: v
  }))

  const osTypeOptions = [
    { label: t.linux, value: OS_LINUX },
    { label: t.osx || 'OS X', value: OS_MAC },
    { label: t.windows, value: OS_WINDOWS }
  ]

  const dbTypeOptions = [
    { label: t.webApp || t.web, value: DB_TYPE_WEB },
    { label: t.oltpApp || t.oltp, value: DB_TYPE_OLTP },
    { label: t.dwApp || t.dataWarehouse, value: DB_TYPE_DW },
    { label: t.desktopApp || t.desktop, value: DB_TYPE_DESKTOP },
    { label: t.mixedApp || t.mixed, value: DB_TYPE_MIXED }
  ]

  const hdTypeOptions = [
    { label: t.ssdStorage || t.ssd, value: HARD_DRIVE_SSD },
    { label: t.sanStorage || t.san, value: HARD_DRIVE_SAN },
    { label: t.hddStorage || t.hdd, value: HARD_DRIVE_HDD }
  ]

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{t.parametersTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          onSubmit={handleGenerateConfig}
          initialValues={formParams}
          validationSchema={validationSchema}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form className="space-y-4">
              <SelectField
                name="dbVersion"
                value={values.dbVersion}
                label={t.dbVersion}
                options={dbVersionOptions}
                onValueChange={(v) => setFieldValue('dbVersion', parseFloat(v))}
              />

              <SelectField
                name="osType"
                value={values.osType}
                label={t.osType}
                options={osTypeOptions}
                onValueChange={(v) => setFieldValue('osType', v)}
              />

              <SelectField
                name="dbType"
                value={values.dbType}
                label={t.dbType}
                options={dbTypeOptions}
                onValueChange={(v) => setFieldValue('dbType', v)}
              />

              <div className="space-y-2">
                <Label>{t.totalMemory}</Label>
                <div className="flex gap-2">
                  <Field name="totalMemory">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={MAX_NUMERIC_VALUE}
                        step={1}
                        placeholder={t.memorySize}
                        autoFocus
                        className="flex-1"
                      />
                    )}
                  </Field>
                  <Select
                    value={values.totalMemoryUnit}
                    onValueChange={(v) => setFieldValue('totalMemoryUnit', v)}
                  >
                    <SelectTrigger className="w-[80px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GB">GB</SelectItem>
                      <SelectItem value="MB">MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {errors.totalMemory && touched.totalMemory && (
                  <p className="text-xs text-destructive">{errors.totalMemory}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t.cpuNumLabel || t.cpus}</Label>
                  <Field name="cpuNum">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={MAX_NUMERIC_VALUE}
                        step={1}
                        placeholder={t.cpuNumPlaceholder}
                      />
                    )}
                  </Field>
                </div>
                <div className="space-y-2">
                  <Label>{t.connectionNumLabel || t.connections}</Label>
                  <Field name="connectionNum">
                    {({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min={20}
                        max={MAX_NUMERIC_VALUE}
                        step={1}
                        placeholder={t.connectionNumPlaceholder}
                      />
                    )}
                  </Field>
                </div>
              </div>

              <SelectField
                name="hdType"
                value={values.hdType}
                label={t.dataStorage || t.storage}
                options={hdTypeOptions}
                onValueChange={(v) => setFieldValue('hdType', v)}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-bold text-base py-6 text-white border-0 bg-gradient-to-r from-white via-[#0039A6] to-[#CC0000] hover:from-white hover:via-[#0039A6]/90 hover:to-[#CC0000]/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Rocket className="h-5 w-5 mr-2" />
                {t.generate}
              </Button>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  )
}

export default ConfigurationForm
