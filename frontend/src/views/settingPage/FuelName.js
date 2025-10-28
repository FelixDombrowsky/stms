import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
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
  CFormTextarea,
  CFormLabel,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPen, cilPencil, cilTrash } from '@coreui/icons'

const FuelName = () => {
  const [fuelNames, setFuelNames] = useState([])
  const [fuelTypes, setFuelTypes] = useState([])

  const [addVisible, setAddVisible] = useState(0)
  const [deleteVisible, setDeleteVisible] = useState(0)
  const [deleteCode, setDeleteCode] = useState('')
  const [updateVisible, setUpdateVisible] = useState(0)

  // form
  const [fuelCode, setFuelCode] = useState('')
  const [fuelName, setFuelName] = useState('')
  const [fuelTypeCode, setFuelTypeCode] = useState('')
  const [density, setDensity] = useState('')
  const [fuelColor, setFuelColor] = useState('')
  const [description, setDescription] = useState('-')

  const fuelColors = [
    { color: '#F28B82' },
    { color: '#FDBA74' },
    { color: '#A8D5BA' },
    { color: '#CBAACB' },
    { color: '#A7C7E7' },
    { color: '#9BB7D4' },
    { color: '#FFF59D' },
  ]

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/name`)
      // const { data1 } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/type`)
      // console.log('data0:', data)
      // console.log('data1:', data1)
      const formatted = data.map((item) => ({
        fuel_code: item.fuel_code,
        fuel_name: item.fuel_name,
        fuel_type_code: item.fuel_type_code,
        fuel_type_name: item.fuel_type_name,
        fuel_color: item.fuel_color,
        description: item.description,
        density: item.density,
      }))
      setFuelNames(formatted)

      console.log(`Fuel Names :`, data)
    } catch (err) {
      console.error(`get fuel name error : ${err}`)
    }
  }
  const fetchFuelTypeData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/type`)
      const formatted = data.map((item) => ({
        fuel_type_code: item.fuel_type_code,
        fuel_type_name: item.fuel_type_name,
        description: item.description,
      }))
      console.log('fuel Types:', formatted)
      setFuelTypes(data)

      // console.log(`fuel name data :`, data)
    } catch (err) {
      console.error(`get fuel type error : ${err}`)
    }
  }
  const clearForm = () => {
    setFuelCode('')
    setFuelName('')
    setFuelTypeCode('')
    setDensity('')
    setFuelColor('')
    setDescription('-')
  }

  useEffect(() => {
    fetchData()
    fetchFuelTypeData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'fuelCode') setFuelCode(value)
    if (name === 'fuelName') setFuelName(value)
    if (name === 'fuelTypeCode') setFuelTypeCode(value)
    if (name === 'density') setDensity(value)
    if (name === 'fuelColor') setFuelColor(value)
    if (name === 'description') setDescription(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fuelCode || fuelCode.trim() === '') {
      alert(`Fuel Code is null!, please fill it again.`)
      return
    }
    if (!fuelName || fuelName.trim() === '') {
      alert(`fuel Name is null!, please fill it again.`)
      return
    }

    if (isNaN(Number(density))) {
      alert(`Density must be a number!`)
      return
    }
    if (Number(density) < 1 || Number(density) > 1000) {
      alert(` Density must be between 1-1000 kg/m³`)
      return
    }

    if (!fuelColor) {
      console.log('fuel color is null!, please fill it again.')
      return
    }
    if (!description || description.trim() === '') {
      console.log('set description')
      setDescription('-')
    }

    for (let i = 0; i < fuelNames.length; i++) {
      console.log(`i:${i}`)
      if (fuelCode === fuelNames[i].fuel_code) {
        console.log(`code ${fuelCode} is already used!`)
        alert(`Code ${fuelCode} is already used!`)
        return
      }
    }
    try {
      const payload = {
        fuel_code: fuelCode,
        fuel_name: fuelName,
        fuel_type_code: fuelTypeCode,
        density: Number(parseFloat(density).toFixed(2)),
        fuel_color: fuelColor,
        description: description,
      }
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/fuel/name`, payload)
      console.log(`data: `, data)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel created successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      // setFuelNames((prev) => [data.data, ...prev])
      fetchData()

      clearForm()

      setAddVisible(false)
    } catch (err) {
      console.error(`Add fuel name error : ${err}`)
      alert(`Add fuel name error!`)
    }
  }

  const handleDelete = async () => {
    console.log('delete_code:', deleteCode)
    try {
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/fuel/name/${deleteCode}`)
      console.log('delete data:', data)
      fetchData()
      // setFuelNames((prev) => prev.filter((f) => f.fuel_type_code !== deleteCode))

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel deleted successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      setDeleteCode('')
      clearForm()
      setDeleteVisible(false)
    } catch (err) {
      console.log('Delete fuel type error:', err)
      alert('Delete fuel type error!')
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    if (!fuelName || fuelName.trim() === '') {
      alert(`fuel Name is null!, please fill it again.`)
      return
    }

    if (isNaN(Number(density))) {
      alert(`Density must be a number!`)
      return
    }
    if (Number(density) < 1 || Number(density) > 1000) {
      alert(` Density must be between 1-1000 kg/m³`)
      return
    }

    if (!fuelColor) {
      console.log('fuel color is null!, please fill it again.')
      return
    }
    if (!description || description.trim() === '') {
      console.log('set description')
      setDescription('-')
    }

    try {
      const payload = {
        fuel_name: fuelName,
        fuel_type_code: fuelTypeCode,
        density: Number(parseFloat(density).toFixed(2)),
        fuel_color: fuelColor,
        description: description,
      }
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/fuel/name/${fuelCode}`, payload)
      console.log(`edit data: `, data)
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: `Fuel updated successfully!`,
        showConfirmButton: false,
        timer: 1500,
      })

      fetchData()
      setUpdateVisible(false)
      clearForm()
    } catch (err) {
      console.error(`Edit fuel type error : ${err}`)
      alert(`Edit fuel type error!`)
    }
  }

  const addFuelName = () => {
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
          <CModalTitle>Add Fuel Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Code :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="fuelCode"
                  value={fuelCode}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder="Enter Fuel Code e.g. 001"
                  required
                />
              </CCol>
            </CRow>

            {/* FUEL NAME */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Name :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="fuelName"
                  value={fuelName}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="Enter Fuel Name e.g. Gasohol91"
                  required
                />
              </CCol>
            </CRow>

            {/* FUEL TYPE */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Type :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormSelect name="fuelTypeCode" value={fuelTypeCode} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {fuelTypes.map((item, index) => (
                    <option key={index} value={item.fuel_type_code}>
                      {item.fuel_type_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* DENSITY */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Density (Kg/m³) :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                {/* <CFormSelect name="density" value={density} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {fuelTypes.map((item, index) => (
                    <option key={index} value={item.fuel_type_code}>
                      {item.fuel_type_name}
                    </option>
                  ))}
                </CFormSelect> */}
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

            {/* FUEL COLOR */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Color :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '30px',
                      height: '24px',
                      backgroundColor: fuelColor || '#ccc',
                      border: '1px solid #999',
                      borderRadius: '4px',
                      marginRight: '8px',
                    }}
                  ></div>

                  <CFormSelect name="fuelColor" value={fuelColor} onChange={handleChange} required>
                    <option value="" disabled>
                      Select Fuel Color
                    </option>
                    {fuelColors.map((item, index) => (
                      <option
                        key={index}
                        value={item.color}
                        style={{
                          backgroundColor: item.color,
                          color: '#000',
                        }}
                      >
                        {item.color}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            {/* DESCRIPTION */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Description :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormTextarea
                  name="description"
                  value={description}
                  rows={1}
                  placeholder="Enter description here..."
                  onChange={handleChange}
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
          <CModalTitle>Edit Fuel Name</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleUpdateSubmit}>
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Code :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="fuelCode"
                  value={fuelCode}
                  onChange={handleChange}
                  maxLength={15}
                  placeholder="Enter Fuel Code e.g. 001"
                  required
                  disabled
                />
              </CCol>
            </CRow>

            {/* FUEL NAME */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Name :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormInput
                  name="fuelName"
                  value={fuelName}
                  onChange={handleChange}
                  maxLength={30}
                  placeholder="Enter Fuel Name e.g. Gasohol91"
                  required
                />
              </CCol>
            </CRow>

            {/* FUEL TYPE */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Type :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormSelect name="fuelTypeCode" value={fuelTypeCode} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {fuelTypes.map((item, index) => (
                    <option key={index} value={item.fuel_type_code}>
                      {item.fuel_type_name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            {/* DENSITY */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Density (Kg/m³) :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                {/* <CFormSelect name="density" value={density} onChange={handleChange} required>
                  <option value="" disabled>
                    Select Fuel Type
                  </option>
                  {fuelTypes.map((item, index) => (
                    <option key={index} value={item.fuel_type_code}>
                      {item.fuel_type_name}
                    </option>
                  ))}
                </CFormSelect> */}
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

            {/* FUEL COLOR */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Fuel Color :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: '30px',
                      height: '24px',
                      backgroundColor: fuelColor || '#ccc',
                      border: '1px solid #999',
                      borderRadius: '4px',
                      marginRight: '8px',
                    }}
                  ></div>

                  <CFormSelect name="fuelColor" value={fuelColor} onChange={handleChange} required>
                    <option value="" disabled>
                      Select Fuel Color
                    </option>
                    {fuelColors.map((item, index) => (
                      <option
                        key={index}
                        value={item.color}
                        style={{
                          backgroundColor: item.color,
                          color: '#000',
                        }}
                      >
                        {item.color}
                      </option>
                    ))}
                  </CFormSelect>
                </div>
              </CCol>
            </CRow>

            {/* DESCRIPTION */}
            <CRow className="mb-3 align-items-center">
              <CCol md={4} className="text-end pe-2">
                <CFormLabel className="m-0 fw-semibold">Description :</CFormLabel>
              </CCol>
              <CCol md={8} className="text-start w-50">
                <CFormTextarea
                  name="description"
                  value={description}
                  rows={1}
                  placeholder="Enter description here..."
                  onChange={handleChange}
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
      {addVisible === true && addFuelName()}
      {deleteVisible === true && deleteFuelType()}
      {updateVisible === true && updateFuelType()}

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
          <h6 className="mb-0 fw-bold">Fuel Name</h6>
        </CCardHeader>
        <CCardBody className="mt-2 mb-3 p-3">
          <div className="d-flex justify-content-end">
            <div>
              {/* <CButton
                color="primary"
                className="me-2
                 d-flex align-items-center"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  setAddVisible(true)
                  console.log('Click')
                  console.log(addVisible)
                  console.log('fuelNames:', fuelNames)
                }}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add Fuel Name
              </CButton> */}
              <CButton
                color="primary"
                size="md"
                className="fw-semibold d-flex justify-content-between align-items-center ps-1 pe-3 pt-2 pb-2 ms-3 mb-1"
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
                  Fuel Name
                </p>
              </CButton>
            </div>
          </div>
          <CSmartTable
            items={fuelNames}
            columns={[
              { key: 'fuel_code', label: 'Code', _style: { width: '200px' } },
              { key: 'fuel_name', label: 'Name', _style: { width: '200px' } },
              { key: 'fuel_type_name', label: 'Type', _style: { width: '200px' } },
              { key: 'density', label: 'Density (Kg/m³)', _style: { width: '200px' } },
              { key: 'fuel_color', label: 'Color', _style: { width: '150px' } },
              { key: 'description', label: 'Description', _style: { width: 'auto' } },
              { key: 'actions', label: '', _style: { width: '50px' }, filter: false, sorter: false },
            ]}
            columnFilter
            columnSorter
            pagination
            itemsPerPage={5}
            scopedColumns={{
              density: (item) => (
                <td className="ps-3">
                  {item.density !== null && item.density !== undefined
                    ? item.density.toLocaleString('th', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : '-'}
                </td>
              ),
              fuel_color: (item) => (
                <td>
                  <div
                    style={{
                      width: '100px',
                      height: '24px',
                      borderRadius: '4px',
                      backgroundColor: item.fuel_color || '#ccc',
                      border: '1px solid #999',
                    }}
                  ></div>
                </td>
              ),
              description: (item) => <td className="ps-3">{item.description}</td>,
              actions: (item) => (
                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                  <CButton
                    className="me-1"
                    onClick={() => {
                      setFuelCode(item.fuel_code)
                      setFuelName(item.fuel_name)
                      setFuelTypeCode(item.fuel_type_code)
                      setDensity(item.density)
                      setFuelColor(item.fuel_color)
                      setDescription(item.description)
                      setUpdateVisible(true)
                    }}
                  >
                    <CIcon icon={cilPencil} />
                  </CButton>
                  <CButton onClick={() => (setDeleteVisible(true), setDeleteCode(item.fuel_code))}>
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

export default FuelName
