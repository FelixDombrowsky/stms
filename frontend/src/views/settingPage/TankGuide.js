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
  const [allTankCal, setAllTankCal] = useState([])
  const [tankCal, setTankCal] = useState([])
  const [tankCalFilter, setTankCalFilter] = useState([])

  const [tankCode, setTankCode] = useState('')
  const [heightStep, setHeightStep] = useState(10)
  const [model, setModel] = useState(1)

  const [autoIsOn, setAutoIsOn] = useState(false)
  // const [autoMode, setAutoMode] = useState(false)

  const [manualTable, setManualTable] = useState([])
  const [tankAdjustTable, setTankAdjustTable] = useState([])
  // Model State
  const [trainResult, setTrainResult] = useState(null)
  const [showTrainModal, setShowTrainModal] = useState(false)

  // mock data

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'tankCode') setTankCode(value)
    if (name === 'height_step') setHeightStep(parseInt(value))
    if (name === 'model') setModel(Number(value))
    // console.log('code :', tankCode)
    // console.log('h_step:', heightStep)
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tankRes, calRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/tank/setting`),
          axios.get(`${import.meta.env.VITE_API_URL}/api/tank/guide/cal`),
        ])

        const tankData = tankRes.data
        const calData = calRes.data.data

        setTanks(tankData)
        setAllTankCal(calData)

        if (calData && calData.length > 0) {
          setTankCode(calData[0].tank_code)
        } else if (tankData && tankData.length > 0) {
          setTankCode(tankData[0].code)
        }
      } catch (err) {
        console.error('Fetch Error:', err)
      }
    }

    fetchAll()
  }, [])

  useEffect(() => {
    // ถ้าข้อมูลยังไม่มา ไม่ต้องทำอะไร
    if (!tankCode || tanks.length === 0 || allTankCal.length === 0) return

    // หา tankCal สำหรับ tankCode
    const cal = allTankCal.find((item) => item.tank_code === tankCode)
    if (cal) {
      setTankCal(cal.data)
    }

    // หา auto_status จาก tanks
    const tankInfo = tanks.find((item) => item.code === tankCode)
    if (tankInfo) {
      setAutoIsOn(tankInfo.auto_status === 1)
    }
  }, [tankCode, tanks, allTankCal])

  useEffect(() => {
    if (tankCal.length === 0) {
      setTankCalFilter([])
      return
    }

    const filter = []
    for (let i = 0; i < tankCal.length; i += heightStep) {
      filter.push(tankCal[i])
    }
    setTankCalFilter(filter)
  }, [tankCal, heightStep])

  // const fetchTankData = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tank/setting`)
  //     console.log('Tank data : ', data)

  //     // setTanks(data)
  //     // if (!tankCode) {
  //     //   setTankCode(data[0].code)
  //     return setTankData(data)
  //     // }
  //   } catch (err) {
  //     console.error(`Fetch Tank Data Error : ${err}`)
  //   }
  // }

  // const fetchTankGuideCal = async () => {
  //   try {
  //     const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/tank/guide/cal`)
  //     // console.log('payload :,', data.data)
  //     // console.log('Tank Cal : ', data)
  //     // setAllTankCal(data.data)
  //     // setTankCode(data.data[0].tank_code)
  //     return setCalData(data)
  //   } catch (err) {
  //     console.error(`Fetch Tank Data Error : ${err}`)
  //   }
  // }

  // useEffect(() => {
  //   Promise.all([fetchTankData(), fetchTankGuideCal()]).then(([tankData, calData]) => {
  //     setTanks(tankData)
  //     setAllTankCal(calData)
  //     setTankCode(calData[0].tank_code)
  //   })
  // }, [])

  // useEffect(() => {
  //   if (!tankCode || allTankCal.length === 0 || tanks.length === 0) return
  //   const cal = allTankCal.find((item) => item.tank_code === tankCode)
  //   if (cal) setTankCal(cal.data)

  //   const tank = tanks.find((item) => item.code === tankCode)
  //   if (tank) setAutoIsOn(tank.auto_status === 1)
  // }, [tankCode, allTankCal, tanks])

  // useEffect(() => {
  //   fetchTankData()
  //   fetchTankGuideCal()
  // }, [])

  // useEffect(() => {
  //   allTankCal.forEach((item) => {
  //     if (item.tank_code === tankCode) {
  //       setTankCal(item.data)
  //     }
  //   })
  //   fetchTankData()
  //   tanks.forEach((item) => {
  //     if (item.code === tankCode) {
  //       if (item.auto_status === 0) {
  //         // setAutoMode(false)
  //         setAutoIsOn(false)
  //         console.log(`tank ${item.code} : auto ${item.auto_status}`)
  //       } else {
  //         // setAutoMode(true)
  //         setAutoIsOn(true)
  //         console.log(`tank ${item.code} : auto ${item.auto_status}`)
  //       }
  //     }
  //   })
  // }, [tankCode])

  // useEffect(() => {
  //   if (tanks.length > 0 && !tankCode) {
  //     setTankCode(tanks[0].code)
  //   }
  // }, [tanks])

  // useEffect(() => {
  //   if (tankCal.length === 0) return
  //   const filter_data = []
  //   for (let i = 0; i < tankCal.length; i += heightStep) {
  //     filter_data.push(tankCal[i])
  //   }
  //   setTankCalFilter(filter_data)
  //   // console.log('Tank Filter:', tankCalFilter)
  // }, [heightStep, tankCal])

  const handleExportExcel = async () => {
    if (!tankCalFilter || tankCalFilter.length === 0) {
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
    tankCalFilter.forEach((row) => {
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

  const handleAuto = () => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn-confirm-custom',
        cancelButton: 'btn-cancel-custom',
      },
      buttonsStyling: false,
    })

    //  ผู้ใช้จะ "ปิด" Auto
    if (autoIsOn === true) {
      swalWithBootstrapButtons
        .fire({
          title: 'Turn OFF Auto Calibration?',
          text: 'Are you sure you want to disable Auto Calibration?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, turn OFF',
          cancelButtonText: 'No, keep it ON',
          reverseButtons: true,
          // color: 'warning',
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const payload = { auto_status: 0 }
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/tank/guide/auto/${tankCode}`, payload)
            setAutoIsOn(false)
            // fetchTankData()
            // setTankCode(data[0].data.code)
            swalWithBootstrapButtons.fire({
              title: 'Auto Calibration is now OFF',
              // text: 'Your file has been deleted.',
              icon: 'success',
            })
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
              title: 'Cancelled',
              text: 'Auto Calibration is still ON.',
              icon: 'info',
            })
          }
        })
    } else {
      //  ผู้ใช้จะ "เปิด" Auto
      swalWithBootstrapButtons
        .fire({
          title: 'Turn ON Auto Calibration?',
          text: 'System will start automatic calibration.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, turn ON',
          cancelButtonText: 'No, keep it OFF',
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            const payload = { auto_status: 1 }
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/tank/guide/auto/${tankCode}`, payload)
            setAutoIsOn(true)
            // fetchTankData()
            // setTankCode(data[0].data.code)
            swalWithBootstrapButtons.fire({
              title: 'Auto Calibration is now ON',
              // text: 'Your file has been deleted.',
              icon: 'success',
            })
          } else if (
            /* Read more about handling dismissals below */
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire({
              title: 'Cancelled',
              text: 'Auto Calibration is still OFF.',
              icon: 'info',
            })
          }
        })
    }
  }

  const handleUpdateAuto = async () => {}

  // useEffect(() => {
  //   console.log('useEffect AutoisOn:', autoIsOn)
  // }, [autoIsOn])

  const handleTrainModel = async () => {
    if (manualTable.length === 0) {
      Swal.fire('Error', 'Please import calibration data first!', 'error')
      return
    }

    try {
      const payload = {
        real_data: manualTable,
        tank_code: tankCode,
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
                checked={autoIsOn}
                // onClick={() => {
                //   // setAutoIsOn(!autoIsOn)
                //   handleAuto()
                //   console.log('Auto Click')
                // }}
                onChange={() => {
                  handleAuto()
                  console.log('Auto Click')
                }}
                style={{
                  backgroundColor: autoIsOn ? 'limegreen' : '#a9a9a9',
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
                    items={tankCalFilter}
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
                      disabled={autoIsOn}
                      color={autoIsOn ? 'secondary' : 'success'}
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
