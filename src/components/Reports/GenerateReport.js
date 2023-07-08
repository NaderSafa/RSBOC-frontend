import React, { useEffect, useState } from 'react'
import { DateFilterTemplate } from '../shared/FilterTemplates'
import { formatDate } from '../shared/utils'
import { MultiSelect } from 'primereact/multiselect'
import server from '../../server'
import { useFormik } from 'formik'

// import Multiselect from 'multiselect-react-dropdown'
import { Row, Col, Card, CardBody, Button, Label } from 'reactstrap'
const GenerateReport = () => {
  const [selectedPharmacies, setSelectedPharmacies] = useState(null)
  const [selectedRadio, setSelectedRadio] = useState('Molecule')
  const [dates, setDates] = useState([])
  const [users, setUsers] = useState([])

  //Get Pharmacies data
  useEffect(() => {
    server
      .get(`/users/get-users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users)
      })
      .catch((error) => {
        console.log('error', error)
      })
  }, [])

  let handleSubmit = () => {
    if (selectedRadio !== '' && dates !== [] && selectedPharmacies !== null) {
      let startDate = formatDate(dates[0])
      let endDate = formatDate(dates[1])

      //     server
      //     .get(`/molecules/generate-report/?startDate=${startDate}&endDate=${endDate}&supplierId=1&customerAccountCode=7049`, {
      //       headers: {
      //         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      //       },
      //     })
      //     .then((response) => {
      //       setUsers(response.data.users)
      //     })
      //     .catch((error) => {
      //       console.log('error', error)
      //     })
      // }, [])

      console.log({ selectedRadio, startDate, endDate, selectedPharmacies })
    }
  }

  // const validation = useFormik({
  //   initialValues: {
  //     selectedRadio: { selectedRadio },
  //     startDate: { startDate },
  //     endDate: { endDate },
  //     selectedPharmacies: { selectedPharmacies },
  //   },
  //   enableReinitialize: false,
  //   onSubmit: (values) => {
  //     console.log(
  //       values.selectedRadio,
  //       values.startDate,
  //       values.endDate,
  //       values.Pharmacies
  //     )
  //   },
  // })

  const panelFooterTemplate = () => {
    const length = selectedPharmacies ? selectedPharmacies.length : 0

    return (
      <div className='py-2 px-3'>
        <b>{length}</b> item{length > 1 ? 's' : ''} selected.
      </div>
    )
  }

  const Pharmaciesdata = users
    .filter((item) => item.role === 'pharmacy')
    ?.map((user) => {
      return { key: user.id, name: user.displayName, id: user.id }
    })

  const Pharmacies = Pharmaciesdata

  const handleRadioChange = (event) => {
    setSelectedRadio(event.target.value)
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <div className='container-fluid'>
          <h2 className='fs-3 fw-bold mt-4 mb-4'>Generate Report</h2>

          <Row>
            <Col className='col-12'>
              <Card>
                <CardBody>
                  <form
                    className='row'
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit()
                      return false
                    }}
                  >
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>Report Name</Label>

                      <div className='d-flex gap-3'>
                        <label>
                          <input
                            type='radio'
                            value='Molecule'
                            checked={selectedRadio === 'Molecule'}
                            onChange={handleRadioChange}
                          />
                          Molecule
                        </label>
                        <label>
                          <input
                            type='radio'
                            value='manofactor'
                            checked={selectedRadio === 'manofactor'}
                            onChange={handleRadioChange}
                          />
                          manofactor
                        </label>
                      </div>
                    </div>
                    <div>
                      <Label className='form-label mt-3 d-block'>
                        Date Range
                      </Label>

                      <DateFilterTemplate
                        state={dates}
                        stateHandler={setDates}
                      />
                    </div>
                    <div className=''>
                      <Label className='form-label mt-3 d-block'>
                        Pharmacies
                      </Label>

                      <MultiSelect
                        value={selectedPharmacies}
                        onChange={(e) => {
                          setSelectedPharmacies(e.value)
                          console.log(e)
                        }}
                        options={Pharmacies}
                        optionLabel='name'
                        display='chip'
                        placeholder='Select Pharmacy'
                        panelFooterTemplate={panelFooterTemplate}
                        maxSelectedLabels={3}
                        dataKey='key'
                      />
                    </div>
                    <div className='text-center mt-4 d-flex justify-content-end gap-3 col-12'>
                      <Button type='submit' color='primary'>
                        Generate Report
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default GenerateReport
