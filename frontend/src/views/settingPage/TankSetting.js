import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CCardHeader,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CForm,
  CFormInput,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSelect,
  CSmartTable,
  CFormLabel,
  CBadge,
  CCollapse,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPen, cilPencil, cilTrash } from '@coreui/icons'

const TankSetting = () => {
  const [tanks, setTanks] = useState([])
  const [probes, setProbes] = useState([])
  const [fuels, setFuels] = useState([])

  const [addVisible, setAddVisible] = useState(false)
  const [deleteVisible, setDeleteVisible] = useState(0)
  const [deleteCode, setDeleteCode] = useState('')
  const [updateVisible, setUpdateVisible] = useState(0)

  // form state
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [probeId, setProbeId] = useState('')
  const [fuelCode, setFuelCode] = useState('')
  const [capacity, setCapacity] = useState('')
  const [tankType, setTankType] = useState(1)
  const [vertical, setVertical] = useState('')
  const [horizontal, setHorizontal] = useState('')
  const [tankLength, setTankLength] = useState('')
  const [calCapacity, setCalCapacity] = useState('')
  const [compOil, setCompOil] = useState(0)
  const [compWater, setCompWater] = useState(0)
  const [highAlarm, setHighAlarm] = useState('')
  const [highAlert, setHighAlert] = useState('')
  const [lowAlarm, setLowAlarm] = useState('')
  const [waterAlarm, setWaterAlarm] = useState('')

  useEffect(() => {
    calculate_capacity()
  }, [vertical, horizontal, tankLength])

  const calculate_capacity = () => {
    if (
      horizontal !== '' &&
      vertical !== '' &&
      tankLength !== '' &&
      !isNaN(horizontal) &&
      !isNaN(vertical) &&
      !isNaN(tankLength)
    ) {
      console.log('Tank Calculate not nan')

      const a = parseFloat(horizontal)
      const b = parseFloat(vertical)
      const l = parseFloat(tankLength)
      const cal_capacity = (Math.PI * a * b * l) / 4_000_000

      console.log(`Cal Capacity : `, parseFloat(cal_capacity).toFixed(2))
      setCalCapacity(parseFloat(cal_capacity).toFixed(2))
    } else {
      console.log('tank calculate is Nan')
      setCalCapacity('')
      return
    }
  }

  const fetchTankData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tank/setting`)
      console.log('Tank data : ', data)
      const formatted = data.map((item) => ({
        code: item.code,
        tank_name: item.tank_name,
        probe_id: item.probe_id,
        fuel_code: item.fuel_code,
        capacity_l: item.capacity_l,
        tank_type: item.tank_type,
        vertical_mm: item.vertical_mm,
        horizontal_mm: item.horizontal_mm,
        length_mm: item.length_mm,
        cal_capacity_l: item.cal_capacity_l,
        comp_oil_mm: item.comp_oil_mm,
        comp_water_mm: item.comp_water_mm,
        high_alarm_l: item.high_alarm_l,
        high_alert_l: item.high_alert_l,
        low_alarm_l: item.low_alarm_l,
        water_high_alarm_l: item.water_high_alarm_l,
        fuel_name: item.fuel_name?.fuel_name || null,
      }))

      setTanks(formatted)
    } catch (err) {
      console.error(`Fetch Tank Data Error : ${err}`)
    }
  }

  const fetchProbeData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/probe/setting`)
      console.log('Probe data : ', data)
      setProbes(data)
    } catch (err) {
      console.error(`Fetch Probe Data Error : ${err}`)
    }
  }

  const fetchFuelData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/name`)
      console.log('Fuel Data : ', data)
      setFuels(data)
    } catch (err) {
      console.error(`Fetch Fuel Data Error : ${err}`)
    }
  }

  useEffect(() => {
    fetchTankData()
    fetchProbeData()
    fetchFuelData()
  }, [])

  const clearForm = () => {
    setCode('')
    setName('')
    setProbeId('')
    setFuelCode('')
    setCapacity('')
    setTankType(1)
    setVertical('')
    setHorizontal('')
    setTankLength('')
    setCalCapacity('')
    setCompOil(0)
    setCompWater(0)
    setHighAlarm('')
    setHighAlert('')
    setLowAlarm('')
    setWaterAlarm('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'code') setCode(value)
    if (name === 'name') setName(value)
    if (name === 'probeId') setProbeId(value)
    if (name === 'fuelCode') setFuelCode(value)
    if (name === 'capacity') setCapacity(value)
    if (name === 'tankType') setTankType(value)
    if (name === 'vertical') setVertical(value)
    if (name === 'horizontal') setHorizontal(value)
    if (name === 'tankLength') setTankLength(value)
    if (name === 'calCapacity') setCalCapacity(value)
    if (name === 'compOil') setCompOil(value)
    if (name === 'compWater') setCompWater(value)
    if (name === 'highAlarm') setHighAlarm(value)
    if (name === 'highAlert') setHighAlert(value)
    if (name === 'lowAlarm') setLowAlarm(value)
    if (name === 'waterAlarm') setWaterAlarm(value)

    console.log('Comp Oil :', compOil)
    console.log('Comp water :', compWater)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!code || code.trim() === '') {
      alert(`Tank Code is null!, please fill it again.`)
      return
    }
    if (!name || name.trim() === '') {
      alert(`Tank Name is null!, please fill it again.`)
      return
    }
    if (!capacity || capacity.trim() === '') {
      alert(`Capacity is null!, please fill it again.`)
      return
    }
    if (!vertical || vertical.trim() === '') {
      alert(`Vertical is null!, please fill it again.`)
      return
    }
    if (!horizontal || horizontal.trim() === '') {
      alert(`Horizontal is null!, please fill it again.`)
      return
    }
    if (!tankLength || tankLength.trim() === '') {
      alert(`Tank Length is null!, please fill it again.`)
      return
    }
    if (!compOil && compOil !== 0) {
      console.log('Comp Oil : ', compOil)
      alert(`Comp Oil is null!, please fill it again.`)
      return
    }
    if (!compWater && compWater !== 0) {
      console.log('Comp Water : ', compWater)
      alert(`Comp Water is null!, please fill it again.`)
      return
    }
    if (!highAlarm || highAlarm.trim() === '') {
      alert(`Oil High Alarm is null!, please fill it again.`)
      return
    }
    if (!highAlert || highAlert.trim() === '') {
      alert(`Oil High Alert is null!, please fill it again.`)
      return
    }
    if (!lowAlarm || lowAlarm.trim() === '') {
      alert(`Oil Low Alarm is null!, please fill it again.`)
      return
    }
    if (isNaN(parseFloat(waterAlarm)) || waterAlarm.trim() === '') {
      alert(`Water High Alarm is null!, please fill it again.`)
      return
    }

    for (let i = 0; i < tanks.length; i++) {
      console.log(`i:${i}`)
      if (code === tanks[i].code) {
        console.log(`Tank Code ${code} is already used!`)
        alert(`Code ${code} is already used!`)
        return
      }
    }
    try {
      const payload = {
        code: code,
        name: name,
        probe_id: probeId,
        fuel_code: fuelCode,
        capacity: parseFloat(capacity).toFixed(2),
        tank_type: Number(tankType),
        vertical: parseFloat(vertical).toFixed(2),
        horizontal: parseFloat(horizontal).toFixed(2),
        tank_length: parseFloat(tankLength).toFixed(2),
        cal_capacity: parseFloat(calCapacity).toFixed(2),
        comp_oil: parseFloat(compOil).toFixed(2),
        comp_water: parseFloat(compWater).toFixed(2),
        high_alarm: parseFloat(highAlarm).toFixed(2),
        high_alert: parseFloat(highAlert).toFixed(2),
        low_alarm: parseFloat(lowAlarm).toFixed(2),
        water_alarm: parseFloat(waterAlarm).toFixed(2),
      }
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/tank/setting`, payload)
      console.log(`data: `, data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Tank code ${code} add successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      // setFuelNames((prev) => [data.data, ...prev])
      fetchTankData()

      clearForm()

      setAddVisible(false)
    } catch (err) {
      console.error(`Add Tank error : ${err}`)
      // alert(`Add Tank error!`)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Add Tank Error!`,
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    if (!code || code.trim() === '') {
      alert(`Tank Code is null!, please fill it again.`)
      return
    }
    if (!name || name.trim() === '') {
      alert(`Tank Name is null!, please fill it again.`)
      return
    }
    if (!capacity || capacity.trim() === '') {
      alert(`Capacity is null!, please fill it again.`)
      return
    }
    if (!vertical || vertical.trim() === '') {
      alert(`Vertical is null!, please fill it again.`)
      return
    }
    if (!horizontal || horizontal.trim() === '') {
      alert(`Horizontal is null!, please fill it again.`)
      return
    }
    if (!tankLength || tankLength.trim() === '') {
      alert(`Tank Length is null!, please fill it again.`)
      return
    }
    if (!compOil && compOil !== 0) {
      console.log('Comp Oil : ', compOil)
      alert(`Comp Oil is null!, please fill it again.`)
      return
    }
    if (!compWater && compWater !== 0) {
      console.log('Comp Water : ', compWater)
      alert(`Comp Water is null!, please fill it again.`)
      return
    }
    if (!highAlarm || highAlarm.trim() === '') {
      alert(`Oil High Alarm is null!, please fill it again.`)
      return
    }
    if (!highAlert || highAlert.trim() === '') {
      alert(`Oil High Alert is null!, please fill it again.`)
      return
    }
    if (!lowAlarm || lowAlarm.trim() === '') {
      alert(`Oil Low Alarm is null!, please fill it again.`)
      return
    }
    if (isNaN(parseFloat(waterAlarm)) || waterAlarm.trim() === '') {
      alert(`Water High Alarm is null!, please fill it again.`)
      return
    }

    try {
      const payload = {
        name: name,
        probe_id: probeId,
        fuel_code: fuelCode,
        capacity: parseFloat(capacity).toFixed(2),
        tank_type: Number(tankType),
        vertical: parseFloat(vertical).toFixed(2),
        horizontal: parseFloat(horizontal).toFixed(2),
        tank_length: parseFloat(tankLength).toFixed(2),
        cal_capacity: parseFloat(calCapacity).toFixed(2),
        comp_oil: parseFloat(compOil).toFixed(2),
        comp_water: parseFloat(compWater).toFixed(2),
        high_alarm: parseFloat(highAlarm).toFixed(2),
        high_alert: parseFloat(highAlert).toFixed(2),
        low_alarm: parseFloat(lowAlarm).toFixed(2),
        water_alarm: parseFloat(waterAlarm).toFixed(2),
      }
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/tank/setting/${code.trim()}`, payload)
      console.log(`data: `, data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Tank code ${code} updated successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      // setFuelNames((prev) => [data.data, ...prev])
      fetchTankData()

      clearForm()

      setUpdateVisible(false)
    } catch (err) {
      console.error(`Update Tank error : ${err}`)
      // alert(`Add Tank error!`)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Update Tank Error!`,
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const handleDelete = async () => {
    console.log('delete_code:', deleteCode)
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tank/setting/${deleteCode}`)
      console.log('delete data:', data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Tank code ${deleteCode} deleted successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      fetchTankData()
      // setFuelNames((prev) => prev.filter((f) => f.fuel_type_code !== deleteCode))

      setDeleteCode('')
      setDeleteVisible(false)
    } catch (err) {
      console.log('Delete tank error:', err)
      // alert('Delete Tank error!')
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `Delete Tank Error!`,
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const addTank = () => {
    console.log('add tank')
    return (
      <CModal
        // style={{ width: '500px' }}
        size="lg"
        visible={addVisible}
        onClose={() => {
          setAddVisible(false)
          clearForm()
        }}
      >
        <CModalHeader>
          <CModalTitle>Add Tank</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="code" className="mb-0 fw-semibold">
                    Tank Code :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="code"
                    name="code"
                    value={code}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Code e.g. 001"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="name" className="mb-0 me-1 fw-semibold" style={{ width: '150px' }}>
                  Tank Name :
                </CFormLabel>

                <CFormInput
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter Tank Name"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="probeId" className="mb-0 fw-semibold">
                    Probe Id :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormSelect id="probeId" name="probeId" value={probeId} onChange={handleChange} required>
                    <option value="" disabled>
                      Select Probe
                    </option>
                    {probes.map((item, index) => (
                      <option value={item.probe_id} key={index}>
                        {item.probe_id}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="fuelCode" className="mb-0 me-1 fw-semibold" style={{ width: '150px' }}>
                  Fuel Name :
                </CFormLabel>

                <CFormSelect id="fuelCode" name="fuelCode" value={fuelCode} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel
                  </option>
                  {fuels.map((item, index) => (
                    <option value={item.fuel_code} key={index}>
                      {item.fuel_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="capacity" className="mb-0 fw-semibold">
                    Tank Capacity (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="capacity"
                    type="number"
                    step="any"
                    min="0"
                    name="capacity"
                    value={capacity}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Capacity"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="tankType" className="mb-0 me-1 fw-semibold" style={{ width: '150px' }}>
                  Tank Type :
                </CFormLabel>

                <CFormSelect id="tankType" name="tankType" value={tankType} onChange={handleChange} required>
                  <option value="">Select Tank Type</option>
                  <option value={1}>Horizontal</option>
                  <option value={2}>Vertical</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="vertical" className="mb-0 fw-semibold">
                    Vertical (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="vertical"
                    type="number"
                    step="any"
                    min="0"
                    name="vertical"
                    value={vertical}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Vertical Length"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="horizontal" className="mb-0 me-1 fw-semibold" style={{ width: '230px' }}>
                  Horizontal (mm) :
                </CFormLabel>

                <CFormInput
                  id="horizontal"
                  type="number"
                  step="any"
                  min="0"
                  name="horizontal"
                  value={horizontal}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter Tank Horizontal Length"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="tankLength" className="mb-0 fw-semibold">
                    Tank Length (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="tankLength"
                    type="number"
                    step="any"
                    min="0"
                    name="tankLength"
                    value={tankLength}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Length"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="calCapacity" className="mb-0 me-1 fw-semibold" style={{ width: '350px' }}>
                  Calculate Capacity (L) :
                </CFormLabel>

                <CFormInput
                  id="calCapacity"
                  name="calCapacity"
                  value={calCapacity}
                  onChange={handleChange}
                  placeholder="Calculate Tank"
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="compOil" className="mb-0 fw-semibold">
                    Comp Oil (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="compOil"
                    type="number"
                    step="any"
                    name="compOil"
                    value={compOil}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Compensate Oil"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="compWater" className="mb-0 me-1 fw-semibold" style={{ width: '300px' }}>
                  Comp Water (mm) :
                </CFormLabel>

                <CFormInput
                  id="compWater"
                  type="number"
                  step="any"
                  name="compWater"
                  value={compWater}
                  onChange={handleChange}
                  placeholder="Enter Compensate Water"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="highAlarm" className="mb-0 fw-semibold">
                    High Alarm (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="highAlarm"
                    type="number"
                    step="any"
                    min="0"
                    max={calCapacity}
                    name="highAlarm"
                    value={highAlarm}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Oil High Alarm"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="highAlert" className="mb-0 me-1 fw-semibold" style={{ width: '180px' }}>
                  High Alert (L) :
                </CFormLabel>

                <CFormInput
                  id="highAlert"
                  type="number"
                  step="any"
                  min="0"
                  max={calCapacity}
                  name="highAlert"
                  value={highAlert}
                  onChange={handleChange}
                  placeholder="Enter Oil High Alert"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="lowAlarm" className="mb-0 fw-semibold">
                    Low Alarm (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="lowAlarm"
                    type="number"
                    step="any"
                    min="0"
                    max={calCapacity}
                    name="lowAlarm"
                    value={lowAlarm}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Oil Low Alarm"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="waterAlarm" className="mb-0 me-1 fw-semibold" style={{ width: '340px' }}>
                  Water High Alarm (L) :
                </CFormLabel>

                <CFormInput
                  id="waterAlarm"
                  type="number"
                  step="any"
                  max={calCapacity}
                  min="0"
                  name="waterAlarm"
                  value={waterAlarm}
                  onChange={handleChange}
                  placeholder="Enter Water High Alarm"
                  required
                  // style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                />
              </CCol>
            </CRow>

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
        </CModalBody>
      </CModal>
    )
  }

  const updateTank = () => {
    return (
      <CModal
        // style={{ width: '500px' }}
        size="lg"
        visible={updateVisible}
        onClose={() => {
          setUpdateVisible(false)
          clearForm()
        }}
      >
        <CModalHeader>
          <CModalTitle>Edit Tank {code}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CForm onSubmit={handleUpdateSubmit}>
            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="code" className="mb-0" style={{ fontWeight: 500 }}>
                    Tank Code :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="code"
                    name="code"
                    value={code}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Code e.g. 001"
                    required
                    disabled
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="name" className="mb-0 me-1" style={{ width: '150px', fontWeight: 500 }}>
                  Tank Name :
                </CFormLabel>

                <CFormInput
                  id="name"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  maxLength={20}
                  placeholder="Enter Tank Name"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="probeId" className="mb-0" style={{ fontWeight: 500 }}>
                    Probe Id :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormSelect id="probeId" name="probeId" value={probeId} onChange={handleChange} required>
                    <option value="" disabled>
                      Select Probe
                    </option>
                    {probes.map((item, index) => (
                      <option value={item.probe_id} key={index}>
                        {item.probe_id}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="fuelCode" className="mb-0 me-1" style={{ width: '150px', fontWeight: 500 }}>
                  Fuel Name :
                </CFormLabel>

                <CFormSelect id="fuelCode" name="fuelCode" value={fuelCode} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel
                  </option>
                  {fuels.map((item, index) => (
                    <option value={item.fuel_code} key={index}>
                      {item.fuel_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="capacity" className="mb-0 fw-semibold">
                    Tank Capacity (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="capacity"
                    type="number"
                    step="any"
                    min="0"
                    name="capacity"
                    value={capacity}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Capacity"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="tankType" className="mb-0 me-1 fw-semibold" style={{ width: '150px' }}>
                  Tank Type :
                </CFormLabel>

                <CFormSelect id="tankType" name="tankType" value={tankType} onChange={handleChange} required>
                  <option value="">Select Tank Type</option>
                  <option value={1}>Horizontal</option>
                  <option value={2}>Vertical</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="vertical" className="mb-0 fw-semibold">
                    Vertical (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="vertical"
                    type="number"
                    step="any"
                    min="0"
                    name="vertical"
                    value={vertical}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Vertical Length"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="horizontal" className="mb-0 me-1 fw-semibold" style={{ width: '230px' }}>
                  Horizontal (mm) :
                </CFormLabel>

                <CFormInput
                  id="horizontal"
                  type="number"
                  step="any"
                  min="0"
                  name="horizontal"
                  value={horizontal}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="Enter Tank Horizontal Length"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="tankLength" className="mb-0 fw-semibold">
                    Tank Length (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="tankLength"
                    type="number"
                    step="any"
                    min="0"
                    name="tankLength"
                    value={tankLength}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Tank Length"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="calCapacity" className="mb-0 me-1 fw-semibold" style={{ width: '350px' }}>
                  Calculate Capacity (L) :
                </CFormLabel>

                <CFormInput
                  id="calCapacity"
                  name="calCapacity"
                  value={calCapacity}
                  onChange={handleChange}
                  placeholder="Calculate Tank"
                  disabled
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="compOil" className="mb-0 fw-semibold">
                    Comp Oil (mm) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="compOil"
                    type="number"
                    step="any"
                    name="compOil"
                    value={compOil}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Compensate Oil"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="compWater" className="mb-0 me-1 fw-semibold" style={{ width: '300px' }}>
                  Comp Water (mm) :
                </CFormLabel>

                <CFormInput
                  id="compWater"
                  type="number"
                  step="any"
                  name="compWater"
                  value={compWater}
                  onChange={handleChange}
                  placeholder="Enter Compensate Water"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-2">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="highAlarm" className="mb-0 fw-semibold">
                    High Alarm (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="highAlarm"
                    type="number"
                    step="any"
                    min="0"
                    max={calCapacity}
                    name="highAlarm"
                    value={highAlarm}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Oil High Alarm"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="highAlert" className="mb-0 me-1 fw-semibold" style={{ width: '180px' }}>
                  High Alert (L) :
                </CFormLabel>

                <CFormInput
                  id="highAlert"
                  type="number"
                  step="any"
                  min="0"
                  max={calCapacity}
                  name="highAlert"
                  value={highAlert}
                  onChange={handleChange}
                  placeholder="Enter Oil High Alert"
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-4">
              <CCol md={6} className="d-flex align-items-center">
                <div className="w-50 text-end pe-2">
                  <CFormLabel htmlFor="lowAlarm" className="mb-0 fw-semibold">
                    Low Alarm (L) :
                  </CFormLabel>
                </div>
                <div className="w-50">
                  <CFormInput
                    id="lowAlarm"
                    type="number"
                    step="any"
                    min="0"
                    max={calCapacity}
                    name="lowAlarm"
                    value={lowAlarm}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter Oil Low Alarm"
                    required
                  />
                </div>
              </CCol>

              <CCol md={6} className="d-flex align-items-center">
                <CFormLabel htmlFor="waterAlarm" className="mb-0 me-1 fw-semibold" style={{ width: '330px' }}>
                  Water High Alarm (L) :
                </CFormLabel>

                <CFormInput
                  id="waterAlarm"
                  type="number"
                  step="any"
                  max={calCapacity}
                  min="0"
                  name="waterAlarm"
                  value={waterAlarm}
                  onChange={handleChange}
                  placeholder="Enter Water High Alarm"
                  required
                  // style={{ appearance: 'textfield', MozAppearance: 'textfield' }}
                />
              </CCol>
            </CRow>

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
        </CModalBody>
      </CModal>
    )
  }

  const deleteTank = () => {
    return (
      <CModal visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Tank</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>
            Are you sure to delete code "<b>{deleteCode}</b>" ?
          </p>

          <CModalFooter>
            <CButton color="secondary" onClick={() => setDeleteVisible(false) & setDeleteCode('')}>
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

  return (
    <>
      {addVisible === true && addTank()}
      {deleteVisible === true && deleteTank()}
      {updateVisible === true && updateTank()}

      <CCard>
        <CCardHeader>
          <CRow className="align-items-center">
            <CCol xs={8}>
              <h5 className="mb-0 fw-bold">Tank Setting</h5>
            </CCol>

            <CCol xs={4} className="d-flex justify-content-end">
              <CButton
                color="primary"
                className="me-2
                     d-flex align-items-center"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  console.log('ON Click')
                  setAddVisible(true)
                }}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add New Tank
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody className=" mb-3">
          <CSmartTable
            items={tanks}
            columns={[
              { key: 'code', label: 'Code', _style: { width: '6%' } },
              { key: 'tank_name', label: 'Name', _style: { width: '8%' } },
              { key: 'fuel_name', label: 'Fuel Name', _style: { width: '10%' } },
              { key: 'probe_id', label: 'Probe Id', _style: { width: '8%' } },
              { key: 'capacity_l', label: 'Capacity(L)', _style: { width: '10%' } },
              { key: 'cal_capacity_l', label: 'Cal Capacity(L)', _style: { width: '11%' } },
              { key: 'comp_oil_mm', label: 'Comp Oil(mm)', _style: { width: '11%' } },
              { key: 'comp_water_mm', label: 'Comp Water(mm)', _style: { width: '10%' } },
              { key: 'actions', label: '', _style: { width: '8%' }, filter: false, sorter: false },
            ]}
            columnFilter
            columnSorter
            pagination
            itemsPerPage={5}
            scopedColumns={{
              actions: (item) => (
                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                  <CButton
                    className="me-1"
                    onClick={() => {
                      setCode(item.code)
                      setName(item.tank_name)
                      setProbeId(item.probe_id)
                      setFuelCode(item.fuel_code)
                      setCapacity(item.capacity_l)
                      setTankType(item.tank_type)
                      setVertical(item.vertical_mm)
                      setHorizontal(item.horizontal_mm)
                      setTankLength(item.length_mm)
                      setCalCapacity(item.cal_capacity_l)
                      setCompOil(item.comp_oil_mm)
                      setCompWater(item.comp_water_mm)
                      setHighAlarm(item.high_alarm_l)
                      setHighAlert(item.high_alert_l)
                      setLowAlarm(item.low_alarm_l)
                      setWaterAlarm(item.water_high_alarm_l)

                      setUpdateVisible(true)
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton onClick={() => setDeleteVisible(true) & setDeleteCode(item.code)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </td>
              ),
            }}
            tableProps={{
              responsive: true,
              striped: true,
              hover: true,
            }}
            tableBodyProps={{
              className: 'align-middle',
            }}
          />
        </CCardBody>
      </CCard>
    </>
  )
}

export default TankSetting
