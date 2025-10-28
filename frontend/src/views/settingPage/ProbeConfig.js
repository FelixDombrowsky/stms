import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
  CAlert,
  CSmartTable,
  CToast,
  CToaster,
  CToastHeader,
  CToastBody,
} from '@coreui/react-pro'
import WriteModal from './WriteModal'
const api = import.meta.env.VITE_API_URL

function ProbeConfig() {
  // Write Probe
  const [toast, setToast] = useState(0)

  const addToast = (message, color = 'success') => {
    setToast(
      <CToast color={color} autohide={true} delay={5000}>
        <CToastHeader closeButton>
          <strong className="me-auto">Notification</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>,
    )
  }

  const [form, setForm] = useState({
    probe_id: '',
    write_value: '',
    register_address: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    console.log(form)
  }

  const handleCancel = () => {
    setForm({
      probe_id: '',
      funtion_code: 6,
      register_address: '',
      write_value: '',
    })
  }

  const [visible, setVisible] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertStatus, setAlertStatus] = useState('')

  useEffect(() => {
    setAlertStatus('')
    setAlertMessage('')
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      console.log('write:', form)
      const res = await axios.post(`${api}/api/probe/config/write`, {
        probe_id: parseInt(form.probe_id),
        write_value: parseInt(form.write_value),
        register_address: parseInt(form.register_address),
      })
      console.log('Writing value to modbus ...', res)
      if (res.status === 200) {
        // addToast('Write Probe Success!', 'success')
        setAlertMessage('Write Probe Success !')
        setAlertStatus('success')
        handleCancel()

        setTimeout(() => {
          setAlertMessage('')
        }, 5000)
      } else {
        // addToast('Write Probe Error!', 'danger')
        setAlertMessage('Write Probe Error !')
        setAlertStatus('danger')
        setTimeout(() => {
          setAlertMessage('')
        }, 5000)
      }
    } catch (err) {
      console.error('Error writing:', err)
      setAlertMessage('Write Probe Error !')
      setAlertStatus('danger')
      setTimeout(() => {
        setAlertMessage('')
      }, 5000)
      // addToast('Write Probe Error!', 'danger')
    }
  }

  const isFormFilled = form.probe_id !== '' || form.write_value !== '' || form.register_address !== ''

  // Read Probe
  const [formR, setFormR] = useState({
    probe_id: '',
    function_code: '03',
    address_start: '0',
    address_length: '1',
    format: 'AB',
    row_count: '1',
  })

  const handleChangeR = (e) => {
    setFormR({ ...formR, [e.target.name]: e.target.value })
    console.log(formR)
  }

  useEffect(() => {
    if (formR.address_length === '2') {
      setFormR({ ...formR, format: 'AB CD' })
    } else if (formR.address_length === '1') {
      setFormR({ ...formR, format: 'AB' })
    }
  }, [formR.address_length])

  const isFormFilledR =
    formR.probe_id !== '' ||
    formR.address_start !== '0' ||
    formR.row_count !== '1' ||
    formR.function_code !== '03' ||
    formR.address_length !== '1' ||
    formR.format !== 'AB'

  const handleCancelR = () => {
    setFormR({
      ...formR,
      probe_id: '',
      address_start: '0',
      row_count: '1',
      function_code: '03',
      address_length: '1',
      format: 'AB',
    })
    setReadProbe([])
  }

  const handleSubmitR = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post(`${api}/api/probe/config/read`, {
        probe_id: parseInt(formR.probe_id),
        address_start: parseInt(formR.address_start),
        address_length: parseInt(formR.address_length),
        row_count: parseInt(formR.row_count),
        function_code: formR.function_code,
        format: formR.format,
      })
      console.log(`data : `, res.data.rows)
      const data = res.data.rows
      const probe_data = data.map((v, i) => {
        console.log(`address type : `, typeof v.address)
        const num_address = Number(v.address)

        if (v.length === 1) {
          return {
            address_dec: num_address,
            address_hex: `0x${num_address.toString(16).padStart(4, '0')}`,
            value: v.value,
            length: v.length,
          }
        } else if (v.length === 2) {
          return {
            address_dec: `${num_address} - ${num_address + 1}`,
            address_hex: `0x${num_address.toString(16).padStart(4, '0')} - 0x${(num_address + 1).toString(16).padStart(4, '0')}`,
            value: v.value,
            length: v.length,
          }
        }
      })
      console.log(probe_data)
      setReadProbe(probe_data)
      // alert('Read Success!')
      // console.log
    } catch (err) {
      console.error('error :', err)
      alert(err.response.data.message)
    }
  }

  const [readProbe, setReadProbe] = useState([])
  const tableData = readProbe.map((item, i) => ({ index: i + 1, ...item }))

  // useEffect(() => {
  //   console.log(`read probe state :`, readProbe)
  // }, [handleSubmitR])

  return (
    <>
      {/* <WriteModal visible={visible} setVisible={setVisible} handleSubmit={handleSubmit} /> */}
      {/* <CToaster placement="top-end">{toast}</CToaster> */}
      <CCardBody className="mb-3">
        {alertMessage && (
          <CAlert color={alertStatus} dismissible onClose={() => setAlertMessage('')}>
            {alertMessage}
          </CAlert>
        )}
        {/* Write Probe */}
        <h5 className="mb-0 fw-bold p-2">Write Probe</h5>
        <CForm onSubmit={handleSubmit}>
          <CCard className="mt-2 mb-2 p-4">
            <CRow className="mb-4 gy-3 align-items-center">
              <CCol md={2} className="fw-semibold">
                Probe ID :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="probe_id" value={form.probe_id} onChange={handleChange} required>
                  <option value="" disabled>
                    Select ID
                  </option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              {/* <CCol md={1}></CCol> */}

              <CCol md={2} className=" fw-semibold">
                Function Code :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="function_code" value={form.function_code} onChange={handleChange} required>
                  <option value="6">06 – Preset Single Register</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* <hr /> */}

            <CRow className="align-items-center">
              <CCol md={2} className="fw-semibold">
                Register Address :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="register_address" value={form.register_address} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Address
                  </option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              {/* <CCol md={1} /> */}
              <CCol md={2} className="text-first fw-semibold">
                Write Value :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="write_value" value={form.write_value} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Value
                  </option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol className="d-flex justify-content-end gap-2">
                <CButton type="submit" color="primary">
                  Write
                </CButton>
                {isFormFilled && (
                  <CButton color="secondary" onClick={handleCancel}>
                    Cancel
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCard>
        </CForm>

        {/* Read Probe */}
        <h5 className="mb-0 fw-bold p-2">Read Probe</h5>
        <CForm onSubmit={handleSubmitR}>
          <CCard className="mt-2 mb-2 p-4">
            <CRow className="mb-4 gy-3 align-items-center">
              <CCol md={2} className="fw-semibold">
                Probe ID :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="probe_id" value={formR.probe_id} onChange={handleChangeR} required>
                  <option value="" disabled>
                    Select ID
                  </option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              {/* <CCol md={1}></CCol> */}

              <CCol md={2} className=" fw-semibold">
                Function Code :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="function_code" value={formR.function_code} onChange={handleChangeR} required>
                  <option value="03">03 – Read Holding Register</option>
                  <option value="04">04 – Read Input Register</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-4 gy-3 align-items-center">
              <CCol md={2} className="fw-semibold">
                Address Start :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="address_start" value={formR.address_start} onChange={handleChangeR} required>
                  <option value="" disabled>
                    Select Address
                  </option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              {/* <CCol md={1}></CCol> */}

              <CCol md={2} className=" fw-semibold">
                Address Length :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="address_length" value={formR.address_length} onChange={handleChangeR} required>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </CFormSelect>
              </CCol>
            </CRow>

            {/* <hr /> */}

            <CRow className="align-items-center">
              <CCol md={2} className="fw-semibold">
                Format :
              </CCol>
              <CCol md={3}>
                <CFormSelect
                  name="format"
                  value={formR.format}
                  onChange={handleChangeR}
                  disabled={formR.address_length === '1'}
                  required
                >
                  {formR.address_length === '1' ? (
                    <option value="AB">AB</option>
                  ) : (
                    <>
                      <option value="AB CD">AB CD</option>
                      <option value="CD AB">CD AB</option>
                      <option value="BA DC">BA DC</option>
                      <option value="DC BA">DC BA</option>
                    </>
                  )}
                </CFormSelect>
              </CCol>
              {/* <CCol md={1} /> */}
              <CCol md={2} className="text-first fw-semibold">
                Row Count :
              </CCol>
              <CCol md={3}>
                <CFormSelect name="row_count" value={formR.row_count} onChange={handleChangeR} required>
                  <option value="" disabled>
                    Select Value
                  </option>
                  {[...Array(40).keys()].map((i) => (
                    <option key={i + 1} value={i + 1}>
                      {`${i + 1}`}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol className="d-flex justify-content-end gap-2">
                <CButton type="submit" color="primary">
                  Read
                </CButton>
                {isFormFilledR && (
                  <CButton color="secondary" onClick={handleCancelR}>
                    Cancel
                  </CButton>
                )}
              </CCol>
            </CRow>
          </CCard>
        </CForm>

        <CCard className="p-2">
          <CSmartTable
            items={tableData}
            columns={[
              { key: 'index', label: '', _style: { width: '10%' } },
              { key: 'address_dec', label: 'Address (Dec)', sorter: false },
              { key: 'address_hex', label: 'Address (Hex)', sorter: false },
              { key: 'value', label: 'Value' },
            ]}
            columnFilter
            columnSorter
            pagination
            itemsPerPage={8}
            // scopedColumns={{
            //   index: (item, index) => <td>{index + 1}</td>,
            // }}
            tableProps={{
              responsive: true,
              // striped: true,
              hover: true,
            }}
            tableBodyProps={{
              className: 'align-middle',
            }}
          />
        </CCard>
      </CCardBody>
    </>
  )
}

export default ProbeConfig
