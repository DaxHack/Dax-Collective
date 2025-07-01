<<<<<<< HEAD
// dax-main/src/index.js
=======
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'
<<<<<<< HEAD
import { analytics } from './utils/analytics'; // <--- ADD THIS IMPORT

// Initialize Google Analytics when your application starts
// Make sure to replace 'G-KVXQJ21CZW' with your actual Measurement ID
analytics.initialize('G-KVXQJ21CZW'); // <--- ADD THIS CALL
=======
>>>>>>> 5a8663fecde2d35c1194c25223400ef23ec4724c

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
