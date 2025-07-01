// dax-main/src/index.js
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
import { analytics } from './utils/analytics'; // <--- ADD THIS IMPORT

// Initialize Google Analytics when your application starts
// Make sure to replace 'G-KVXQJ21CZW' with your actual Measurement ID
analytics.initialize('G-KVXQJ21CZW'); // <--- ADD THIS CALL

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
