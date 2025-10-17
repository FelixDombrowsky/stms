import React, { useEffect, useState } from 'react'
import { CCard, CCardBody, CCol, CRow } from '@coreui/react-pro'
import TankCard from './TankCard'
import { useSocket } from '../../context/SocketContext'

const Dashboard = () => {
  const socket = useSocket()
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-coreui-theme') || 'light')
  const [tanks, setTanks] = useState([])

  useEffect(() => {
    if (!socket) return

    socket.on('tank_update', (data) => {
      console.log('✅ Received update:', data)

      setTanks((prevTanks) => {
        const map = new Map()

        //1) เก่าใส่ Map
        prevTanks.forEach((t) => {
          map.set(t.tank_code, t)
        })

        //2) ใหม่ replace หรือ เพิ่ม
        data.forEach((newTank) => {
          map.set(newTank.tank_code, { ...map.get(newTank.tank_code), ...newTank })
          console.log('newTank:', newTank.fuel_percent)
        })

        // 3) คืนค่า array ใหม่
        return Array.from(map.values())
      })

      // setTanks((prevTanks) =>
      //   prevTanks.map((tank) =>
      //     tank.name === 'Tank1'
      //       ? {
      //           ...tank,
      //           fuelHeight: Number(data.oil_h), // ✅ อัปเดตจุดนี้
      //           // ถ้ามี
      //         }
      //       : tank,
      //   ),
      // )
    })

    return () => {
      socket.off('tank_update')
    }
  }, [socket])

  // useEffect(() => {
  //   const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`)

  //   // เมื่อเชื่อมต่อเสร็จ
  //   ws.onopen = () => {
  //     console.log('Connected to Websocket')
  //     ws.send(JSON.stringify({ command: 'HELLO_FROM_CLIENT' }))
  //     // TankCard({ theme, waterColor: '#4f4f4f', volume: 10000, capacity: 30000 })
  //   }

  //   // เมื่อได้รับข้อความจาก server
  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data)
  //     console.log('Message from server:', data)
  //   }

  //   ws.onclose = () => {
  //     console.log('Disconnected from server')
  //   }
  //   // ws.onmessage = (event) => {
  //   //   const msg = JSON.parse(event.data)
  //   //   const newTank = {
  //   //     id: msg.probe_id,
  //   //     name: `Tank ${msg.probe_id}`,
  //   //     fuelType: 'Unknown',
  //   //     fuelColor: '#45b6fe',
  //   //     status: 'online',
  //   //     capacity: 1000,
  //   //     volume: Number(msg.oil_h?.toFixed(1)) || 0,
  //   //     fuelHeight: Number(msg.oil_h?.toFixed(1)) || 0,
  //   //     water: Number(msg.water_h?.toFixed(1)) || 0,
  //   //     waterHeight: Number(msg.water_h?.toFixed(1)) || 0,
  //   //     temperature: Number(msg.temp?.toFixed(1)) || 0,
  //   //   }

  //   //   setTanks((prev) => {
  //   //     const idx = prev.findIndex((t) => t.id === msg.probe_id)
  //   //     if (idx > -1) {
  //   //       const updated = [...prev]
  //   //       updated[idx] = { ...updated[idx], ...newTank }
  //   //       return updated
  //   //     }
  //   //     return [...prev, newTank]
  //   //   })
  //   // }

  //   return () => ws.close()
  // }, [])

  //////////////////////////////////////////////////
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
        <CRow className="g-0 ms-1 me-0">
          {tanks.map((tank) => (
            <CCol xs={12} md={6} key={tank.tank_code}>
              <TankCard tank={tank} theme={theme} />
            </CCol>
          ))}
        </CRow>
      </CCardBody>
    </>
  )
}

export default Dashboard
