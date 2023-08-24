import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './views/App'
import 'default-passive-events'
import './styles/global.scss'
import 'normalize.css'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
