import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CSmartTable,
  CRow,
  CCol,
  CFormLabel,
  CFormSwitch,
  CDateRangePicker,
  CFormSelect,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormTextarea,
  CModalTitle,
  
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilPlus,
  cilPen,
  cilPencil,
  cilTrash,
  cilArrowCircleBottom,
  cilArrowCircleTop,
  cilClipboard,
  cilPrint,
  cilPaintBucket,
} from '@coreui/icons'
import Swal from 'sweetalert2'

const fuelLevelReport = () => {
  const [tankCode, setTankCode] = useState('')
  const [tanks, setTanks] = useState([])

  const [dateStartFilter, setDateStartFilter] = useState('')
  const [dateEndFilter, setDateEndFilter] = useState('')
  const [filterFuelLoadData, setFilterFuelLoadData] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tankCode') setTankCode(value)
    console.log('Tank Code :', value)
  }
  const customRanges = {
    Today: [
      (() => {
        const start = new Date()
        start.setHours(0, 0, 0, 0)
        return start
      })(),
      new Date(),
    ],
    Yesterday: [
      (() => {
        const start = new Date()
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0) //เมื่อวาน 00:00:00
        return start
      })(),
      (() => {
        const end = new Date()
        end.setDate(end.getDate() - 1)
        end.setHours(23, 59, 59, 999) // เมื่อวาน 23:59:59
        return end
      })(),
    ],
    'Last 7 Days': [
      (() => {
        const start = new Date()
        start.setDate(start.getDate() - 6)
        start.setHours(0, 0, 0, 0)
        return start
      })(),
      new Date(),
    ],
    'Last 30 Days': [
      (() => {
        const start = new Date()
        start.setDate(start.getDate() - 29)
        start.setHours(0, 0, 0, 0)
        return start
      })(),
      new Date(),
    ],
    'This Month': [
      (() => {
        const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        start.setHours(0, 0, 0, 0)
        return start
      })(),
      new Date(),
    ],
    'Last Month': [
      (() => {
        const start = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
        start.setHours(0, 0, 0, 0)
        return start
      })(),
      (() => {
        const end = new Date(new Date().getFullYear(), new Date().getMonth(), 0)
        end.setHours(23, 59, 59, 999)
        return end
      })(),
    ],
  }
  const handleExportExcel = () => {
    console.log('Export Excel')
  }

  const fetchTanks = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tank/setting`)
      console.log('tanks :', data)
      setTanks(data)
      setTankCode(data[0].code)
    } catch (err) {
      console.error(`Fetch Tank Error : ${err}`)
    }
  }
  useEffect(() => {
    fetchTanks()
  }, [])
  return (
    <>
      {/* {addVisible === true && addFuelLoad()}
        {updateVisible === true && updateFuelLoad()}
        {deleteVisible === true && deleteFuelLoad()} */}

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <CFormLabel htmlFor="tank" className="mb-0 me-2 ms-3">
            <b>Tank :</b>
          </CFormLabel>
          <CFormSelect
            id="tankCode"
            name="tankCode"
            value={tankCode}
            onChange={handleChange}
            style={{ width: '120px' }}
          >
            {tanks.map((item, index) => (
              <option value={item.code} key={index}>
                {item.tank_name}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div></div>
      </div>

      <CCard>
        <CCardHeader
          className="pb-3 pt-3"
          style={{
            background: '#4B79A1',
            color: 'white',
            fontWeight: '600',
            letterSpacing: '0.5px',
            borderBottom: '2px solid #2c3e50',
            boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.2)',
            // width: sidebarShow ? 'calc(100% - 250px)' : '100%',
            // marginLeft: sidebarShow ? '250px' : '0',
          }}
        >
          <h6 className="mb-0 fw-bold">Fuel Level Report</h6>
        </CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div className="mb-2 mt-3 ms-3 d-flex align-items-center">
            <div className="mb-0 me-2 mt-2">
              <h6>Time Range :</h6>
            </div>

            <div style={{ maxWidth: '420px' }}>
              <CDateRangePicker
                startDate={dateStartFilter}
                endDate={dateEndFilter}
                onStartDateChange={(date) => setDateStartFilter(date)}
                onEndDateChange={(date) => setDateEndFilter(date)}
                timepicker={true}
                ranges={customRanges}
                locale="th"
              />
            </div>
            {/* <div className="ms-3">
                <CButton color="primary" size="md" variant="outline">
                  <CIcon icon={cilClipboard} className="me-2" />
                  Generate
                </CButton>
              </div> */}
          </div>
          <div style={{ textAlign: 'end' }} className="me-3 mt-3 mb-1 d-flex align-items-center">
            <CButton
              className="d-flex align-items-center"
              color="secondary"
              size="md"
              variant="outline"
              onClick={handleExportExcel}
            >
              <CIcon icon={cilPrint} className="me-2" />
              Export
            </CButton>

            {/* <CButton
              color="primary"
              size="md"
              className="fw-semibold d-flex justify-content-between align-items-center ps-1 pe-3 pt-2 pb-2 ms-3 mb-0"
              style={{
                border: '2px solid #ffffffff',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 255, 255)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              onClick={() => {
                setAddVisible(true)
              }}
            >
              <CIcon icon={cilPlus} size="xl" className="me-2 ms-2" style={{ color: '#fff' }} />
              <p className="mb-0 fw-bold fs-6" style={{ color: '#fff' }}>
                Loading
              </p>
            </CButton> */}
          </div>
        </div>

        <CCardBody>
          <CCard style={{ border: 0, padding: 0 }}>
            <CSmartTable
              items={filterFuelLoadData}
              columns={[
                { key: 'id', label: 'Id', _style: { width: '5%', textAlign: 'center' } },
                { key: 'tank_name', label: 'Tank', _style: { width: '8%' } },
                { key: 'time', label: 'Time', _style: { width: '20%' } },
                //  { key: 'end_date', label: 'Date End', _style: { width: '160px' } },
                { key: 'oil_volume', label: 'Oil (L)', _style: { width: '10%' } },
                { key: 'oil_percent', label: 'Oil (%)', _style: { width: '10%' } },

                { key: 'water_volume', label: 'Water (L)', _style: { width: '10%' } },
                { key: 'water_percent', label: 'Water (L%)', _style: { width: '10%' } },
                { key: 'temp', label: 'Temp (°C)', _style: { width: '10%' } },
                { key: 'status', label: 'Status', _style: { width: '15%' }, filter: false, sorter: false },
                //  { key: 'actions', label: '', _style: { width: '50px' }, filter: false, sorter: false },

                // { key: 'actions', label: '', _style: { width: '20px' }, filter: false, sorter: false },
              ]}
              columnSorter
              columnFilter
              tableProps={{ hover: true, responsive: true }}
              tableBodyProps={{ className: 'align-middle' }}
              itemsPerPage={5}
              pagination
              scopedColumns={{
                id: (item) => <td className="text-start ps-3">{item.id?.toLocaleString('th-TH')}</td>,
                start_date: (item) => {
                  return <td className="text-start">{new Date(item.start_date).toLocaleString('th-TH')}</td>
                },
                end_date: (item) => {
                  return <td className="text-start">{new Date(item.end_date).toLocaleString('th-TH')}</td>
                },
                v_start: (item) => <td>{item.v_start?.toLocaleString('th-TH')}</td>,
                v_end: (item) => <td>{item.v_end?.toLocaleString('th-TH')}</td>,
                v_load: (item) => <td>{item.v_load?.toLocaleString('th-TH')}</td>,
                v_order: (item) => <td>{item.v_order?.toLocaleString('th-TH')}</td>,

                diff: (item) => {
                  let color
                  let absNumber
                  if (item.diff >= 0) {
                    color = 'rgba(26, 188, 26, 1)'
                    absNumber = item.diff
                  } else {
                    color = 'rgba(228, 42, 29, 1)'
                    absNumber = Math.abs(item.diff)
                  }

                  return <td style={{ color }}>{absNumber.toLocaleString('th-TH')}</td>
                },
                actions: (item) => (
                  <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    <CButton
                      className="me-3 p-0"
                      onClick={() => {
                        setOrderVol(Number(item.v_order))

                        console.log('Date Start #Before:', item.start_date)
                        console.log('End Start #Before:', item.end_date)
                        // แปลง string -> Date Object
                        const start = new Date(item.start_date)
                        const end = new Date(item.end_date)
                        setDateStart(start)
                        setDateEnd(end)

                        console.log('Date Start #After:', start)
                        console.log('End Start #After:', end)
                        console.log('Date Start #AfterConverted:', start.toISOString())
                        console.log('End Start #AfterConverted:', end.toISOString())

                        setVolStart(item.v_start)
                        setVolEnd(item.v_end)
                        setLoadedVol(item.v_load)
                        setDescription(item.description)
                        // v_start: Number(volStart)
                        // v_end: Number(volEnd)
                        // v_load: Number(loadedVol)
                        // description: description

                        setUpdatedId(item.id)
                        setUpdateVisible(true)
                      }}
                    >
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton
                      className="p-0"
                      onClick={() => {
                        // console.log(`Id ${item.id}`)
                        setDeletedId(item.id)
                        setDeleteVisible(true)
                        // deleteFuelLoad(item.id)
                        // handleDelete(item.id)
                      }}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </td>
                ),
              }}
            />
          </CCard>
        </CCardBody>
      </CCard>
    </>
  )
}

export default fuelLevelReport
