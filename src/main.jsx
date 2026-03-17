import '@css/app.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { configureAppStore } from '@app/store'
import { initServiceWorker } from '@features/sw/swWindow'
import { LocalStorage } from '@common/utils/localStorage'
import { onDomReady } from '@common/utils/onDomReady'
import { APP_THEMES_LIGHT, APP_THEMES_DARK } from '@features/settings/constants'
import App from './App.jsx'

const preloadedState = () => {
  if (!window) {
    return {}
  }

  let theme = LocalStorage.getItem('theme')

  if (!theme) {
    if (window.matchMedia('(prefers-color-scheme: dark)')?.matches) {
      theme = APP_THEMES_DARK
    }
  }

  return {
    settings: {
      theme: theme || APP_THEMES_LIGHT
    }
  }
}

const start = () => {
  const rootElement = document.getElementById('root')
  const initialState = preloadedState()
  const store = configureAppStore(initialState)

  // Apply dark class on initial load
  if (initialState.settings && initialState.settings.theme === APP_THEMES_DARK) {
    document.documentElement.classList.add('dark')
  }

  initServiceWorker(store)

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  )
}

onDomReady(start)
