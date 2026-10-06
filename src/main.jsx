import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initTelegramApp } from './lib/telegram'

// React renderidan oldin Telegram WebApp xususiyatlarini tayyorlash
initTelegramApp();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
