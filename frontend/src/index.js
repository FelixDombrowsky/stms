import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// import 'core-js'
import App from './App'
import store from './store'
// import './i18n'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SocketProvider>
      <App />
    </SocketProvider>
  </Provider>,
)
