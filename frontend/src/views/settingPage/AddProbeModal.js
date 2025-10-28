import React from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormLabel,
} from '@coreui/react-pro'

const AddProbeModal = ({
  visible,
  setVisible,
  form,
  handleChange,
  probeTypes,
  setProbeTypes,
  setProbes,
  editMode,
  setEditMode,
  probes,
}) => {
  // กดปุ่ม submit แล้วเรียก
  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(form)

    try {
      if (editMode) {
        // update

        await axios.put(`${import.meta.env.VITE_API_URL}/api/probe/setting/${form.probe_id}`, {
          probe_type_id: parseInt(form.probe_type_id),
          oil_h_address: parseInt(form.oil_h_address),
          oil_h_scale: Number(form.oil_h_scale),
          water_h_address: parseInt(form.water_h_address),
          water_h_scale: Number(form.water_h_scale),
          temp_address: parseInt(form.temp_address),
          temp_scale: Number(form.temp_scale),
          format: form.format,
          function_code: form.function_code,
          address_length: parseInt(form.address_length),
        })
        console.log('Updated:', form)
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Probe updated successfully!`,
          showConfirmButton: false,
          timer: 1500,
        })
      } else {
        console.log(probes.length)
        console.log(parseInt(form.probe_id))
        // console.log(probes[0].probe_id)
        console.log('Probe Length:', probes.length)
        if (probes.length > 0) {
          for (let i = 0; i < probes.length; i++) {
            if (parseInt(form.probe_id) === probes[i].probe_id) {
              alert('Probe ID already use')
              console.log('Probe ID already use')
              return
            }
          }
        }

        // insert

        await axios.post(`${import.meta.env.VITE_API_URL}/api/probe/setting`, {
          probe_id: parseInt(form.probe_id),
          probe_type_id: parseInt(form.probe_type_id),
          oil_h_address: parseInt(form.oil_h_address),
          oil_h_scale: Number(form.oil_h_scale),
          water_h_address: parseInt(form.water_h_address),
          water_h_scale: Number(form.water_h_scale),
          temp_address: parseInt(form.temp_address),
          temp_scale: Number(form.temp_scale),
          format: form.format,
          function_code: form.function_code,
          address_length: parseInt(form.address_length),
        })
        console.log('Created Success!')
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Probe created successfully!`,
          showConfirmButton: false,
          timer: 1500,
        })
      }

      //refresh table
      const res1 = await axios.get(`${import.meta.env.VITE_API_URL}/api/probe/setting`)
      // const res2 = await axios.get('http://localhost:8800/probe_types')
      const formattedData1 = res1.data.map((item) => {
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
          format: item.format,
          function_code: item.function_code,
          address_length: item.address_length,
        }
      })
      setProbes(formattedData1)

      setVisible(false) // ปิด Modal

      setEditMode(false)
    } catch (err) {
      console.error('Error saving probe:', err)
    }
  }

  console.log('render probeTypes:', probeTypes)

  return (
    <CModal visible={visible} size="lg" onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle className="ms-2">{editMode ? 'Update Probe' : 'Add Probe'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm onSubmit={handleSubmit} className="w-100 px-2 px-md-3">
          {/* ===================== 1. ID / TYPE / ADDRESS LENGTH ===================== */}
          <CRow className="g-3 mt-3 mb-3">
            <CCol xs={12} md={7}>
              <CRow className="g-3">
                {/* ID */}
                <CCol xs={12} md={6}>
                  <div className="d-flex align-items-center">
                    <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Id :</CFormLabel>
                    <CFormSelect
                      name="probe_id"
                      value={form.probe_id}
                      onChange={handleChange}
                      disabled={editMode}
                      className="flex-grow-1"
                      required
                    >
                      <option value="" disabled>
                        Select ID
                      </option>
                      {[...Array(16).keys()].map((i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>

                {/* TYPE */}
                <CCol xs={12} md={6}>
                  <div className="d-flex align-items-center">
                    <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Type :</CFormLabel>
                    <CFormSelect
                      name="probe_type_id"
                      value={form.probe_type_id}
                      onChange={handleChange}
                      className="flex-grow-1"
                      required
                    >
                      <option value="" disabled>
                        Select Type
                      </option>
                      {probeTypes.map((item) => (
                        <option key={item.probe_type_id} value={item.probe_type_id}>
                          {item.probe_type_name}
                        </option>
                      ))}
                    </CFormSelect>
                  </div>
                </CCol>
              </CRow>
            </CCol>

            {/* RIGHT: ADDRESS LENGTH */}
            <CCol xs={12} md={5}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Address Length :</CFormLabel>
                <CFormSelect
                  name="address_length"
                  value={form.address_length}
                  onChange={handleChange}
                  className="flex-grow-1"
                  required
                >
                  <option value="" disabled>
                    Select Length
                  </option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </CFormSelect>
              </div>
            </CCol>
          </CRow>

          {/* ===================== 2. OIL HEIGHT + SCALE ===================== */}
          <CRow className="mb-3 align-items-center">
            {/* Oil Height Address */}
            <CCol xs={12} md={7}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Oil Height Address :</CFormLabel>
                <CFormSelect
                  name="oil_h_address"
                  value={form.oil_h_address}
                  onChange={handleChange}
                  required
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Address
                  </option>
                  <option value="-1">None</option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            {/* Oil Scale */}
            <CCol xs={12} md={5}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Oil Scale (mm) :</CFormLabel>
                <CFormSelect
                  name="oil_h_scale"
                  value={form.oil_h_scale}
                  onChange={handleChange}
                  disabled={form.oil_h_address === '-1'}
                  required
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Scale
                  </option>
                  <option value="1">None (*1)</option>
                  <option value="0.0001">* 0.0001</option>
                  <option value="0.001">* 0.001</option>
                  <option value="0.01">* 0.01</option>
                  <option value="0.1">* 0.1</option>
                  <option value="10">* 10</option>
                  <option value="100">* 100</option>
                  <option value="1000">* 1,000</option>
                  <option value="10000">* 10,000</option>
                </CFormSelect>
              </div>
            </CCol>
          </CRow>

          {/* ===================== 3. WATER HEIGHT + SCALE ===================== */}
          <CRow className="mb-3 align-items-center">
            {/* Water Height Address */}
            <CCol xs={12} md={7}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Water Height Address :</CFormLabel>
                <CFormSelect
                  name="water_h_address"
                  value={form.water_h_address}
                  onChange={handleChange}
                  required
                  disabled={form.probe_type_id == 3 || form.probe_type_id == 1}
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Address
                  </option>
                  <option value="-1">None</option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            {/* Water Scale */}
            <CCol xs={12} md={5}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Water Scale (mm) :</CFormLabel>
                <CFormSelect
                  name="water_h_scale"
                  value={form.water_h_scale}
                  onChange={handleChange}
                  disabled={form.water_h_address === '-1'}
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Scale
                  </option>
                  <option value="1">None (*1)</option>
                  <option value="0.0001">* 0.0001</option>
                  <option value="0.001">* 0.001</option>
                  <option value="0.01">* 0.01</option>
                  <option value="0.1">* 0.1</option>
                  <option value="10">* 10</option>
                  <option value="100">* 100</option>
                  <option value="1000">* 1,000</option>
                  <option value="10000">* 10,000</option>
                </CFormSelect>
              </div>
            </CCol>
          </CRow>

          {/* ===================== 4. TEMP ADDRESS + SCALE ===================== */}
          <CRow className="mb-3 align-items-center">
            {/* Temp Address */}
            <CCol xs={12} md={7}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Temp Address :</CFormLabel>
                <CFormSelect
                  name="temp_address"
                  value={form.temp_address}
                  onChange={handleChange}
                  required
                  disabled={form.probe_type_id == 3}
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Address
                  </option>
                  <option value="-1">None</option>
                  {[...Array(256).keys()].map((i) => (
                    <option key={i} value={i}>
                      {`0x${i.toString(16).padStart(4, '0')}`}
                    </option>
                  ))}
                </CFormSelect>
              </div>
            </CCol>

            {/* Temp Scale */}
            <CCol xs={12} md={5}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Temp Scale (°C) :</CFormLabel>
                <CFormSelect
                  name="temp_scale"
                  value={form.temp_scale}
                  onChange={handleChange}
                  disabled={form.temp_address === '-1'}
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Scale
                  </option>
                  <option value="1">None (*1)</option>
                  <option value="0.0001">* 0.0001</option>
                  <option value="0.001">* 0.001</option>
                  <option value="0.01">* 0.01</option>
                  <option value="0.1">* 0.1</option>
                  <option value="10">* 10</option>
                  <option value="100">* 100</option>
                  <option value="1000">* 1,000</option>
                  <option value="10000">* 10,000</option>
                </CFormSelect>
              </div>
            </CCol>
          </CRow>

          {/* ===================== 5. FUNCTION CODE + FORMAT ===================== */}
          <CRow className="mb-4 align-items-center">
            {/* Function Code */}
            <CCol xs={12} md={7}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Function Code :</CFormLabel>
                <CFormSelect
                  name="function_code"
                  value={form.function_code}
                  onChange={handleChange}
                  required
                  className="flex-grow-1"
                >
                  <option value="" disabled>
                    Select Function Code
                  </option>
                  <option value="03">03 - Read Holding Registers</option>
                  <option value="04">04 - Read Input Registers</option>
                </CFormSelect>
              </div>
            </CCol>

            {/* Format */}
            <CCol xs={12} md={5}>
              <div className="d-flex align-items-center">
                <CFormLabel className="fw-semibold mb-0 me-2 flex-shrink-0">Format :</CFormLabel>

                {form.address_length == 1 ? (
                  <CFormSelect value={'AB'} disabled className="flex-grow-1">
                    <option value="AB">AB</option>
                  </CFormSelect>
                ) : (
                  <CFormSelect
                    name="format"
                    value={form.format || ''}
                    onChange={handleChange}
                    required
                    className="flex-grow-1"
                  >
                    <option value="">Select format</option>
                    <option value="AB CD">AB CD</option>
                    <option value="CD AB">CD AB</option>
                    <option value="BA DC">BA DC</option>
                    <option value="DC BA">DC BA</option>
                  </CFormSelect>
                )}
              </div>
            </CCol>
          </CRow>

          <CModalFooter className="d-flex justify-content-end gap-2 flex-wrap">
            <CButton color="secondary" type="button" onClick={() => setVisible(false)}>
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

export default AddProbeModal
