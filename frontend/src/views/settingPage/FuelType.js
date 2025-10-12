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
  const [density, setDensity] = useState('')

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/type`)
      console.log('data0:', data[0])
      setFuelType(data)

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
    setDensity('')
  }

  const handleChange = (e) => {
    // console.log(`fuel type code 0:`, fuelType[0].fuel_type_code)
    const { name, value } = e.target
    if (name === 'code') setCode(value)
    if (name === 'type') setType(value)
    if (name === 'density') setDensity(value)

    console.log('density:', density)
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
    if (!density || density.trim() === '') {
      alert(`Density is null!, please fill it again.`)
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

    const densityNum = Number(parseFloat(density).toFixed(2))
    console.log('desnity Num : ', densityNum)
    if (isNaN(densityNum)) {
      alert(`Density must be a number!`)
      return
    }
    if (densityNum < 1 || densityNum > 1000) {
      alert(` Density must be between 1-1000 kg/m³`)
      return
    }

    try {
      const payload = {
        fuel_type_code: code.trim(),
        fuel_type_name: type.trim(),
        density: densityNum,
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
      setDensity('')

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
    if (!density || density.trim() === '') {
      alert(`Density is null!, please fill it again.`)
      return
    }

    const densityNum = Number(parseFloat(density).toFixed(2))
    console.log('desnity Num : ', densityNum)
    if (isNaN(densityNum)) {
      alert(`Density must be a number!`)
      return
    }
    if (densityNum < 1 || densityNum > 1000) {
      alert(` Density must be between 1-1000 kg/m³`)
      return
    }

    try {
      const payload = {
        fuel_type_name: type.trim(),
        density: densityNum,
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
      setDensity('')
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
                <CFormLabel className="m-0 fw-semibold">Fuel Density (kg/m3) :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
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
                <CFormLabel className="m-0 fw-semibold">Fuel Density (kg/m3) :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
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

  return (
    <>
      {addVisible === true && addFuelType()}
      {deleteVisible === true && deleteFuelType()}
      {updateVisible === true && updateFuelType()}

      <CCard>
        <CCardHeader className="mb-2">
          <CRow className="align-items-center">
            <CCol xs={8}>
              <h5 className="mb-0 fw-bold">Fuel Type</h5>
            </CCol>

            <CCol xs={4} className="d-flex justify-content-end">
              <CButton
                color="primary"
                className="me-2
                 d-flex align-items-center"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  setAddVisible(true)
                  console.log('Click')
                  console.log(addVisible)
                }}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add Fuel Type
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody className="mt-2 mb-3 p-3">
          <CSmartTable
            items={fuelType}
            columns={[
              { key: 'fuel_type_code', label: 'code', _style: { width: '20%' } },
              { key: 'fuel_type_name', label: 'type', _style: { width: '35%' } },
              { key: 'density', label: 'density (kg/m3)', _style: { width: '35%' } },
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
                      setDensity(item.density)
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

export default FuelType
