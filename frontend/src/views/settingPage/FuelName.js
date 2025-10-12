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
  const [fuelType, setFuelType] = useState('')
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
      console.log('data0:', data)
      // console.log('data1:', data1)
      const formatted = data.map((item) => ({
        fuel_code: item.fuel_code,
        fuel_name: item.fuel_name,
        fuel_type_code: item.fuel_type_code,
        fuel_type_name: item.fuel_type?.fuel_type_name || '',
        fuel_color: item.fuel_color,
        description: item.description,
      }))
      setFuelNames(formatted)

      console.log(`fuel name data :`, data)
    } catch (err) {
      console.error(`get fuel name error : ${err}`)
    }
  }
  const fetchFuelTypeData = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/fuel/type`)

      console.log('data0:', data)
      setFuelTypes(data)

      // console.log(`fuel name data :`, data)
    } catch (err) {
      console.error(`get fuel type error : ${err}`)
    }
  }
  const clearForm = () => {
    setFuelCode('')
    setFuelName('')
    setFuelType('')
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
    if (name === 'fuelType') setFuelType(value)
    if (name === 'fuelColor') setFuelColor(value)
    if (name === 'description') setDescription(value)
    // console.log(`fuelCode:`, fuelCode)
    // console.log(`fuelName:`, fuelName)
    // console.log(`fuelType:`, fuelType)
    // console.log(`fuelColor:`, fuelColor)
    // console.log(`Desc:`, description)
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
        description: description,
        fuel_type_code: fuelType,
        fuel_color: fuelColor,
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

      setFuelCode('')
      setFuelName('')
      setDescription('-')
      setFuelType('')
      setFuelColor('')

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
      setDeleteVisible(false)
    } catch (err) {
      console.log('Delete fuel type error:', err)
      alert('Delete fuel type error!')
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()
    console.log('handleUPdateSubmit')
    if (!fuelName || fuelName.trim() === '') {
      alert(`fuel Name is null!, please fill it again.`)
      return
    }

    try {
      const payload = {
        fuel_name: fuelName,
        description: description,
        fuel_color: fuelColor,
        fuel_type_code: fuelType,
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
                <CFormSelect name="fuelType" value={fuelType} onChange={handleChange} required>
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
                <CFormSelect name="fuelType" value={fuelType} onChange={handleChange} required>
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
        <CCardHeader className="mb-2">
          <CRow className="align-items-center">
            <CCol xs={8}>
              <h5 className="mb-0 fw-bold">Fuel Name</h5>
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
                  console.log('fuelNames:', fuelNames)
                }}
              >
                <CIcon icon={cilPlus} className="me-2" />
                Add Fuel Name
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody className="mt-2 mb-3 p-3">
          <CSmartTable
            items={fuelNames}
            columns={[
              { key: 'fuel_code', label: 'code', _style: { width: '200px' } },
              { key: 'fuel_name', label: 'name', _style: { width: '200px' } },
              { key: 'fuel_type_name', label: 'type', _style: { width: '200px' } },
              { key: 'fuel_color', label: 'color', _style: { width: '150px' } },
              { key: 'description', label: 'description', _style: { width: 'auto' } },
              { key: 'actions', label: '', _style: { width: '200px' }, filter: false, sorter: false },
            ]}
            columnFilter
            columnSorter
            pagination
            itemsPerPage={5}
            scopedColumns={{
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
              actions: (item) => (
                <td className="text-center" style={{ whiteSpace: 'nowrap' }}>
                  <CButton
                    className="me-1"
                    onClick={() => {
                      setFuelCode(item.fuel_code)
                      setFuelName(item.fuel_name)
                      setFuelType(item.fuel_type_code)
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

export default FuelName
