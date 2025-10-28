import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import axios from 'axios'
import { useTranslation } from '../../../node_modules/react-i18next'
import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
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
  CBadge,
  CCollapse,
} from '@coreui/react-pro'

import CIcon from '@coreui/icons-react'
import { cilPlus, cilPen, cilPencil, cilTrash } from '@coreui/icons'
import AddProbeModal from './AddProbeModal'

const ProbeSetting = () => {
  const [probes, setProbes] = useState([])
  const [visible, setVisible] = useState(false) //for modal
  const [form, setForm] = useState({
    probe_id: '',
    probe_type_id: '',
    oil_h_address: '',
    oil_h_scale: 1,
    water_h_address: '',
    water_h_scale: 1,
    temp_address: '',
    temp_scale: 1,
    address_length: '',
    format: '',
    function_code: '',
  })
  const [probeTypes, setProbeTypes] = useState([])
  const [editMode, setEditMode] = useState(false)

  // บันทึกเมื่อค่าใน form เปลียน
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    console.log(form)
    // console.log(probes)
  }

  useEffect(() => {
    if (form.address_length === '1' && form.format !== 'AB') {
      setForm((prev) => ({ ...prev, format: 'AB' }))
      console.log('useEffect 1')
    }
  }, [form.address_length])

  useEffect(() => {
    if (form.oil_h_address === '-1') {
      setForm((prev) => ({ ...prev, oil_h_scale: '1' }))
      console.log('useEffect 3')
    }
  }, [form.oil_h_address])

  useEffect(() => {
    if (form.water_h_address === '-1') {
      setForm((prev) => ({ ...prev, water_h_scale: '1' }))
      console.log('useEffect 4')
    }
  }, [form.water_h_address])

  useEffect(() => {
    if (form.temp_address === '-1') {
      setForm((prev) => ({ ...prev, temp_scale: '1' }))
      console.log('useEffect 5')
    }
  }, [form.temp_address])

  useEffect(() => {
    if (form.probe_type_id === '3') {
      setForm((prev) => ({ ...prev, water_h_address: '-1', temp_address: '-1' }))
    }
  }, [form.probe_type_id])

  const handleDelete = async (id) => {
    if (!window.confirm('คุณต้องการลบ Probe นี้หรือไม่?')) return
    try {
      console.log('Delete ID:', id)
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/probe/setting/${id}`)

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/probe/setting`)
      const formattedData = res.data.map((item) => {
        return {
          probe_id: item.probe_id,
          probe_type_id: item.probe_type_id,
          probe_type_name: item.probe_type_name,
          oil_h_address: item.oil_h_address,
          oil_h_scale: item.oil_h_scale,
          water_h_address: item.water_h_address,
          water_h_scale: item.water_h_scale,
          temp_address: item.temp_address,
          temp_scale: item.temp_scale,
          format: item.format,
          function_code: item.function_code,
          address_length: item.address_length,
        }
      })
      setProbes(formattedData)
    } catch (err) {
      console.error('Error deleting probe:', err)
    }
  }

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/probe/setting`)
      .then((res) => {
        // console.log(res.data)
        const formattedData = res.data.map((item) => {
          return {
            probe_id: item.probe_id,
            probe_type_id: item.probe_type_id,
            probe_type_name: item.probe_type.probe_type_name,
            oil_h_address: item.oil_h_address,
            oil_h_scale: item.oil_h_scale,
            water_h_address: item.water_h_address,
            water_h_scale: item.water_h_scale,
            temp_address: item.temp_address,
            temp_scale: item.temp_scale,
            address_length: item.address_length,
            format: item.format,
            function_code: item.function_code,
          }
        })

        setProbes(formattedData)
        console.log(`probe : ${probes}`)
      })
      .catch((err) => {
        console.error('Error Fetching data:', err)
      })
  }, [])

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/probe/types`)
      .then((res) => {
        console.log('probeTypes:', res.data)
        const formattedData = res.data.map((item) => {
          return {
            probe_type_id: item.probe_type_id,
            probe_type_name: item.probe_type_name,
          }
        })
        setProbeTypes(formattedData)
      })

      .catch((err) => {
        console.error('Error Fetching data:', err)
      })
  }, [])

  const { t } = useTranslation()

  const [details, setDetails] = useState([])

  return (
    <>
      <AddProbeModal
        visible={visible}
        setVisible={setVisible}
        form={form}
        handleChange={handleChange}
        probeTypes={probeTypes}
        setProbeTypes={setProbeTypes}
        setProbes={setProbes}
        editMode={editMode}
        setEditMode={setEditMode}
        probes={probes}
      />
      <CCard>
        <CCardHeader
          className="pt-3 pb-3 mb-0"
          style={{
            background: '#4B79A1',
            color: 'white',
            fontWeight: '600',
            letterSpacing: '0.5px',
            borderBottom: '2px solid #2c3e50',
            boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.2)',
          }}
        >
          <h6 className="mb-0 fw-bold">Probe Setting</h6>
        </CCardHeader>
        <CCardBody className="mt-0 mb-0 p-3">
          <div className="d-flex justify-content-end mb-1">
            {/* <CButton
              color="primary"
              className="me-2 d-flex align-items-center mb-2"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => {
                setForm({
                  probe_id: '',
                  probe_type_id: '',
                  oil_h_address: '',
                  oil_h_scale: '1',
                  water_h_address: '',
                  water_h_scale: '1',
                  temp_address: '',
                  temp_scale: '1',
                  address_length: '',
                  format: '',
                  function_code: '',
                })
                setVisible(true)
              }}
            >
              <CIcon icon={cilPlus} className="me-2" />
              Add Probe
            </CButton> */}
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
                setVisible(true)
              }}
            >
              <CIcon icon={cilPlus} size="xl" className="me-2 ms-2" style={{ color: '#fff' }} />
              <p className="mb-0 fw-bold fs-6" style={{ color: '#fff' }}>
                Probe
              </p>
            </CButton>
          </div>
          <CSmartTable
            items={probes} // ✅ ใช้ probes จาก API แทน mock data
            columns={[
              { key: 'probe_id', label: 'Id', _style: { width: '6%' } },
              { key: 'probe_type_name', label: 'Type', _style: { width: '10%' } },
              { key: 'oil_h_address', label: 'Oil H Addr.', _style: { width: '12%' } },
              // { key: 'oil_len', label: 'Len', _style: { width: '5%' } },
              { key: 'oil_h_scale', label: 'Scale', _style: { width: '7%' } },
              { key: 'water_h_address', label: 'Water H Addr.' },
              // { key: 'water_len', label: 'Len', _style: { width: '5%' } },
              { key: 'water_h_scale', label: 'Scale', _style: { width: '7%' } },
              { key: 'temp_address', label: 'Temp Addr.' },
              // { key: 'temp_len', label: 'Len', _style: { width: '5%' } },
              { key: 'temp_scale', label: 'Scale', _style: { width: '7%' } },
              { key: 'address_length', label: 'Adrs Length', _style: { width: '11%' } },
              { key: 'format', label: 'Format', _style: { width: '8%' } },
              { key: 'function_code', label: 'Function Code', _style: { width: '8%' } },
              { key: 'actions', label: '', _style: { width: '8%' }, filter: false, sorter: false },
            ]}
            columnFilter
            columnSorter
            pagination
            itemsPerPage={5}
            scopedColumns={{
              oil_h_scale: (item) => <td className="text-left">{item.oil_h_scale == 1 ? '-' : item.oil_h_scale}</td>,
              water_h_scale: (item) => (
                <td className="text-left">{item.water_h_scale == 1 ? '-' : item.water_h_scale}</td>
              ),
              temp_scale: (item) => <td className="text-left">{item.temp_scale == 1 ? '-' : item.temp_scale}</td>,
              oil_h_address: (item) => (
                <td className="text-center">
                  {item.oil_h_address !== -1 ? `0x${item.oil_h_address.toString(16).padStart(4, '0')}` : '-'}
                </td>
              ),
              water_h_address: (item) => (
                <td className="text-center">
                  {item.water_h_address !== -1 ? `0x${item.water_h_address.toString(16).padStart(4, '0')}` : '-'}
                </td>
              ),
              temp_address: (item) => (
                <td className="text-center">
                  {item.temp_address !== -1 ? `0x${item.temp_address.toString(16).padStart(4, '0')}` : '-'}
                </td>
              ),
              // oil_len: () => <td className="text-center">2</td>,
              // water_len: () => <td className="text-center">2</td>,
              // temp_len: () => <td className="text-center">2</td>,
              // format: () => <td className="text-center">CD AB</td>,
              // function_code: () => <td className="text-center">03</td>,
              actions: (item) => (
                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                  <CButton
                    className="me-1"
                    onClick={() => {
                      setForm({
                        probe_id: item.probe_id,
                        probe_type_id: item.probe_type_id,
                        oil_h_address: item.oil_h_address,
                        oil_h_scale: item.oil_h_scale,
                        water_h_address: item.water_h_address,
                        water_h_scale: item.water_h_scale,
                        temp_address: item.temp_address,
                        temp_scale: item.temp_scale,
                        format: item.format,
                        function_code: item.function_code,
                        address_length: item.address_length,
                      })
                      setEditMode(true)
                      setVisible(true)
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton onClick={() => handleDelete(item.probe_id)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </td>
              ),
            }}
            tableProps={{
              responsive: true,
              // striped: true,
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

export default ProbeSetting
