import React, { useState, useEffect } from 'react'
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
  const [loadData, setLoadData] = useState([])
  const [autoIsOn, setAutoIsOn] = useState(1)
  const [startLoad, setStartLoad] = useState(0)

  const [tankCode, setTankCode] = useState('001')
  const handleExportExcel = () => {
    console.log('export excel')
  }

  const tanks = [
    {
      code: '001',
    },
  ]

  // กัน user refresh หน้าจอ
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = '' // จำเป็นต้องมีในบาง browser เช่น Chrome
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    // cleanup เมื่อออกจากหน้า
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [startLoad])

  return (
    <>
      {/* <CRow className="align-items-center mb-3">
        
        <CCol md={6} className="d-flex align-items-center">
          <CFormLabel htmlFor="tank" className="mb-0 me-2 ms-3">
            <b>Tank :</b>
          </CFormLabel>
          <CFormSelect
            id="tankCode"
            name="tankCode"
            value={tankCode}
            // onChange={handleChange}
            style={{ width: '120px' }}
          >
            {tanks.map((item, index) => (
              <option value={item.code} key={index}>
                {item.code}
              </option>
            ))}
          </CFormSelect>
        </CCol>
        <CCol md={6} className="d-flex align-items-center text-end">
          <CButton
            color="success"
            size="md"
            className="fw-semibold d-flex justify-content-between align-items-center ps-1 pe-3 pt-2 pb-2 ms-3"
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
              Loading
            </p>
          </CButton>
        </CCol>
      </CRow> */}
      {/* <CForm>
        <CFormInput type="text" placeholder="กรอกข้อมูล..." />
      </CForm> */}
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex justify-content-between align-items-center">
          <CFormLabel htmlFor="tank" className="mb-0 me-2 ms-3">
            <b>Tank :</b>
          </CFormLabel>
          <CFormSelect
            id="tankCode"
            name="tankCode"
            value={tankCode}
            // onChange={handleChange}
            style={{ width: '120px' }}
          >
            {tanks.map((item, index) => (
              <option value={item.code} key={index}>
                {item.code}
              </option>
            ))}
          </CFormSelect>
        </div>
        <div>
          <CButton
            color="success"
            onClick={() => {
              setStartLoad(1)
            }}
            size="md"
            className="fw-semibold d-flex justify-content-between align-items-center ps-1 pe-3 pt-2 pb-2 ms-3 me-3"
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
          </CButton>
        </div>
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
          <div style={{ textAlign: 'end' }} className="me-3 mt-3 mb-2 d-flex align-items-center">
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
            >
              <CIcon icon={cilPlus} size="xl" className="me-2 ms-2" style={{ color: '#fff' }} />
              <p className="mb-0 fw-bold fs-6" style={{ color: '#fff' }}>
                Add Data
              </p>
            </CButton>
          </div>
        </div>

        <CCardBody>
          <CCard>
            <CSmartTable
              items={loadData}
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
          </CCard>
        </CCardBody>
      </CCard>
    </>
  )
}

export default FuelLoad
