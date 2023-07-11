import React, { useState, useContext, useEffect, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { Container, Row, Col, Card, CardBody, Button, Label } from 'reactstrap'
import { AuthenticationContext } from '../../Auth/authentication.context'
import { ToastPopUp } from '../../components/shared/utils'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import server from '../../server'

const UserProfile = (props) => {
  const {
    user,
    isAdmin,
    toastStatus,
    onProfileUpdate,
    onChangePasswordProfile,
  } = useContext(AuthenticationContext)

  const toast = useRef(null)

  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState(user.displayName)
  const [editPharmacyName, setEditPharmacyName] = useState(user.pharmacyName)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  useEffect(() => {
    // console.log('toastStatus', toastStatus)
    if (toastStatus?.toastStatus) {
      ToastPopUp(toast, toastStatus?.toastStatus, toastStatus?.msg)
    }
  }, [toastStatus])

  const handlePasswordSubmit = () => {
    if (
      currentPassword !== '' &&
      newPassword !== '' &&
      confirmPassword !== ''
    ) {
      onChangePasswordProfile(
        currentPassword,
        newPassword,
        confirmPassword
      ).then(() => setEditMode(false))
    }
  }

  const handleEditSubmit = () => {
    if (editName !== '') {
      // console.log({ fullname: editName, PharmacyName: editPharmacyName })
      onProfileUpdate(editName, editPharmacyName)
    } else {
      ToastPopUp(toast, 'error', 'Please add display name')
    }
  }

  document.title = 'Profile | Speedball Hub'
  return (
    <React.Fragment>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      <div className='page-content'>
        <div className='container-fluid'>
          <div className='d-flex justify-content-between'>
            <h2 className='fs-3 fw-bold  mb-4'>Profile</h2>
            <div className='text-center '>
              <Button
                type='submit'
                color='primary'
                onClick={() => setEditMode((prevState) => !prevState)}
              >
                {editMode ? 'Back' : 'Edit Profile'}
              </Button>
            </div>
          </div>

          <Row>
            <Col lg='12'>
              <Card>
                <CardBody>
                  <div className='d-flex'>
                    <div className='align-self-center flex-1'>
                      <div className='text-muted'>
                        <h4 className='mb-2'>{user.displayName}</h4>
                        {isAdmin ? (
                          <h6 className='mb-1'>Admin</h6>
                        ) : (
                          <h6 className='mb-1'>Pharmacy</h6>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* ============================================================ */}
          {!editMode && (
            <Card>
              <CardBody>
                <div className='row row-cols-2'>
                  <div className='form-group col '>
                    <Label className='form-label'>Full Name</Label>
                    <p>{user.displayName}</p>
                  </div>
                  {!isAdmin && (
                    <div className='form-group col'>
                      <Label className='form-label mt-2'>Pharmacy Name</Label>
                      <p>{user.pharmacyName}</p>
                    </div>
                  )}
                  <div className='form-group col '>
                    <Label className='form-label mt-2'>Email</Label>
                    <p>{user.email}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* ============================================================ */}
          {editMode && (
            <div>
              <h4 className='card-title mb-4'>Edit Profile</h4>

              <Card>
                <CardBody>
                  <form className='row row-cols-2'>
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>Full Name</Label>
                      <input
                        name='fullName'
                        className='form-control'
                        value={editName}
                        type='text'
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>

                    {/* --------------------------- */}
                    {!isAdmin && (
                      <div className='form-group col'>
                        <Label className='form-label mt-3'>Pharmacy Name</Label>
                        <input
                          name='PharmacyName'
                          className='form-control'
                          value={editPharmacyName}
                          type='text'
                          onChange={(e) => {
                            setEditPharmacyName(e.target.value)
                          }}
                        />
                      </div>
                    )}
                    {/* --------------------------- */}
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>Email</Label>
                      <p>{user.email}</p>
                    </div>

                    <div className='text-center mt-4 d-flex justify-content-end gap-3 col-12'>
                      <Button
                        color=''
                        className='btn btn-outline-primary'
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        color='primary'
                        onClick={(e) => {
                          e.preventDefault()
                          handleEditSubmit()
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          )}
          {/* ============================================================ */}
          {editMode && (
            <div>
              <h4 className='card-title mb-4'>Change Password</h4>

              <Card>
                <CardBody>
                  <form className='row row-cols-2'>
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>
                        Current Password
                      </Label>
                      <input
                        name='currnetPassword'
                        className='form-control'
                        placeholder='Enter current password'
                        type='password'
                        onBlur={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>

                    {/* --------------------------- */}
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>New Password</Label>
                      <input
                        name='newPassword'
                        className='form-control'
                        placeholder='Enter new password'
                        type='password'
                        onBlur={(e) => {
                          setNewPassword(e.target.value)
                        }}
                      />
                    </div>
                    {/* --------------------------- */}
                    <div className='form-group col'>
                      <Label className='form-label mt-3'>
                        Confirm Password
                      </Label>
                      <input
                        name='confirmPassword'
                        className='form-control'
                        placeholder='Confirm Password'
                        type='password'
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                        }}
                      />
                    </div>

                    <div className='text-center mt-4 d-flex justify-content-end gap-3 col-12'>
                      <Button
                        color=''
                        className='btn btn-outline-primary'
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type='submit'
                        color='primary'
                        onClick={(e) => {
                          e.preventDefault()
                          handlePasswordSubmit()
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                </CardBody>
              </Card>
            </div>
          )}
          {!isAdmin && (
            <div>
              <h4 className='card-title mb-4'>Suppliers</h4>
              <Card>
                <CardBody>
                  <DataTable
                    value={user?.accounts}
                    dataKey='supplierId'
                    removableSort
                    // loading={tableLoading}
                    selectionMode='single'
                    // onRowSelect={onRowSelect}
                    // selection={selectedMolecule}
                    // onSelectionChange={(e) => setSelectedMolecule(e.value)}
                    emptyMessage='No Suppliers found.'
                  >
                    <Column
                      field='supplierName'
                      header='Supplier Name'
                      sortable
                    />
                    <Column
                      field='customerAccountCode'
                      header='Customer Account Code'
                      sortable
                    />
                  </DataTable>
                </CardBody>
              </Card>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default UserProfile
