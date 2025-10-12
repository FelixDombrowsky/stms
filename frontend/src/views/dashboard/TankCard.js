// TankCard.js
import React, { useRef, useEffect } from 'react'
import { CCard } from '@coreui/react-pro'
import { Droplet, Fuel } from 'lucide-react'
import { Liquid } from '@ant-design/plots'

const DemoLiquid = React.memo(({ theme, waterColor, volume, capacity }) => {
  let perc = +(volume / capacity).toFixed(2)
  console.log('percent_old:', perc)
  console.log('percent_new:', volume / capacity)

  const config = {
    percent: volume / capacity,
    //  percent: perc,
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
  }

  return <Liquid {...config} />
})

const TankCard = React.memo(({ tank, theme }) => {
  console.log({ tank, theme })

  return (
    <CCard className="p-3 d-flex flex-row align-items-center mb-3" style={{ width: '400px', height: '220px' }}>
      {/* ซ้าย: วงกลมกราฟน้ำมัน */}
      <div className="text-center p-2 d-flex flex-column align-items-center" style={{ flex: 1 }}>
        <DemoLiquid theme={theme} waterColor={tank.fuelColor} volume={tank.volume} capacity={tank.capacity} />
        <div className="mt-2">
          <h6 className="mb-1">{tank.fuelType}</h6>
        </div>
      </div>

      {/* ขวา: ข้อมูล tank */}
      <div style={{ flex: 2 }} className="d-flex flex-column justify-content-between h-100 ps-2">
        <div className="d-flex align-items-center justify-content-between">
          <strong className="ml-1">{tank.name}</strong>
          <span
            style={{
              display: 'inline-block',
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: tank.status === 'online' ? 'limegreen' : 'red',
            }}
          ></span>
        </div>

        <div className="p-2 border rounded mt-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Fuel size={18} className="me-2 mb-1" />
              <span>Fuel</span>
            </div>
            <div>
              <span style={{ fontSize: '0.85rem' }}>{tank.temperature} °C</span>
            </div>
          </div>

          <div className="mt-2 mb-2">
            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{tank.volume.toLocaleString()} L</span>
            <span style={{ marginLeft: '6px', fontSize: '0.9rem', color: theme === 'dark' ? '#e4e4e4' : '#666' }}>
              / {tank.capacity.toLocaleString()} L
            </span>

            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${(tank.volume / tank.capacity) * 100}%`,
                  backgroundColor: tank.fuelColor,
                }}
              ></div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <div style={{ fontSize: '0.85rem' }}>Ulg: {(tank.capacity - tank.volume).toLocaleString()} L</div>
            <div style={{ fontSize: '0.85rem' }}>{tank.fuelHeight.toLocaleString()} mm</div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between p-2">
          <div>
            <Droplet size={16} className="me-1 mb-1" />
            <span className="me-1">Water</span>
          </div>

          <div>
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tank.water} L</span>
            <span style={{ marginLeft: '6px', fontSize: '0.85rem', color: theme === 'dark' ? '#e4e4e4' : '#666' }}>
              {tank.waterHeight} mm
            </span>
          </div>
        </div>
      </div>
    </CCard>
  )
})

export default TankCard
