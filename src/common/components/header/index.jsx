import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Database, Moon, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { matchPath } from 'react-router'
import { useLanguage, languageOptions } from '@common/components/languageContext'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@common/components/ui/select'
import { Button } from '@common/components/ui/button'
import { toggleTheme, selectThemeSettings } from '@features/settings/settingsSlice'
import { APP_THEMES_DARK } from '@features/settings/constants'

const Header = () => {
  const dispatch = useDispatch()
  const theme = useSelector(selectThemeSettings)
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()
  const isActive = (path) => matchPath(path, location.pathname)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === APP_THEMES_DARK)
  }, [theme])

  return (
    <header className="sticky top-0 z-50 glassmorphism">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <div className="flex items-center gap-3">
          <Database className="h-8 w-8 text-primary" />
          <span className="text-2xl font-black tracking-tight text-foreground">{t.title}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {isActive('/') ? (
            <span className="text-foreground">{t.nav_home}</span>
          ) : (
            <Link to="/" className="hover:text-foreground transition-colors">
              {t.nav_home}
            </Link>
          )}
          {isActive('/about') ? (
            <span className="text-foreground">{t.nav_how}</span>
          ) : (
            <Link to="/about" className="hover:text-foreground transition-colors">
              {t.nav_how}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={(v) => setLanguage(v)}>
            <SelectTrigger className="w-[220px] text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((opt) => (
                <SelectItem key={opt.key} value={opt.key}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())}>
            {theme === APP_THEMES_DARK ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      <div className="tricolor-stripe h-1" />
    </header>
  )
}

export default Header
