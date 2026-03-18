import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import logoImg from '@common/assets/logo.png'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isActive = (path) => matchPath(path, location.pathname)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === APP_THEMES_DARK)
  }, [theme])

  return (
    <header className="sticky top-0 z-50 glassmorphism">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="flex items-center gap-1.5 no-underline">
          <img src={logoImg} alt="пгтюн.рф" className="h-20 w-20 rounded" />
          <span className="text-2xl font-black tracking-tight text-foreground">{t.title}</span>
        </Link>

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
            <SelectTrigger className="w-[220px] text-sm hidden md:flex">
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

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-3 text-sm font-medium text-muted-foreground">
            {isActive('/') ? (
              <span className="text-foreground">{t.nav_home}</span>
            ) : (
              <Link
                to="/"
                className="hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                {t.nav_home}
              </Link>
            )}
            {isActive('/about') ? (
              <span className="text-foreground">{t.nav_how}</span>
            ) : (
              <Link
                to="/about"
                className="hover:text-foreground transition-colors"
                onClick={closeMobileMenu}
              >
                {t.nav_how}
              </Link>
            )}
            <Select value={language} onValueChange={(v) => setLanguage(v)}>
              <SelectTrigger className="w-full text-sm">
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
          </nav>
        </div>
      )}

      <div className="tricolor-stripe h-1" />
    </header>
  )
}

export default Header
