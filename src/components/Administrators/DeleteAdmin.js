import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'

import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import { useNavigate, useParams } from 'react-router'
import DeleteModal from '../shared/DeleteModal'
import { ToastPopUp } from '../shared/utils'
import server from '../../server'

const DeleteAdmin = forwardRef((props, ref) => {
  const { admin, setAdmin, emptyAdmin } = props
  const [deleteAdminDialog, setDeleteAdminDialog] = useState(false)

  const toast = useRef(null)

  // Opens Delete Dialog Modal
  useImperativeHandle(ref, () => ({
    confirmDeleteAdmin(admin) {
      console.log(admin)
      setAdmin(admin)
      setDeleteAdminDialog(true)
    },
  }))

  // Closes Delete Dialog Modal
  const hideDeleteAdminDialog = () => {
    setDeleteAdminDialog(false)
  }

  // Handels Delete Admin
  const deleteAdmin = () => {
    server
      .delete(`/admins/${admin.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        props.getData()
        ToastPopUp(
          toast,
          'success',
          'Admin Deleted',
          'Admin has been Deleted successfully.'
        )
      })
      .catch((e) => {
        ToastPopUp(toast, 'error', 'Error', e.response.data.message)
      })

    setDeleteAdminDialog(false)
    setAdmin(emptyAdmin)
  }

  // Confirm Delete yes or no template
  const deleteAdminDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteAdminDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteAdmin}
      />
    </React.Fragment>
  )

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      {/* delete admin dialoge */}
      <DeleteModal
        state={deleteAdminDialog}
        footer={deleteAdminDialogFooter}
        onHide={hideDeleteAdminDialog}
        deletedItem={admin}
        name={admin.displayName}
      />
    </>
  )
})

export default DeleteAdmin
