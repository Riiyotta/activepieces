import React from 'react'
import ReactDOM from 'react-dom/client'
// Global CSS first so co-located section CSS (imported by components) comes after Tailwind utilities.
import './index.css'
import './icons.css'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
