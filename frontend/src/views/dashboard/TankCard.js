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
      cardColor = theme === 'dark' ? 'rgba(217, 217, 217, 0)' : 'rgba(217,217,217,0.1)'
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
    // <CCard
    //   className="p-3 d-flex flex-row align-items-center mb-5 m-1 w-100 me-3 ms-3"
    //   style={{
    //     maxWidth: '550px',
    //     // width: '100%',
    //     backgroundColor: cardColor,
    //   }}
    // >
    //   {/* วงกลมกราฟ */}
    //   <div className="text-center p-2 d-flex flex-column align-items-center w-25 me-4 ms-3">
    //     <DemoLiquid
    //       key={theme} // ✅ theme เปลี่ยน → re-mount Liquid
    //       theme={theme}
    //       color={tank.fuel_color || '#5a5a5a'}
    //       percent={percent}
    //     />

    //     <div className="mt-2">
    //       <h6 className="mb-1">{tank.fuel_name}</h6>
    //     </div>
    //   </div>

    //   {/* ข้อมูล Tank */}
    //   <div className="d-flex flex-column justify-content-between ps-2 w-75">
    //     <div className="d-flex align-items-center justify-content-between">
    //       <strong>{tank.tank_name}</strong>
    //       <div className="d-flex align-items-center">
    //         <span className="me-2" style={{ color: textColor }}>
    //           {statusName}
    //         </span>
    //         <span
    //           style={{
    //             display: 'inline-block',
    //             width: 12,
    //             height: 12,
    //             borderRadius: '50%',
    //             backgroundColor: statusColor,
    //           }}
    //         ></span>
    //       </div>
    //     </div>

    //     <div className="p-2 border rounded mt-2">
    //       <div className="d-flex justify-content-between align-items-center">
    //         <div>
    //           <Fuel size={18} className="me-2 mb-1" />
    //           <span>Fuel</span>
    //         </div>
    //         <div>
    //           <span style={{ fontSize: '0.85rem' }}>{tank.temp} °C</span>
    //         </div>
    //       </div>

    //       <div className="mt-2 mb-2">
    //         <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{tank.oil_volume.toLocaleString()} L</span>
    //         <span
    //           style={{
    //             marginLeft: '6px',
    //             fontSize: '0.9rem',
    //             color: theme === 'dark' ? '#e4e4e4' : '#666',
    //           }}
    //         >
    //           / {tank.capacity_l.toLocaleString()} L
    //         </span>

    //         <div className="progress mt-2" style={{ height: '6px' }}>
    //           <div
    //             className="progress-bar"
    //             role="progressbar"
    //             style={{
    //               width: `${tank.fuel_percent}%`,
    //               backgroundColor: tank.fuel_color || '#5a5a5a',
    //             }}
    //           ></div>
    //         </div>
    //       </div>

    //       <div className="d-flex justify-content-between align-items-center">
    //         <div style={{ fontSize: '0.85rem' }}>Ulg: {(tank.capacity_l - tank.oil_volume).toLocaleString()} L</div>
    //         <div style={{ fontSize: '0.85rem' }}>{tank.oil_height} mm</div>
    //       </div>
    //     </div>

    //     {/* Water */}
    //     <div className="d-flex align-items-center justify-content-between p-2 mt-2">
    //       <div>
    //         <Droplet size={16} className="me-1 mb-1" />
    //         <span className="me-1">Water</span>
    //       </div>
    //       <div>
    //         <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{tank.water_volume} L</span>
    //         <span
    //           style={{
    //             marginLeft: '6px',
    //             fontSize: '0.85rem',
    //             color: theme === 'dark' ? '#e4e4e4' : '#666',
    //           }}
    //         >
    //           {tank.water_height} mm
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </CCard>
    <>
      <div
        className="d-flex flex-wrap justify-content-between align-items-stretch mb-5"
        style={{
          gap: '5px',
          // minHeight: '200px',
        }}
      >
        <CCard
          className="p-4 d-flex flex-row align-items-center  mx-auto me-1"
          style={{
            flex: '1 1 200px',
            height: '100%',
            borderRadius: '20px',
            background: cardColor,
            // theme === 'dark'
            //   ? 'linear-gradient(145deg, rgba(35,35,35,0.85), rgba(50,50,50,0.65))'
            //   : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow:
              theme === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            color: theme === 'dark' ? '#eaeaea' : '#333',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow =
              theme === 'dark' ? '0 10px 30px rgba(255,255,255,0.15)' : '0 10px 25px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow =
              theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <div className="text-center d-flex flex-column align-items-center w-100 me-4">
            <h6
              className="fw-bold mb-3"
              style={{
                fontSize: '1.1rem',
                letterSpacing: '0.4px',
                color: theme === 'dark' ? '#fff' : '#111',
              }}
            >
              Tank : {tank.tank_name}
            </h6>
            <DemoLiquid key={theme} theme={theme} color={tank.fuel_color || '#5a5a5a'} percent={percent} />
            <div className="mt-3">
              <h6
                className="fw-semibold"
                style={{
                  fontSize: '0.95rem',
                  color: theme === 'dark' ? '#f5f5f5' : '#222',
                  letterSpacing: '0.3px',
                }}
              >
                {tank.fuel_name}
              </h6>
            </div>
          </div>
        </CCard>

        <CCard
          className="p-4 d-flex flex-column justify-content-between mx-auto"
          style={{
            flex: '2 1 300px',
            height: '100%',
            minWidth: '300px',
            borderRadius: '20px',
            background: cardColor,
            // theme === 'dark'
            //   ? 'linear-gradient(145deg, rgba(35,35,35,0.85), rgba(50,50,50,0.65))'
            //   : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(240,240,240,0.8))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow:
              theme === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)'
                : '0 6px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
            color: theme === 'dark' ? '#eaeaea' : '#333',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow =
              theme === 'dark' ? '0 10px 30px rgba(255,255,255,0.15)' : '0 10px 25px rgba(0,0,0,0.15)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow =
              theme === 'dark' ? '0 8px 24px rgba(0, 0, 0, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          {/* กราฟวงกลม */}
          {/* <div className="text-center d-flex flex-column align-items-center w-25 me-4">
        <DemoLiquid key={theme} theme={theme} color={tank.fuel_color || '#5a5a5a'} percent={percent} />
        <div className="mt-3">
          <h6
            className="fw-semibold"
            style={{
              fontSize: '0.95rem',
              color: theme === 'dark' ? '#f5f5f5' : '#222',
              letterSpacing: '0.3px',
            }}
          >
            {tank.fuel_name}
          </h6>
        </div>
      </div> */}

          {/* ข้อมูล Tank */}
          <div className="d-flex flex-column justify-content-between w-100">
            <div className="d-flex align-items-center justify-content-between mb-2 ms-2">
              <h6
                className="fw-bold mb-0"
                style={{
                  fontSize: '1rem',
                  letterSpacing: '0.4px',
                  color: theme === 'dark' ? '#fff' : '#111',
                }}
              >
                Code : {tank.tank_code}
              </h6>
              <div className="d-flex align-items-center">
                <span
                  className="me-2"
                  style={{
                    color: textColor,
                    fontWeight: '500',
                    fontSize: '0.9rem',
                  }}
                >
                  {statusName}
                </span>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    boxShadow: `0 0 6px ${statusColor}`,
                  }}
                ></div>
              </div>
            </div>

            <div
              className="p-3 rounded-4 mt-2"
              style={{
                background: theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                boxShadow:
                  theme === 'dark' ? 'inset 0 0 12px rgba(255,255,255,0.05)' : 'inset 0 0 10px rgba(0,0,0,0.05)',
                transition: 'background 0.3s ease',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <Fuel size={18} className="me-2" />
                  <span style={{ fontWeight: 500 }}>Fuel</span>
                </div>
                <div style={{ fontSize: '0.85rem' }}>{tank.temp} °C</div>
              </div>

              <div className="mt-2 mb-2">
                <span
                  style={{
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    color: theme === 'dark' ? '#fff' : '#222',
                  }}
                >
                  {tank.oil_volume.toLocaleString()} L
                </span>
                <span
                  style={{
                    marginLeft: '6px',
                    fontSize: '0.9rem',
                    color: theme === 'dark' ? '#aaa' : '#666',
                  }}
                >
                  / {tank.capacity_l.toLocaleString()} L
                </span>
                <div
                  className="progress rounded-pill mt-3"
                  style={{
                    height: '7px',
                    background: theme === 'dark' ? '#1b1b1b' : '#ddd',
                  }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${tank.fuel_percent}%`,
                      backgroundColor: tank.fuel_color || '#5a5a5a',
                      borderRadius: '10px',
                    }}
                  ></div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-2">
                <span style={{ fontSize: '0.85rem' }}>
                  ULG: {(tank.capacity_l - (tank.oil_volume + tank.water_volume)).toLocaleString()} L
                </span>
                <span style={{ fontSize: '0.85rem' }}>{tank.oil_height} mm</span>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between p-2 mt-3 ms-1 me-1">
              <div className="d-flex align-items-center">
                <Droplet size={16} className="me-1 mb-1" />
                <span>Water</span>
              </div>
              <div>
                <span
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 'bold',
                    color: theme === 'dark' ? '#fff' : '#222',
                  }}
                >
                  {tank.water_volume} L
                </span>
                <span
                  style={{
                    marginLeft: '6px',
                    fontSize: '0.85rem',
                    color: theme === 'dark' ? '#aaa' : '#666',
                  }}
                >
                  {tank.water_height} mm
                </span>
              </div>
            </div>
          </div>
        </CCard>
      </div>
    </>
  )
}

export default React.memo(TankCard, (prevProps, nextProps) => {
  if (prevProps.theme !== nextProps.theme) return false
  if (prevProps.tank !== nextProps.tank) return false
  return true
})
