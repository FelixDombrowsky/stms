import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
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
  CCardHeader,
  CModalContent,
  CFormLabel,
  CFormTextarea,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPen, cilPencil, cilTrash } from '@coreui/icons'
import Swal from 'sweetalert2'

const FuelType = () => {
  const [fuelType, setFuelType] = useState([])
  const [addVisible, setAddVisible] = useState(0)
  const [deleteVisible, setDeleteVisible] = useState(0)
  const [deleteCode, setDeleteCode] = useState('')
  const [updateVisible, setUpdateVisible] = useState(0)

  // form
  const [code, setCode] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/type`)
      console.log('data0:', data[0])
      const formatted = data.map((item) => ({
        fuel_type_code: item.fuel_type_code,
        fuel_type_name: item.fuel_type_name,
        description: item.description,
      }))
      setFuelType(formatted)

      console.log(`fuelType data :`, data)
    } catch (err) {
      console.error(`get fuel type error : ${err}`)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const clearForm = () => {
    setCode('')
    setType('')
    setDescription('')
  }

  const handleChange = (e) => {
    // console.log(`fuel type code 0:`, fuelType[0].fuel_type_code)
    const { name, value } = e.target
    if (name === 'code') setCode(value)
    if (name === 'type') setType(value)
    if (name === 'description') setDescription(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!code || code.trim() === '') {
      alert(`Code is null!, please fill it again.`)
      return
    }
    if (!type || type.trim() === '') {
      alert(`fuel type is null!, please fill it again.`)
      return
    }

    for (let i = 0; i < fuelType.length; i++) {
      console.log(`i:${i}`)
      if (code === fuelType[i].fuel_type_code) {
        console.log(`code ${code} already used!`)
        alert(`Code ${code} already used!`)
        return
      }
    }

    // const densityNum = Number(parseFloat(density).toFixed(2))
    // console.log('desnity Num : ', densityNum)
    // if (isNaN(densityNum)) {
    //   alert(`Density must be a number!`)
    //   return
    // }
    // if (densityNum < 1 || densityNum > 1000) {
    //   alert(` Density must be between 1-1000 kg/m³`)
    //   return
    // }

    try {
      const payload = {
        fuel_type_code: code.trim(),
        fuel_type_name: type.trim(),
        description: description,
      }
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/fuel/type`, payload)
      console.log(`data: `, data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel Type created successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      setFuelType((prev) => [data.data, ...prev])

      setCode('')
      setType('')
      setDescription('')

      setAddVisible(false)
    } catch (err) {
      console.error(`Add fuel type error : ${err}`)
      alert(`Add fuel type error!`)
    }
  }

  const handleDelete = async () => {
    console.log('delete_code:', deleteCode)
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/fuel/type/${deleteCode}`)
      console.log('delete data:', data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel Type Deleted successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      setFuelType((prev) => prev.filter((f) => f.fuel_type_code !== deleteCode))

      setDeleteCode('')
      setDeleteVisible(false)
    } catch (err) {
      console.log('Delete fuel type error:', err)
      alert('Delete fuel type error!')
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    console.log('handleUPdateSubmit')
    if (!type || type.trim() === '') {
      alert(`fuel type is null!, please fill it again.`)
      return
    }

    // const densityNum = Number(parseFloat(density).toFixed(2))
    // console.log('desnity Num : ', densityNum)
    // if (isNaN(densityNum)) {
    //   alert(`Density must be a number!`)
    //   return
    // }
    // if (densityNum < 1 || densityNum > 1000) {
    //   alert(` Density must be between 1-1000 kg/m³`)
    //   return
    // }

    try {
      const payload = {
        fuel_type_name: type.trim(),
        description: description,
      }
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/fuel/type/${code}`, payload)
      console.log(`edit data: `, data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel Type updated successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      setCode('')
      setType('')
      setDescription('')
      setUpdateVisible(false)
      fetchData()
    } catch (err) {
      console.error(`Edit fuel type error : ${err}`)
      alert(`Edit fuel type error!`)
    }
  }

  const addFuelType = () => {
    return (
      <CModal
        className="w-200"
        visible={addVisible}
        onClose={() => {
          setAddVisible(false)
          clearForm()
        }}
      >
        <CModalHeader>
          <CModalTitle>Add Fuel Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Code :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="code"
                  value={code}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder={'e.g. 001'}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Type :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="type"
                  value={type}
                  maxLength={15}
                  placeholder={'e.g. Diesel, Gasoline'}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Description:</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                {/* <CFormInput
                  name="density"
                  value={density}
                  maxLength={8}
                  type="number"
                  step="any"
                  min="0"
                  max="1000"
                  placeholder={'e.g. 870.00'}
                  onChange={handleChange}
                  required
                /> */}
                <CFormTextarea
                  name="description"
                  value={description}
                  type="textarea"
                  rows={1}
                  onChange={handleChange}
                ></CFormTextarea>
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

  const deleteFuelType = () => {
    console.log('deleteFueltype')
    // setDeleteVisible(true)
    // let fuel_code = code
    return (
      <CModal visible={deleteVisible} onClose={() => setDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete Fuel Type</CModalTitle>
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

  const updateFuelType = () => {
    return (
      <CModal
        className="w-200"
        visible={updateVisible}
        onClose={() => {
          setUpdateVisible(false)
          clearForm()
        }}
      >
        <CModalHeader>
          <CModalTitle>Edit Fuel Type</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleUpdateSubmit}>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Code :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="code"
                  value={code}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder={'e.g. 001'}
                  required
                  disabled
                />
              </CCol>
            </CRow>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Type :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="type"
                  value={type}
                  maxLength={15}
                  placeholder={'e.g. Diesel, Gasoline'}
                  onChange={handleChange}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Description :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                {/* <CFormInput
                  name="density"
                  value={density}
                  maxLength={8}
                  type="number"
                  step="any"
                  min="0"
                  max="1000"
                  placeholder={'e.g. 870.00'}
                  onChange={handleChange}
                  required
                /> */}
                <CFormTextarea
                  name="description"
                  value={description}
                  type="textarea"
                  rows={1}
                  onChange={handleChange}
                ></CFormTextarea>
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

  return (
    <>
      {addVisible === true && addFuelType()}
      {deleteVisible === true && deleteFuelType()}
      {updateVisible === true && updateFuelType()}

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
          className="pt-3 pb-3"
        >
          <h6 className="mb-0 fw-bold">Fuel Type</h6>
        </CCardHeader>
        <CCardBody className="mt-0 mb-0 p-3">
          <div className="d-flex mb-1 mt-0 justify-content-end">
            <div>
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
                  Fuel Type
                </p>
              </CButton>
            </div>
          </div>
          <CSmartTable
            items={fuelType}
            columns={[
              { key: 'fuel_type_code', label: 'Code', _style: { width: '20%' } },
              { key: 'fuel_type_name', label: 'Type', _style: { width: '35%' } },
              { key: 'description', label: 'Description', _style: { width: '35%' } },
              { key: 'actions', label: '', _style: { width: '10%' }, filter: false, sorter: false },
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
                      setCode(item.fuel_type_code)
                      setType(item.fuel_type_name)
                      setDescription(item.description)
                      setUpdateVisible(true)
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton onClick={() => setDeleteVisible(true) & setDeleteCode(item.fuel_type_code)}>
                    <CIcon icon={cilTrash} />
                  </CButton>
                </td>
              ),
            }}
            tableProps={{
              responsive: true,

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

export default FuelType
