import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Font CSS is imported here, not in index.css: Tailwind inlines CSS @imports and breaks
// Fontsource's relative ./files/ URLs in the production build
import '@fontsource/cascadia-mono/400.css'
import '@fontsource/cascadia-mono/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
