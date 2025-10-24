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

const FuelLoad = () => {
  const [fuelLoads, setFuelLoads] = useState([]) // เก็บทุกข้อมูล fuelload
  const [filterFuelLoad, setFilterFuelLoad] = useState([]) // เก็บแค่ fuelload ที่ตรงกับ tankcode ที่เลือกใน filter
  const [tanks, setTanks] = useState([])

  //Form State
  const [tankCode, setTankCode] = useState('')
  const [orderVol, setOrderVol] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const [addVisible, setAddVisible] = useState(false)

  const sidebarShow = useSelector((state) => state.sidebarShow)

  const handleExportExcel = () => {
    console.log('export excel')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tankCode') setTankCode(value)
    if (name === 'orderVol') setOrderVol(value)
    console.log('Date Start:', dateStart)
    console.log('Date End:', dateEnd)
    console.log('Date Start (ISO) :', dateStart.toISOString())
    console.log('Date End (ISO) :', dateEnd.toISOString())
    // if (name === 'dateRange') setDateRange(value)
  }

  const fetchFuelLoad = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/function/fuelLoad/all`)
      console.log('FuelLoad Data :', data)
      const formatted = data.map((item) => ({
        id: item.id,
        tank_code: item.tank_code,
        tank_name: item.tank_name,
        v_order: item.v_order,
        start_date: item.start_date,
        end_date: item.end_date,
        v_start: item.v_start,
        v_end: item.v_end,
        v_load: item.v_load,
        description: item.description,
        diff: Number((item.v_load - item.v_order).toFixed(2)),
      }))
      setFuelLoads(formatted)
    } catch (err) {
      console.error(`Fetch Fuel Load Error : ${err}`)
    }
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

  const fetchFuelLevel = async () => {
    
  }

  useEffect(() => {
    console.log('tank code :', tankCode)
    const filter_fuelLoad = fuelLoads.filter((item) => item.tank_code === tankCode)
    setFilterFuelLoad(filter_fuelLoad)
  }, [fuelLoads, tanks, tankCode])

  useEffect(() => {
    fetchFuelLoad()
    fetchTanks()
  }, [])

  useEffect(() => {
    console.log('Date Start:', dateStart)
    console.log('Date End:', dateEnd)

    if (dateStart instanceof Date) {
      console.log('Date Start (ISO):', dateStart.toISOString())
    } else {
      console.log('Date Start (string):', dateStart)
    }

    if (dateEnd instanceof Date) {
      console.log('Date End (ISO):', dateEnd.toISOString())
    } else {
      console.log('Date End (string):', dateEnd)
    }

    if (dateStart instanceof Date && dateEnd instanceof Date) {
      console.log('👋 Fetch Time')
      fetchFuelLevel()
    }
  }, [dateStart, dateEnd])

  const handleSubmit = () => {
    console.log('handle submit')
  }

  const addFuelLoad = () => {
    return (
      <CModal visible={addVisible} onClose={() => setAddVisible(false)} size="lg" className="modal">
        <CModalHeader className="h5 fw-bold">Add Fuel Load</CModalHeader>
        <CModalBody className="me-5">
          <CForm onSubmit={handleSubmit}>
            {/* แถวแรก */}
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="tankCode" className="mb-0 fw-semibold">
                    Tank :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormSelect id="tankCode" name="tankCode" value={tankCode} onChange={handleChange} disabled>
                    {tanks.map((item, index) => (
                      <option value={item.code} key={index}>
                        {item.tank_name}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="orderVol" className="mb-0 me-2 fw-semibold" style={{ width: '160px' }}>
                  Order Vol (L) :
                </CFormLabel>

                <CFormInput
                  id="orderVol"
                  name="orderVol"
                  value={orderVol}
                  type="number"
                  step="any"
                  min="0"
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter fuel volume"
                  required
                />
              </CCol>
            </CRow>

            {/* แถว 2 */}
            <CRow className="mb-3 ms-5">
              <CCol md={12} className="d-flex align-items-center text-center">
                <div className=" text-start pe-2">
                  <CFormLabel htmlFor="dateRange" className="mb-0 me-2 fw-semibold">
                    Date Range :
                  </CFormLabel>
                </div>
                <div>
                  <CDateRangePicker
                    startDate={dateStart}
                    endDate={dateEnd}
                    onStartDateChange={(date) => setDateStart(date)}
                    onEndDateChange={(date) => setDateEnd(date)}
                    timepicker={true}
                    portal={false}
                    locale="th"
                    // inputDateParse={(date) => parse(date, 'dd/MM/yyyy HH:mm:ss', new Date())}
                    // inputDateFormat={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss')}
                  />
                </div>
              </CCol>
            </CRow>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setAddVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary">Save</CButton>
        </CModalFooter>
      </CModal>
    )
  }

  // กัน user refresh หน้าจอ
  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault()
  //     event.returnValue = '' // จำเป็นต้องมีในบาง browser เช่น Chrome
  //   }

  //   window.addEventListener('beforeunload', handleBeforeUnload)

  //   // cleanup เมื่อออกจากหน้า
  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload)
  //   }
  // }, [startLoad])

  return (
    <>
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
        <div>
          {/* <CButton
            color="success"
            onClick={() => {
              setStartLoad(1)
            }}
            size="md"
            className="fw-semibold d-flex justify-content-between align-items-center ps-1 pe-3 pt-2 pb-2 ms-3 me-2"
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
          >
            <CIcon icon={cilPaintBucket} size="xl" className="me-2 ms-2" style={{ color: '#fff' }} />
            <p className="mb-0 fw-bold fs-6" style={{ color: '#fff' }}>
              Start Load
            </p>
          </CButton> */}
        </div>
      </div>

      <CCard
        style={{
          transition: 'all 0.3s ease',
          width: sidebarShow ? '100%' : '100%', // ✅ ปรับขนาดเมื่อ Sidebar เปิด/ปิด
          marginLeft: sidebarShow ? '0' : '0', // ✅ ขยับเนื้อหาให้พอด
        }}
      >
        <CCardHeader
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
          <div className="pb-2 pt-2">
            <h5 className="mb-0 fw-bold">Fuel Loading</h5>
          </div>
        </CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div className="mb-2 mt-3 ms-3 d-flex align-items-center">
            <div className="mb-0 me-2 mt-2">
              <h6>Time Range :</h6>
            </div>

            <div style={{ maxWidth: '400px' }}>
              <CDateRangePicker timepicker={true} locale="th" />
            </div>
            <div className="ms-3">
              <CButton color="primary" size="md" variant="outline">
                <CIcon icon={cilClipboard} className="me-2" />
                Generate
              </CButton>
            </div>
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

            <CButton
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
            </CButton>
          </div>
        </div>

        <CCardBody>
          <CCard style={{ border: 0, padding: 0 }}>
            <CSmartTable
              items={filterFuelLoad}
              columns={[
                { key: 'id', label: 'Id', _style: { width: '60px', textAlign: 'center' } },
                { key: 'tank_name', label: 'Tank' },
                { key: 'start_date', label: 'Date Start' },
                { key: 'end_date', label: 'Date End' },
                { key: 'v_start', label: 'V Start(L)', _style: { width: '110px' } },
                { key: 'v_end', label: 'V End(L)' },
                { key: 'v_end', label: 'V End(L)' },
                { key: 'v_load', label: 'Actual V(L)' },
                { key: 'v_order', label: 'Order V(L)' },
                { key: 'diff', label: 'Diff(L)' },
                { key: 'description', label: 'Descript' },
                { key: 'actions', label: '', _style: { width: '50px' }, filter: false, sorter: false },

                // { key: 'actions', label: '', _style: { width: '20px' }, filter: false, sorter: false },
              ]}
              columnSorter
              columnFilter
              tableProps={{ hover: true, responsive: true }}
              tableBodyProps={{ className: 'align-middle' }}
              itemsPerPage={5}
              pagination
              scopedColumns={{
                id: (item) => <td className="text-start ps-3">{item.id}</td>,
                actions: (item) => (
                  <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                    <CButton className="me-3 p-0">
                      <CIcon icon={cilPencil} />
                    </CButton>
                    <CButton className="p-0">
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </td>
                ),
              }}
            />
          </CCard>
        </CCardBody>
      </CCard>
      {addVisible === true && addFuelLoad()}
    </>
  )
}

export default FuelLoad
