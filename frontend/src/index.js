import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

// import 'core-js'
import App from './App'
import store from './store'
// import './i18n'

// import { Liquid } from '@ant-design/plots'
// const DemoLiquid = () => {
//   const [percent, setPercent] = useState(0)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setPercent((prev) => {
//         if (prev >= 1) {
//           return 0 // ถ้าถึง 1 แล้ว กลับไป 0
//         }
//         return +(prev + 0.05).toFixed(2) // เพิ่มทีละ 0.1
//       })
//     }, 1000) // ทุก 1 วินาที

//     return () => clearInterval(interval) // cleanup
//   }, [])

//   const config = {
//     percent,
//     width: 150,
//     height: 150,
//     style: {
//       outlineBorder: 4,
//       outlineDistance: 8,
//       waveLength: 128,
//     },
//   }
//   return <Liquid {...config} />
// }
// createRoot(document.getElementById('root')).render(<DemoLiquid />)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
