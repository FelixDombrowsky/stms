import React from 'react'
import { CCard } from '@coreui/react-pro'
import { Droplet, Fuel } from 'lucide-react'
import { Liquid } from '@ant-design/plots'

/** ✅ แยก DemoLiquid ออกมา และบังคับ re-render เมื่อ theme เปลี่ยนผ่าน key */
const DemoLiquid = React.memo(({ theme, color, percent }) => {
  const config = {
    percent,
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

const TankCard = ({ tank, theme }) => {
  let percent = Number((tank.fuel_percent / 100).toFixed(2))
  let statusColor
  let textColor
  let statusName
  let cardColor

  switch (tank.status) {
    case 'normal':
      statusName = 'Normal'
      statusColor = 'limegreen'
      textColor = theme === 'dark' ? '#ffffff' : 'black'
      cardColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
      break

    case 'no_port':
    case 'no_probe':
      statusName = tank.status === 'no_port' ? 'No Port' : 'No Probe'
      statusColor = 'red'
      textColor = 'red'
      cardColor = theme === 'dark' ? 'rgba(217,217,217,0.05)' : 'rgba(217,217,217,0.1)'
      break

    case 'high_alarm':
      statusName = 'High Alarm'
      statusColor = 'limegreen'
      textColor = 'red'
      cardColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
      break

    case 'low_alarm':
      statusName = 'Low Alarm'
      statusColor = 'limegreen'
      textColor = 'red'
      cardColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
      break

    case 'water_high_alarm':
      statusName = 'Water High'
      statusColor = 'limegreen'
      textColor = 'red'
      cardColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
      break

    case 'high_alert':
      statusName = 'High Alert'
      statusColor = 'limegreen'
      textColor = 'orange'
      cardColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)'
      break

    default:
      statusName = '-'
      statusColor = 'gray'
      textColor = theme === 'dark' ? '#ffffff' : 'black'
      cardColor = theme === 'dark' ? 'rgba(217,217,217,0.05)' : 'rgba(217,217,217,0.1)'
      break
  }

  return (
    <CCard
      className="p-3 d-flex flex-row align-items-center mb-1 m-1"
      style={{
        maxWidth: '480px',
        backgroundColor: cardColor,
      }}
    >
      {/* วงกลมกราฟ */}
      <div className="text-center p-2 d-flex flex-column align-items-center" style={{ flex: 1 }}>
        <DemoLiquid
          key={theme} // ✅ theme เปลี่ยน → re-mount Liquid
          theme={theme}
          color={tank.fuel_color || '#5a5a5a'}
          percent={percent}
        />

        <div className="mt-2">
          <h6 className="mb-1">{tank.fuel_name}</h6>
        </div>
      </div>

      {/* ข้อมูล Tank */}
      <div style={{ flex: 2 }} className="d-flex flex-column justify-content-between ps-2">
        <div className="d-flex align-items-center justify-content-between">
          <strong>{tank.tank_name}</strong>
          <div className="d-flex align-items-center">
            <span className="me-2" style={{ color: textColor }}>
              {statusName}
            </span>
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
            <span
              style={{
                marginLeft: '6px',
                fontSize: '0.9rem',
                color: theme === 'dark' ? '#e4e4e4' : '#666',
              }}
            >
              / {tank.capacity_l.toLocaleString()} L
            </span>

            <div className="progress mt-2" style={{ height: '6px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${tank.fuel_percent}%`,
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
            <span
              style={{
                marginLeft: '6px',
                fontSize: '0.85rem',
                color: theme === 'dark' ? '#e4e4e4' : '#666',
              }}
            >
              {tank.water_height} mm
            </span>
          </div>
        </div>
      </div>
    </CCard>
  )
}

/** ✅ ใช้ React.memo + custom compare */
export default React.memo(TankCard, (prevProps, nextProps) => {
  if (prevProps.theme !== nextProps.theme) return false
  if (prevProps.tank !== nextProps.tank) return false
  return true
})
