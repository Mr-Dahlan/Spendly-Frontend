import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './Providers/AppProviders.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
    <App />
    </AppProviders>
  </StrictMode>,
)
