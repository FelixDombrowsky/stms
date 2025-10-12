import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro'
import { Liquid } from '@ant-design/plots'
import { Droplet, Fuel, Thermometer } from 'lucide-react'
import TankCard from './TankCard'

const Dashboard = () => {
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-coreui-theme') || 'light')
  const [tanks, setTanks] = useState([])

  const DemoLiquid = React.memo(
    ({ theme, waterColor, volume, capacity }) => {
      console.log('DemoLiquid', {
        theme,
        waterColor,
        volume,
        capacity,
      })

      // let percent = parseFloat((parseFloat(volume) / parseFloat(capacity)).toFixed(2))
      let percent = volume / capacity
      if (isNaN(percent) || percent < 0) {
        percent = 0
      }
      if (percent > 1) {
        percent = 1
      }

      const config = React.useMemo(
        () => ({
          percent,
          width: 150,
          height: 150,
          style: {
            outlineBorder: 4,
            outlineDistance: 2,
            waveLength: 100,
            textFill: theme === 'dark' ? '#ffffff' : '#000000',
            fill: waterColor,
            stroke: waterColor,
          },
        }),
        [percent, theme, waterColor],
      )

      return <Liquid {...config} />
    },
    (prevProps, nextProps) => {
      return (
        prevProps.volume === nextProps.volume &&
        prevProps.capacity === nextProps.capacity &&
        prevProps.waterColor === nextProps.waterColor &&
        prevProps.theme === nextProps.theme
      )
    },
  )

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`)

    // เมื่อเชื่อมต่อเสร็จ
    ws.onopen = () => {
      console.log('Connected to Websocket')
      ws.send(JSON.stringify({ command: 'HELLO_FROM_CLIENT' }))
    }

    // เมื่อได้รับข้อความจาก server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('Message from server:', data)
    }

    ws.onclose = () => {
      console.log('Disconnected from server')
    }
    // ws.onmessage = (event) => {
    //   const msg = JSON.parse(event.data)
    //   const newTank = {
    //     id: msg.probe_id,
    //     name: `Tank ${msg.probe_id}`,
    //     fuelType: 'Unknown',
    //     fuelColor: '#45b6fe',
    //     status: 'online',
    //     capacity: 1000,
    //     volume: Number(msg.oil_h?.toFixed(1)) || 0,
    //     fuelHeight: Number(msg.oil_h?.toFixed(1)) || 0,
    //     water: Number(msg.water_h?.toFixed(1)) || 0,
    //     waterHeight: Number(msg.water_h?.toFixed(1)) || 0,
    //     temperature: Number(msg.temp?.toFixed(1)) || 0,
    //   }

    //   setTanks((prev) => {
    //     const idx = prev.findIndex((t) => t.id === msg.probe_id)
    //     if (idx > -1) {
    //       const updated = [...prev]
    //       updated[idx] = { ...updated[idx], ...newTank }
    //       return updated
    //     }
    //     return [...prev, newTank]
    //   })
    // }

    return () => ws.close()
  }, [])

  // useEffect(() => {
  //   console.log('tanks updated:', tanks[0]?.id)
  // }, [tanks])

  // useEffect(() => {
  //   // สร้าง observer ไว้ดักค่าเปลี่ยนที่ <html>
  //   const observer = new MutationObserver(() => {
  //     const newTheme = document.documentElement.getAttribute('data-coreui-theme')
  //     setTheme(newTheme)
  //   })

  //   observer.observe(document.documentElement, {
  //     attributes: true,
  //     attributeFilter: ['data-coreui-theme'],
  //   })
  //   console.log(theme)
  //   return () => observer.disconnect()
  // }, [])

  return (
    <>
      <CCardBody>
        <CRow>
          {tanks.map((tank) => (
            <CCol xs={12} md={6} lg={6} xl={4} key={tank.id}>
              <TankCard tank={tank} theme={theme} />
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </>
  )
}

export default Dashboard
