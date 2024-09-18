import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { FileTreeProvider } from './modelcontext/ModelContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
  <FileTreeProvider>
    <App />
  </FileTreeProvider>
</StrictMode>,
)
