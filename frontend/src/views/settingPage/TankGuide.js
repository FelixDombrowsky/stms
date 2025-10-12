import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Swal from 'sweetalert2'
import Plot from 'react-plotly.js'

import {
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormSelect,
  CFormLabel,
  CSmartTable,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormSwitch,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPen, cilPencil, cilTrash, cilArrowCircleBottom, cilArrowCircleTop } from '@coreui/icons'

const TankGuide = () => {
  // state
  const [tanks, setTanks] = useState([])

  const [tankCode, setTankCode] = useState('')
  const [heightStep, setHeightStep] = useState(10)
  const [model, setModel] = useState(1)
  const [horizontal, setHorizontal] = useState('')
  const [vertical, setVertical] = useState('')
  const [tankType, setTankType] = useState('')
  const [tankLength, setTankLength] = useState('')

  const [isOn, setIsOn] = useState(false)

  // [{height,volume},{height,volume},...]
  const [defaultTable, setDefaultTable] = useState([])
  const [manualTable, setManualTable] = useState([])
  const [tankAdjustTable, setTankAdjustTable] = useState([])
  // Model State
  const [trainResult, setTrainResult] = useState(null)
  const [showTrainModal, setShowTrainModal] = useState(false)

  // mock data

  const checkTankCode = () => {
    if (tanks.length === 0) {
      return alert('No Tanks')
    }
    for (let i = 0; i < tanks.length; i++) {
      if (tanks[i].code === tankCode) {
        console.log('Tank code :', tankCode)
        console.log(`Tank ${tankCode}:`, tanks[i])
        let a = tanks[i].horizontal_mm
        let b = tanks[i].vertical_mm
        let L = tanks[i].length_mm
        let type = tanks[i].tank_type
        setHorizontal(a)
        setVertical(b)
        setTankLength(L)
        setTankType(type)

        defaultCal(a, b, L, type)
      }
    }
  }

  const defaultCal = (a, b, L, type) => {
    const rx = a / 2 // semi-axis x
    const ry = b / 2 // semi-axis y
    const points = []

    // ถังแนวนอน (ของเหลวสูง 0..b)
    if (type === 1) {
      for (let h = 0; h <= b; h += Number(heightStep)) {
        // map h -> u ในช่วง [-1, 1]
        const uRaw = h / ry - 1
        const u = Math.max(-1, Math.min(1, uRaw))
        const sqrtTerm = Math.sqrt(Math.max(0, 1 - u * u)) // ป้องกันค่าลบใน sqrt

        // พื้นที่หน้าตัดวงรีส่วนที่จมอยู่ A(h)
        const A = rx * ry * (u * sqrtTerm + Math.asin(u) + Math.PI / 2)

        // ปริมาตร (ลิตร)
        const volL = (A * L) / 1_000_000

        // push ข้อมูลลง array
        points.push({ height: h, volume: volL.toFixed(2) })

        // console.log(`h = ${h} mm, Volume = ${volL.toFixed(2)} L`)
      }
    } else {
      // ถังแนวตั้ง (ถ้าถังเป็นทรงกระบอกฐานวงรี: พื้นที่ฐานคงที่ = π * rx * ry)
      // ที่ระดับ h: V = (พื้นที่ฐาน) * h
      for (let h = 0; h <= L; h += Number(heightStep)) {
        const baseArea = Math.PI * rx * ry // mm²
        const volL = (baseArea * h) / 1_000_000 // mm³ -> L
        // push ข้อมูลลง array
        points.push({ height: h, volume: volL.toFixed(2) })

        // console.log(`h = ${h} mm, Volume = ${volL.toFixed(2)} L`)
      }
    }

    setDefaultTable(points)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tankCode') setTankCode(value)
    if (name === 'height_step') setHeightStep(parseInt(value))
    if (name === 'model') setModel(Number(value))
    console.log('code :', tankCode)
    console.log('h_step:', heightStep)
  }

  const fetchTankData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tank/setting`)
      console.log('Tank data : ', data)
      setTanks(data)
    } catch (err) {
      console.error(`Fetch Tank Data Error : ${err}`)
    }
  }

  useEffect(() => {
    fetchTankData()
  }, [])

  useEffect(() => {
    if (tanks.length > 0 && !tankCode) {
      setTankCode(tanks[0].code)
    }
  }, [tanks])

  useEffect(() => {
    if (tanks.length > 0 && tankCode) {
      checkTankCode()
    }
    let points = []
    for (let i = 0; i < manualTable.length; i += heightStep) {
      const h = manualTable[i]?.height
      const volL = manualTable[i]?.volume
      if (h != null && volL != null) {
        points.push({
          height: Number(h),
          volume: Number(volL).toFixed(2),
        })
      }
    }
    setTankAdjustTable(points)
  }, [tankCode, tanks, heightStep])

  const handleExportExcel = async () => {
    if (!defaultTable || defaultTable.length === 0) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: `No Data in Table!`,
        showConfirmButton: false,
        timer: 1500,
      })
      return
    }

    // 🔹 สร้าง workbook และ worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Tank Guide')

    // 🔹 แถวที่ 1: ชื่อ Table
    worksheet.addRow([`Table: ${tankCode || 'Unknown Tank'} Default Tank Guide`])
    worksheet.mergeCells('A1:B1') // รวมช่อง A1-B1
    const titleCell = worksheet.getCell('A1')
    titleCell.font = { bold: true, size: 14 }
    titleCell.alignment = { horizontal: 'center' }

    //เว้นแถว
    worksheet.addRow([])

    //แถว Header
    const headerRow = worksheet.addRow(['Height (mm)', 'Volume (L)'])
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.alignment = { horizontal: 'center', vertical: 'middle' }

    headerRow.height = 25
    //ใส่สีพื้นหลัง header
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }, // สีฟ้าเข้ม
      }
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFFFFF' } },
        bottom: { style: 'thin', color: { argb: 'FFFFFF' } },
      }
    })

    //ใส่ข้อมูล
    defaultTable.forEach((row) => {
      const dataRow = worksheet.addRow([row.height, row.volume])
      dataRow.eachCell((cell) => {
        cell.alignment = { horizontal: 'center', vertical: 'middle' }
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        }
      })
    })

    //ปรับขนาดคอลัมน์อัตโนมัติ
    worksheet.columns.forEach((col) => {
      let maxLength = 0
      col.eachCell({ includeEmpty: true }, (cell) => {
        const cellLength = cell.value ? cell.value.toString().length : 10
        if (cellLength > maxLength) maxLength = cellLength
      })
      col.width = maxLength + 3
    })

    //สร้างไฟล์และดาวน์โหลด
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(
      new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      `tank_${tankCode || 'tank_data'}_guide_default.xlsx`,
    )
  }

  const handleImportExcel = async (e) => {
    console.log('import click')
    const file = e.target.files[0]
    if (!file) return

    try {
      const workbook = new ExcelJS.Workbook()
      const arrayBuffer = await file.arrayBuffer()
      await workbook.xlsx.load(arrayBuffer)

      const worksheet = workbook.worksheets[0] // sheet แรก
      const data = []

      worksheet.eachRow((row, rowNumber) => {
        // ข้ามแถว title และ header (เช่น "Table:" และ "Height, Volume")
        if (rowNumber <= 2) return

        const height = row.getCell(1).value
        const volume = row.getCell(2).value

        if (!isNaN(height) && !isNaN(volume)) {
          data.push({
            height: Number(height),
            volume: Number(volume).toFixed(2),
          })
        }
      })

      // ✅ อัปเดตลง state manualTable
      setManualTable(data)
      setTankAdjustTable(data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Imported ${data.length} rows successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })
    } catch (error) {
      console.error('Import Excel Error:', error)
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Failed to import file!',
        showConfirmButton: false,
        timer: 1500,
      })
    }
  }

  const fileInputRef = useRef(null)

  const handleClickImport = () => {
    fileInputRef.current.click()
  }

  const handleTrainModel = async () => {
    if (manualTable.length === 0) {
      Swal.fire('Error', 'Please import calibration data first!', 'error')
      return
    }

    try {
      const payload = {
        real_data: manualTable,
        tank_code: tankCode,
        horizontal: Number(parseFloat(horizontal).toFixed(2)),
        vertical: Number(parseFloat(vertical).toFixed(2)),
        tank_length: Number(parseFloat(tankLength).toFixed(2)),
        tank_type: Number(tankType),
      }
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/tank/train`, payload)

      // เก็บผลลัพธ์
      setTrainResult(data)
      setShowTrainModal(true)
    } catch (err) {
      Swal.fire('Error', 'Training failed!', 'error')
      console.error(err)
    }
  }

  const trainResultModal = () => {
    return (
      <CModal visible={showTrainModal} onClose={() => setShowTrainModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Tank Calibration Result</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {trainResult && (
            <>
              {/* 📊 กราฟ Plotly */}
              <Plot
                data={[
                  {
                    x: trainResult.h,
                    y: trainResult.vOld,
                    type: 'scatter',
                    name: 'Old Model',
                    line: { color: 'blue' },
                  },
                  {
                    x: trainResult.h,
                    y: trainResult.vNew,
                    type: 'scatter',
                    name: 'New Model',
                    line: { color: 'green' },
                  },
                  {
                    x: trainResult.h,
                    y: trainResult.vTrue,
                    mode: 'markers',
                    name: 'Actual Data',
                    marker: { color: 'red', size: 6 },
                  },
                ]}
                layout={{
                  title: `Calibration Comparison (R² = ${trainResult.R2.toFixed(4)})`,
                  xaxis: { title: 'Height (mm)' },
                  yaxis: { title: 'Volume (L)' },
                  height: 400,
                }}
              />

              {/* 🔢 แสดงค่าพารามิเตอร์ */}
              <div className="text-center mt-0">
                <p>
                  <b>Old:</b> a={trainResult.a_old.toFixed(2)}, b={trainResult.b_old.toFixed(2)}, L=
                  {trainResult.L_old.toFixed(2)}
                </p>
                <p>
                  <b>New:</b> a={trainResult.a_new.toFixed(2)}, b={trainResult.b_new.toFixed(2)}, L=
                  {trainResult.L_new.toFixed(2)}
                </p>
                <h5 style={{ color: trainResult.R2 >= 0.95 ? 'green' : trainResult.R2 >= 0.9 ? '#e0a800' : 'red' }}>
                  R² = {trainResult.R2.toFixed(4)} →
                  {trainResult.R2 >= 0.95
                    ? ' Excellent Accuracy'
                    : trainResult.R2 >= 0.9
                      ? ' Moderate Accuracy'
                      : ' Poor Fit'}
                </h5>
              </div>
            </>
          )}
        </CModalBody>

        <CModalFooter className="d-flex justify-content-center">
          <CButton
            color="primary"
            disabled={trainResult?.R2 < 0.9}
            onClick={() => {
              axios.post(`${import.meta.env.VITE_API_URL}/api/tank/update`, {
                tankCode,
                a: trainResult.a_new,
                b: trainResult.b_new,
                L: trainResult.L_new,
              })
              Swal.fire('Applied!', 'New parameters applied successfully!', 'success')
              setShowTrainModal(false)
            }}
          >
            Apply to Tank Setting
          </CButton>
          <CButton color="secondary" variant="outline" onClick={() => setShowTrainModal(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  return (
    <>
      {showTrainModal === true && trainResultModal()}

      <CRow className="align-items-center justify-content-between mb-3">
        {/* Tank Select */}
        <CCol md={6} className="d-flex align-items-center">
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
                {item.code}
              </option>
            ))}
          </CFormSelect>
        </CCol>

        {/* Height Step Select */}
        <CCol md={6} className="d-flex justify-content-end align-items-center">
          <CFormLabel htmlFor="height_step" className="mb-0 me-2 text-nowrap">
            <b>Height Step :</b>
          </CFormLabel>
          <CFormSelect
            id="height_step"
            name="height_step"
            value={heightStep}
            onChange={handleChange}
            style={{ width: '120px' }}
            className="me-3"
          >
            {[...Array(100)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </CFormSelect>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader
          style={{
            background: '#4B79A1',
            color: 'white',
            fontWeight: '600',
            letterSpacing: '0.5px',
            borderBottom: '2px solid #2c3e50',
            boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <CRow className="align-items-center justify-content-between mb-0">
            {/* Tank Select */}
            <CCol md={6} className="d-flex align-items-center">
              <h6 className="mb-0 fw-bold">Tank Guide Chart</h6>
            </CCol>

            {/* Height Step Select */}
            <CCol md={6} className="d-flex justify-content-end align-items-center">
              <CFormLabel htmlFor="autoMode" className="mb-0 me-2 text-nowrap">
                Auto Calibration :
              </CFormLabel>
              <CFormSwitch
                id="autoMode"
                checked={isOn}
                onChange={() => {
                  setIsOn(!isOn)
                  console.log('is on:', isOn)
                }}
                style={{
                  backgroundColor: isOn ? 'limegreen' : '#a9a9a9',
                  cursor: 'pointer',
                  borderColor: '#fff',
                  borderWidth: '3px',
                  width: '50px',
                  height: '25px',
                }}
              />
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <CRow>
            {/* Smart Table 1 */}
            <CCol md={6}>
              <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Default Calculation</h6>
                  <CButton color="primary" size="sm" variant="outline" onClick={handleExportExcel}>
                    <CIcon icon={cilArrowCircleTop} className="me-1" />
                    Export
                  </CButton>
                </CCardHeader>
                <CCardBody>
                  <CSmartTable
                    items={defaultTable}
                    columns={[
                      // { key: 'step', label: 'Step', _style: { width: '20px' } },
                      { key: 'height', label: 'Height (mm)', _style: { width: '50%' } },
                      { key: 'volume', label: 'Volume (L)', _style: { width: '50%' }, sorter: false },
                      // { key: 'actions', label: '', _style: { width: '20px' }, filter: false, sorter: false },
                    ]}
                    columnSorter
                    columnFilter
                    tableProps={{ striped: true, hover: true, responsive: true }}
                    tableBodyProps={{ className: 'align-middle' }}
                    itemsPerPage={7}
                    pagination
                  />
                </CCardBody>
              </CCard>
            </CCol>

            {/* Smart Table 2 */}
            <CCol md={6}>
              <CCard>
                <CCardHeader className="d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">Tank Adjustment</h6>

                  <div className="d-flex gap-2">
                    <CButton
                      disabled={isOn}
                      color={isOn ? 'secondary' : 'success'}
                      size="sm"
                      variant="outline"
                      onClick={handleClickImport}
                    >
                      <CIcon icon={cilArrowCircleBottom} className="me-1" />
                      Import Excel
                    </CButton>

                    <input
                      type="file"
                      accept=".xlsx"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImportExcel}
                    />

                    <CButton
                      color="primary"
                      size="sm"
                      variant="outline"
                      onClick={() => console.log('Export CSV clicked')}
                    >
                      <CIcon icon={cilArrowCircleTop} className="me-1" />
                      Export
                    </CButton>
                  </div>
                </CCardHeader>
                <CCardBody>
                  <CSmartTable
                    items={tankAdjustTable}
                    columns={[
                      { key: 'height', label: 'Height (mm)', _style: { width: '45%' } },
                      { key: 'volume', label: 'Volume (L)', _style: { width: '45%' }, sorter: false },
                      // { key: 'actions', label: 'Edit', _style: { width: '20px' }, filter: false, sorter: false },
                    ]}
                    columnSorter
                    columnFilter
                    tableProps={{ striped: true, hover: true, responsive: true }}
                    tableBodyProps={{ className: 'align-middle' }}
                    itemsPerPage={7}
                    pagination
                    scopedColumns={{
                      actions: (item) => (
                        <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                          <CButton
                            size="sm"
                            color="transparent"
                            className="m-0 p-0"
                            style={{
                              height: '20px',
                              width: '24px',
                              minWidth: 'unset',
                              lineHeight: '1',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onClick={() => {
                              // setCode(item.code)
                              // setUpdateVisible(true)
                              console.log('click')
                            }}
                          >
                            <CIcon icon={cilPencil} size="md" />
                          </CButton>
                        </td>
                      ),
                    }}
                  />
                  {manualTable.length !== 0 && (
                    <CButton
                      color="primary"
                      size="sm"
                      style={{
                        position: 'absolute',
                        bottom: '33px',
                        right: '15px',
                        borderRadius: '5px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}
                      onClick={handleTrainModel}
                    >
                      Train Model
                    </CButton>
                  )}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCardBody>

        <CCardFooter className="text-end">
          <small className="text-muted">Updated automatically from tank configuration</small>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default TankGuide
