import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Agentation } from 'agentation'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {process.env.NODE_ENV === 'development' && <Agentation />}
  </StrictMode>,
)
