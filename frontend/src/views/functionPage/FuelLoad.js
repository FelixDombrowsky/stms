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

const FuelLoad = () => {
  const [fuelLoads, setFuelLoads] = useState([]) // เก็บทุกข้อมูล fuelload
  const [filterFuelLoad, setFilterFuelLoad] = useState([]) // เก็บแค่ fuelload ที่ตรงกับ tankcode ที่เลือกใน filter
  const [filterFuelLoadData, setFilterFuelLoadData] = useState([])
  const [tanks, setTanks] = useState([])
  const [fuelLevels, setFuelLevels] = useState([]) // มีระดับน้ำมัน 2 ข้อมูล : 1.Start 2.Stop

  // Form State
  const [tankCode, setTankCode] = useState('')
  const [orderVol, setOrderVol] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [dateStartISO, setDateStartISO] = useState('')
  const [dateEndISO, setDateEndISO] = useState('')
  const [volStart, setVolStart] = useState('')
  const [volEnd, setVolEnd] = useState('')
  const [loadedVol, setLoadedVol] = useState('')
  const [diffVol, setDiffVol] = useState('')
  const [description, setDescription] = useState('')

  const [dateStartFilter, setDateStartFilter] = useState('')
  const [dateEndFilter, setDateEndFilter] = useState('')

  const [addVisible, setAddVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletedId, setDeletedId] = useState('')
  const [updateVisible, setUpdateVisible] = useState(false)
  const [updatedId, setUpdatedId] = useState('')

  // Delete
  // const [deletedId, setDeletedId] = useState()

  // Utility
  // const filterByDateRange = (data, start, end) => {
  //   // Convert local -> UTC (ลบ offset ออก)
  //   const startUTC = new Date(start).getTime() - new Date(start).getTimezoneOffset() * 60000
  //   const endUTC = new Date(end).getTime() - new Date(end).getTimezoneOffset() * 60000

  //   console.log('Start (local):', start)
  //   console.log('End (local):', end)
  //   console.log('Start (UTC ms):', startUTC)
  //   console.log('End (UTC ms):', endUTC)

  //   return data.filter((item) => {
  //     const startItem = new Date(item.start_date).getTime()
  //     const endItem = new Date(item.end_date).getTime()

  //     // กรองโดยใช้เวลาในฐาน UTC เท่ากัน
  //     // return endItem >= startUTC && startItem <= endUTC
  //     return startItem >= startUTC && startItem <= endUTC && endItem <= endUTC && endItem >= startItem
  //   })
  // }

  const filterByDateRange = (data, start, end) => {
    const startTime = new Date(start).getTime()
    const endTime = new Date(end).getTime()
    return data.filter((item) => {
      const itemStartDate = new Date(item.start_date).getTime()
      const itemEndDate = new Date(item.end_date).getTime()
      console.log(
        'Return Data :',
        itemStartDate >= startTime && itemStartDate <= endTime && itemEndDate <= endTime && itemEndDate >= startTime,
      )

      return (
        itemStartDate >= startTime && itemStartDate <= endTime && itemEndDate <= endTime && itemEndDate >= startTime
      )
    })
  }

  const clearForm = () => {
    setOrderVol('')
    setDescription('')
    setDateStart('')
    setDateEnd('')
    setVolStart('')
    setVolEnd('')
    setLoadedVol('')
    setDiffVol('')
  }

  // Fetch Data
  const fetchFuelLoad = async () => {
    console.log('Fetch FuelLoad')
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

  const fetchFuelLevel = async (startISO, endISO) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/fuelLevel/levelByRange?tank_code=${tankCode}&start=${startISO}&end=${endISO}`,
      )
      console.log('fuel level :', data)
      setFuelLevels(data)
      setVolStart(data[0].oil_volume)
      setVolEnd(data[1].oil_volume)
      const load_vol = Number((data[1].oil_volume - data[0].oil_volume).toFixed(2))
      setLoadedVol(load_vol)
    } catch (err) {
      console.error(`Fetch Fuel Level By Range Error : ${err}`)
    }
  }

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tankCode') setTankCode(value)
    if (name === 'orderVol') setOrderVol(value)
    if (name === 'description') setDescription(value)
  }

  // Initial Load (7 วันย้อนหลัง)
  const fetchAllLast7Days = () => {
    fetchFuelLoad()
    fetchTanks()

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    setDateStartFilter(sevenDaysAgo)
    setDateEndFilter(now)
  }
  useEffect(() => {
    fetchAllLast7Days()
  }, [])

  // Filter by Tank
  useEffect(() => {
    const result = fuelLoads.filter((item) => item.tank_code === tankCode)
    setFilterFuelLoad(result)
  }, [fuelLoads, tankCode])

  // Filter by Date
  useEffect(() => {
    if (!dateStartFilter || !dateEndFilter) return
    console.log('Filter FUelload :', filterFuelLoad)
    const result = filterByDateRange(filterFuelLoad, dateStartFilter, dateEndFilter)
    setFilterFuelLoadData(result)
  }, [dateStartFilter, dateEndFilter, filterFuelLoad])

  // Export
  const handleExportExcel = () => {
    console.log('export excel')
  }

  useEffect(() => {
    const diff_vol = Number((loadedVol - orderVol).toFixed(2))
    setDiffVol(diff_vol)
  }, [orderVol, loadedVol])

  useEffect(() => {
    console.log('Date Start:', dateStart)
    console.log('Date End:', dateEnd)

    if (!dateStart && !dateEnd) {
      console.log('Clear Form')
      clearForm()
    }

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
      const startISO = dateStart.toISOString()
      const endISO = dateEnd.toISOString()

      setDateStartISO(startISO)
      setDateEndISO(endISO)

      console.log('👋 Fetch Time')
      fetchFuelLevel(startISO, endISO)
    }
  }, [dateStart, dateEnd])

  // Handle CRUD

  const handleSubmit = async (e) => {
    console.log('handle submit')
    e.preventDefault()

    try {
      if (!tankCode || !orderVol) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Tank Code and Order Vol are required!`,
          showConfirmButton: false,
          timer: 1500,
        })
      }

      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/function/fuelLoad`, {
        tank_code: tankCode,
        v_order: Number(orderVol),
        start_date: dateStartISO,
        end_date: dateEndISO,
        v_start: Number(volStart),
        v_end: Number(volEnd),
        v_load: Number(loadedVol),
        description: description,

        // for Auto Calibrate
        h1_auto: Number(fuelLevels[0].oil_height),
        v1_auto: Number((Number(fuelLevels[0].oil_volume || 0) + Number(fuelLevels[0].water_volume || 0)).toFixed(2)),
        h2_auto: Number(fuelLevels[1].oil_height),
        v2_auto: Number(
          (
            Number(fuelLevels[0].oil_volume || 0) +
            Number(fuelLevels[0].water_volume || 0) +
            Number(orderVol || 0)
          ).toFixed(2),
        ),
      })

      console.log('Write Fuelload Success:', data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Tank ${tankCode}Fuel Loading Success!`,
        showConfirmButton: false,
        timer: 1500,
      })

      clearForm()
      setAddVisible(false)
      //fetchAllLast7Days()
      fetchFuelLoad()
    } catch (err) {
      console.error('Add Fuel Load Error :', err)
    }
  }

  const handleUpdate = async (e) => {
    console.log('handle submit')
    e.preventDefault()

    try {
      if (!tankCode || !orderVol) {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: `Tank Code and Order Vol are required!`,
          showConfirmButton: false,
          timer: 1500,
        })
      }

      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/function/fuelLoad/${updatedId}`, {
        tank_code: tankCode,
        v_order: Number(orderVol),
        start_date: dateStartISO,
        end_date: dateEndISO,
        v_start: Number(volStart),
        v_end: Number(volEnd),
        v_load: Number(loadedVol),
        description: description,

        // for Auto Calibrate
        h1_auto: Number(fuelLevels[0].oil_height),
        v1_auto: Number((Number(fuelLevels[0].oil_volume || 0) + Number(fuelLevels[0].water_volume || 0)).toFixed(2)),
        h2_auto: Number(fuelLevels[1].oil_height),
        v2_auto: Number(
          (
            Number(fuelLevels[0].oil_volume || 0) +
            Number(fuelLevels[0].water_volume || 0) +
            Number(orderVol || 0)
          ).toFixed(2),
        ),
      })

      console.log(`Id ${updatedId} Updated Success`, data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Id ${updatedId} Updated Success!`,
        showConfirmButton: false,
        timer: 1500,
      })

      clearForm()
      setUpdateVisible(false)
      //fetchAllLast7Days()
      fetchFuelLoad()
    } catch (err) {
      console.error('Updated Fuel Load Error :', err)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Id ${updatedId} Updated Error!`,
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const handleDelete = async () => {
    try {
      console.log(`Handle Delete id ${deletedId}`)
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/function/fuelLoad/${Number(deletedId)}`)
      console.log('Delete Data :', data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Id ${deletedId} Deleted Successully!`,
        showConfirmButton: false,
        timer: 1500,
      })
      fetchFuelLoad()
      setDeletedId('')
      setDeleteVisible(false)
    } catch (err) {
      console.error('Delete Error :', err)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Id ${deletedId} Deleted Error!`,
        showConfirmButton: false,
        timer: 1500,
      })
      setDeletedId('')
      setDeleteVisible(false)
    }
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

  // CRUD Modal

  const addFuelLoad = () => {
    return (
      <CModal
        visible={addVisible}
        onClose={() => {
          setAddVisible(false)
          clearForm()
        }}
        size="lg"
        className="modal"
      >
        <CModalHeader className="h5 fw-bold">Add Fuel Load</CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody className="me-5">
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
                <CFormLabel htmlFor="orderVol" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
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
            <div className="d-flex align-items-center mb-3">
              <div className=" text-end pe-2" style={{ width: '173px', textAlign: 'right' }}>
                <CFormLabel htmlFor="dateRange" className=" me-0 fw-semibold">
                  Date Range :
                </CFormLabel>
              </div>
              <div style={{ textAlign: 'left' }}>
                <CDateRangePicker
                  startDate={dateStart}
                  endDate={dateEnd}
                  onStartDateChange={(date) => setDateStart(date)}
                  onEndDateChange={(date) => setDateEnd(date)}
                  timepicker={true}
                  portal={false}
                  locale="th"
                  required
                  // inputDateParse={(date) => parse(date, 'dd/MM/yyyy HH:mm:ss', new Date())}
                  // inputDateFormat={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss')}
                />
              </div>
            </div>

            {/* แถว 3 */}
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="volStart" className="mb-0 fw-semibold">
                    Vol Start (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="volStart"
                    name="volStart"
                    value={volStart}
                    // onChange={handleChange}

                    disabled
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="volEnd" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
                  Vol End (L) :
                </CFormLabel>

                <CFormInput
                  id="volEnd"
                  name="volEnd"
                  value={volEnd}
                  // onChange={handleChange}

                  disabled
                  required
                />
              </CCol>
            </CRow>

            {/* แถว 4 */}
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="loadedVol" className="mb-0 fw-semibold">
                    Loaded Vol (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="loadedVol"
                    name="loadedVol"
                    value={loadedVol}
                    // onChange={handleChange}

                    disabled
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="diffVol" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
                  Diff Vol (L) :
                </CFormLabel>

                <CFormInput
                  id="diffVol"
                  name="diffVol"
                  value={diffVol}
                  // onChange={handleChange}

                  disabled
                  required
                />
              </CCol>
            </CRow>

            {/* แถว 5 */}
            <div className="d-flex align-items-center mb-3">
              <div className=" text-end pe-2" style={{ width: '173px', textAlign: 'right' }}>
                <CFormLabel htmlFor="description" className=" me-0 fw-semibold">
                  Description :
                </CFormLabel>
              </div>
              <div style={{ textAlign: 'left' }}>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  rows={1}
                />
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setAddVisible(false)
                clearForm()
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    )
  }

  const updateFuelLoad = () => {
    return (
      <CModal
        visible={updateVisible}
        onClose={() => {
          setUpdateVisible(false)
          clearForm()
        }}
        size="lg"
        className="modal"
      >
        <CModalHeader className="h5 fw-bold">Edit Fuel Load Id {updatedId}</CModalHeader>
        <CForm onSubmit={handleUpdate}>
          <CModalBody className="me-5">
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
                <CFormLabel htmlFor="orderVol" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
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
            <div className="d-flex align-items-center mb-3">
              <div className=" text-end pe-2" style={{ width: '173px', textAlign: 'right' }}>
                <CFormLabel htmlFor="dateRange" className=" me-0 fw-semibold">
                  Date Range :
                </CFormLabel>
              </div>
              <div style={{ textAlign: 'left' }}>
                <CDateRangePicker
                  startDate={dateStart}
                  endDate={dateEnd}
                  onStartDateChange={(date) => setDateStart(date)}
                  onEndDateChange={(date) => setDateEnd(date)}
                  timepicker={true}
                  portal={false}
                  locale="th"
                  required
                  // inputDateParse={(date) => parse(date, 'dd/MM/yyyy HH:mm:ss', new Date())}
                  // inputDateFormat={(date) => format(new Date(date), 'dd/MM/yyyy HH:mm:ss')}
                />
              </div>
            </div>

            {/* แถว 3 */}
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="volStart" className="mb-0 fw-semibold">
                    Vol Start (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="volStart"
                    name="volStart"
                    value={volStart}
                    // onChange={handleChange}

                    disabled
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="volEnd" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
                  Vol End (L) :
                </CFormLabel>

                <CFormInput
                  id="volEnd"
                  name="volEnd"
                  value={volEnd}
                  // onChange={handleChange}

                  disabled
                  required
                />
              </CCol>
            </CRow>

            {/* แถว 4 */}
            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="loadedVol" className="mb-0 fw-semibold">
                    Loaded Vol (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="loadedVol"
                    name="loadedVol"
                    value={loadedVol}
                    // onChange={handleChange}

                    disabled
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="diffVol" className="mb-0 me-2 fw-semibold" style={{ width: '170px' }}>
                  Diff Vol (L) :
                </CFormLabel>

                <CFormInput
                  id="diffVol"
                  name="diffVol"
                  value={diffVol}
                  // onChange={handleChange}

                  disabled
                  required
                />
              </CCol>
            </CRow>

            {/* แถว 5 */}
            <div className="d-flex align-items-center mb-3">
              <div className=" text-end pe-2" style={{ width: '173px', textAlign: 'right' }}>
                <CFormLabel htmlFor="description" className=" me-0 fw-semibold">
                  Description :
                </CFormLabel>
              </div>
              <div style={{ textAlign: 'left' }}>
                <CFormTextarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={handleChange}
                  rows={1}
                />
              </div>
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setUpdateVisible(false)
                clearForm()
              }}
            >
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              Save
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    )
  }

  const deleteFuelLoad = () => {
    return (
      <CModal visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete FuelLoad</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Are you sure to delete id "<b>{deletedId}</b>" ?
          </p>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteVisible(false) & setDeletedId('')}>
              Cancel
            </CButton>
            <CButton color="primary" onClick={() => handleDelete()}>
              Submit
            </CButton>
          </CModalFooter>
        </CModalBody>
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
      {addVisible === true && addFuelLoad()}
      {updateVisible === true && updateFuelLoad()}
      {deleteVisible === true && deleteFuelLoad()}

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
          <div className="pb-1 pt-1">
            <h6 className="mb-0 fw-bold">Fuel Loading</h6>
          </div>
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
              items={filterFuelLoadData}
              columns={[
                { key: 'id', label: 'Id', _style: { width: '50px', textAlign: 'center' } },
                { key: 'tank_name', label: 'Tank', _style: { width: '70px' } },
                { key: 'start_date', label: 'Date Start', _style: { width: '160px' } },
                { key: 'end_date', label: 'Date End', _style: { width: '160px' } },
                { key: 'v_start', label: 'V Start (L)', _style: { width: '100px' } },
                { key: 'v_end', label: 'V End (L)', _style: { width: '90px' } },

                { key: 'v_load', label: 'Actual V (L)', _style: { width: '70px' } },
                { key: 'v_order', label: 'Order V (L)', _style: { width: '70px' } },
                { key: 'diff', label: 'Diff (L)', _style: { width: '80px' } },
                { key: 'description', label: 'Description', _style: { width: '60px' }, filter: false, sorter: false },
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

export default FuelLoad
