import React, { useState, useContext, useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast'
import server from '../../server'
import '../../scss/custom/components/pharmacy-profile.scss'
import { Container, Row, Col, Card, CardBody, Label } from 'reactstrap'
import { AuthenticationContext } from '../../Auth/authentication.context'
import { useLocation, useParams } from 'react-router-dom'
import { ToastPopUp } from '../../components/shared/utils'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toolbar } from 'primereact/toolbar'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import {
  DropDownTemplate,
  InputFieldTemplate,
} from '../../components/shared/FilterTemplates'

const PharmacyProfile = (props) => {
  document.title = 'Profile | Speedball Hub'

  const { isAdmin, toastStatus } = useContext(AuthenticationContext)
  const toast = useRef(null)
  const { pharmacyId } = useParams()
  const { state } = useLocation()

  const [user, setUser] = useState()
  const [tableLoading, setTableLoading] = useState()
  const [addedSupplier, setAddedSupplier] = useState({})
  const [moleculeDialog, setMoleculeDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const suppliersList = [{ name: 'K+F', code: 1 }]
  const userId = state.id

  const addSupplier = () => {
    if (addedSupplier?.supplier?.code && addedSupplier?.customerAccountCode) {
      server
        .patch(
          `/admins/pharmacy/${parseInt(pharmacyId)}`,
          {
            supplierId: addedSupplier.supplier.code,
            customerAccountCode: addedSupplier.customerAccountCode,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        )
        .then((response) => {
          ToastPopUp(
            toast,
            'success',
            'Account Updated Successfully',
            `supplier account with id ${addedSupplier.customerAccountCode} for ${addedSupplier.supplier.name} is successfully attached to current pharmacy`
          )
          getUserData()
          hideDialog()
        })
        .catch((e) => {
          if (e.response.status === 400) {
            ToastPopUp(
              toast,
              'error',
              'Error Adding Supplier',
              e.response.data.message
            )
          }
        })
    } else {
      setSubmitted(true)
    }
  }

  const getUserData = () => {
    setTableLoading(true)
    server
      .get(`/users/get-users?id=${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        const userData = response.data.users[0]
        // console.log('userData', userData)
        setUser(userData)
        setTableLoading(false)
        // setError(null)
      })
      .catch((error) => {
        console.log('error', error)
        setTableLoading(false)
        // setError(error.response.data.message)
      })
  }

  useEffect(() => {
    if (toastStatus.toastStatus !== undefined) {
      ToastPopUp(toast, toastStatus?.toastStatus, toastStatus?.msg)
    }
  }, [toastStatus])

  useEffect(() => getUserData(), [])

  const hideDialog = () => {
    setSubmitted(false)
    setMoleculeDialog(false)
  }

  const moleculeDialgeFooter = (
    <React.Fragment>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button label='Add Supplier' icon='pi pi-check' onClick={addSupplier} />
    </React.Fragment>
  )

  const openNew = () => {
    setAddedSupplier(null)
    setSubmitted(false)
    setMoleculeDialog(true)
  }

  const topRightToolbarTemplate = () => {
    return (
      <div className='d-flex gap-2'>
        <Button
          label='New Supplier'
          icon='pi pi-plus'
          severity='success'
          onClick={openNew}
        />
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      <div className='page-content'>
        <Container fluid>
          <Row>
            <Col lg='12'>
              <Card>
                <CardBody>
                  <div className='d-flex'>
                    <div className='align-self-center flex-1'>
                      <div className='text-muted'>
                        <h4 className='mb-2'>{user?.displayName}</h4>
                        <h6 className='mb-1'>Pharmacy</h6>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Card>
            <CardBody>
              <div className='row row-cols-2'>
                <div className='form-group col '>
                  <Label className='form-label'>Full Name</Label>
                  <p>{user?.displayName}</p>
                </div>
                <div className='form-group col'>
                  <Label className='form-label mt-2'>Pharmacy Name</Label>
                  <p>{user?.pharmacyName}</p>
                </div>
                <div className='form-group col '>
                  <Label className='form-label mt-2'>Email</Label>
                  <p>{user?.email}</p>
                </div>
              </div>
              <div className='col col-sm-6  col-lg-4 mt-3 '></div>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <Toolbar className='mb-2' right={topRightToolbarTemplate} />
              <DataTable
                value={user?.accounts}
                dataKey='supplierId'
                removableSort
                loading={tableLoading}
                selectionMode='single'
                emptyMessage='No Suppliers found.'
              >
                <Column field='supplierName' header='Supplier Name' sortable />
                <Column
                  field='customerAccountCode'
                  header='Customer Account Code'
                  sortable
                />
              </DataTable>

              <Dialog
                visible={moleculeDialog}
                style={{ width: '32rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header='Add New Molecule'
                modal
                className='p-fluid'
                footer={moleculeDialgeFooter}
                onHide={hideDialog}
              >
                <div className='field mt-4'>
                  <label htmlFor='supplierName' className='font-bold'>
                    Supplier Name
                  </label>
                  <DropDownTemplate
                    id='supplierName'
                    options={suppliersList}
                    state={addedSupplier?.supplier}
                    stateHandler={(e) =>
                      setAddedSupplier((prevState) => {
                        return { ...prevState, supplier: e.value }
                      })
                    }
                  />
                  {submitted && !addedSupplier?.supplier && (
                    <small className='p-error'>
                      Supplier name is required.
                    </small>
                  )}
                </div>
                {
                  <div className='field mt-4'>
                    <label htmlFor='customerCode' className='font-bold'>
                      CustomerAccountCode
                    </label>
                    <InputFieldTemplate
                      id='customerCode'
                      state={
                        addedSupplier?.customerAccountCode
                          ? addedSupplier?.customerAccountCode
                          : ''
                      }
                      stateHandler={(e) =>
                        setAddedSupplier((prevState) => {
                          return { ...prevState, customerAccountCode: e }
                        })
                      }
                      placeholder='Customer account code'
                      required
                    />
                    {submitted && !addedSupplier?.customerAccountCode && (
                      <small className='p-error'>
                        Customer account code is required.
                      </small>
                    )}
                  </div>
                }
              </Dialog>
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PharmacyProfile
