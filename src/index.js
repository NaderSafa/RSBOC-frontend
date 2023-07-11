import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthenticationContextProvider } from './Auth/authentication.context'

//theme
import 'primereact/resources/themes/viva-light/theme.css'

//core
import 'primereact/resources/primereact.min.css'

import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthenticationContextProvider>
    <App />
  </AuthenticationContextProvider>
)
