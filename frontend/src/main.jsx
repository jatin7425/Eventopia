import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './store/ThemeContext.jsx'
import { AuthProvider } from './store/auth.jsx'
import { VendorProvider } from './store/vendorContext.jsx'
import { EventProvider } from './store/eventContext.jsx'
import { EventCartProvider } from './store/eventCartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <EventCartProvider>
          <VendorProvider>
            <EventProvider>
              <BrowserRouter>
                <NotificationProvider>
                  <App />
                </NotificationProvider>
              </BrowserRouter>
            </EventProvider>
          </VendorProvider>
        </EventCartProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
)
