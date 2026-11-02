import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProfileProvider } from './context/ProfileContext.jsx'
import { LovePingsProvider } from './context/LovePingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProfileProvider>
      <LovePingsProvider>
        <App />
      </LovePingsProvider>
    </ProfileProvider>
  </StrictMode>,
)
