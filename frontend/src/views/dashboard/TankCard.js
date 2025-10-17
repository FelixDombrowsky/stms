// TankCard.js
import React, { useRef, useEffect } from 'react'
import { CCard } from '@coreui/react-pro'
import { Droplet, Fuel } from 'lucide-react'
import { Liquid } from '@ant-design/plots'

const DemoLiquid = React.memo(({ theme, color, percent }) => {
  const config = {
    percent: percent,
    width: 150,
    height: 150,
    style: {
      outlineBorder: 4,
      outlineDistance: 2,
      waveLength: 100,
      textFill: theme === 'dark' ? '#ffffff' : '#000000',
      fill: color,
      stroke: color,
    },
  }

  return <Liquid {...config} />
})

const TankCard = React.memo(({ tank, theme }) => {
  // คำนวณ % (เผื่อ Backend ยังไม่ส่ง percent มา)
  // const percent = tank.capacity_l > 0 ? tank.oil_volume / tank.capacity_l : 0
  console.log('tank_status : ', tank.status)
  // สีของ status
  const statusColor =
    tank.status === 'normal'
      ? 'limegreen'
      : tank.status === 'high_alert'
        ? 'orange'
        : tank.status === 'high_alarm'
          ? 'red'
          : tank.status === 'low_alarm'
            ? 'red'
            : 'gray'

  return (
    <CCard
      className="p-3 d-flex flex-row align-items-center mb-1 m-1"
      style={{
        // width: '450px',
        // height: '220px',
        maxWidth: '480px',
        backgroundColor:
          tank.status === 'normal'
            ? 'rgba(255,255,255,0.9)'
            : 'no_port'
              ? 'rgba(217, 217, 217, 0.1)'
              : 'no_probe'
                ? 'rgba(255,255,255,0.9)'
                : rgba(217, 217, 217, 0.1),
      }}
    >
      {/* ซ้าย: วงกลมกราฟน้ำมัน */}
      <div className="text-center p-2 d-flex flex-column align-items-center" style={{ flex: 1 }}>
        <DemoLiquid theme={theme} color={tank.fuel_color || '#5a5a5a'} percent={tank.fuel_percent} />

        <div className="mt-2">
          <h6 className="mb-1">{tank.fuel_name}</h6>
        </div>
      </div>

      {/* ขวา: ข้อมูล tank */}
      <div style={{ flex: 2 }} className="d-flex flex-column justify-content-between h-100 ps-2">
        <div className="d-flex align-items-center justify-content-between">
          <strong className="ml-1">{tank.tank_name}</strong>
          <div className="d-flex align-items-center">
            <span className="me-2">{tank.status}</span>
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: statusColor,
              }}
            ></span>
          </div>
        </div>

        <div className="p-2 border rounded mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Fuel size={18} className="me-2 mb-1" />
              <span>Fuel</span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem' }}>{tank.temp} °C</span>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{tank.oil_volume.toLocaleString()} L</span>
            <span style={{ marginLeft: '6px', fontSize: '0.9rem', color: theme === 'dark' ? '#e4e4e4' : '#666' }}>
              / {tank.capacity_l.toLocaleString()} L
            </span>

            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${tank.fuel_percent * 100}%`,
                  backgroundColor: tank.fuel_color || '#5a5a5a',
                }}
              ></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div style={{ fontSize: '0.85rem' }}>Ulg: {(tank.capacity_l - tank.oil_volume).toLocaleString()} L</div>
            <div style={{ fontSize: '0.85rem' }}>{tank.oil_height} mm</div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between p-2">
          <div>
            <Droplet size={16} className="me-1 mb-1" />
            <span className="me-1">Water</span>
          </div>

          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tank.water_volume} L</span>
            <span style={{ marginLeft: '6px', fontSize: '0.85rem', color: theme === 'dark' ? '#e4e4e4' : '#666' }}>
              {tank.water_height} mm
            </span>
          </div>
        </div>
      </div>
    </CCard>
  )
})

export default TankCard
