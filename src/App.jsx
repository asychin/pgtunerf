import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from '@common/components/languageContext'
import AppLayout from '@app/AppLayout.redesigned'
import AboutPage from '@app/pages/about/redesigned'
import DashboardPage from '@app/pages/dashboard/redesigned'

const App = () => {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App
