import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import server from '../../../server'

import { ToastPopUp } from '../../shared/utils'
import { useNavigate, useParams } from 'react-router'
import DeleteModal from '../../shared/DeleteModal'

const DeleteMolecule = forwardRef((props, ref) => {
  const { molecule, setMolecule, emptyMolecule } = props
  const [deleteMoleculeDialog, setDeleteMoleculeDialog] = useState(false)

  const toast = useRef(null)
  const { DeleteRef } = ref

  const { din: paramDin } = useParams()
  const navigate = useNavigate()

  // Opens Delete Dialog Modal
  useImperativeHandle(DeleteRef, () => ({
    confirmDeleteMolecule(molecule) {
      setMolecule(molecule)
      setDeleteMoleculeDialog(true)
    },
  }))

  // Closes Delete Dialog Modal
  const hideDeleteMoleculeDialog = () => {
    setDeleteMoleculeDialog(false)
  }

  // Handels Delete Molecule
  const deleteMolecule = () => {
    let din = molecule.drugIdentificationNo

    server
      .delete(`/molecules/${din}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        paramDin
          ? navigate('/admin/molecules', { state: molecule })
          : props.getData()
        ToastPopUp(
          toast,
          'success',
          'Molecule Deleted',
          'Molecule has been Deleted successfully.'
        )
      })
      .catch((e) => {
        ToastPopUp(toast, 'error', 'Error', e.response.data.message)
      })

    setDeleteMoleculeDialog(false)
    setMolecule(emptyMolecule)
  }

  // Confirm Delete yes or no template
  const deleteMoleculeDialogFooter = (
    <React.Fragment>
      <Button
        label='No'
        icon='pi pi-times'
        outlined
        onClick={hideDeleteMoleculeDialog}
      />
      <Button
        label='Yes'
        icon='pi pi-check'
        severity='danger'
        onClick={deleteMolecule}
      />
    </React.Fragment>
  )

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      {/* delete molecule dialoge */}
      {/* <Dialog
        visible={deleteMoleculeDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={deleteMoleculeDialogFooter}
        onHide={hideDeleteMoleculeDialog}
      >
        <div className='d-flex gap-2 confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-5'
            style={{ fontSize: '25px' }}
          />
          {molecule && (
            <span>
              Are you sure you want to delete <b>"{molecule.name}"</b>?
            </span>
          )}
        </div>
      </Dialog> */}

      <DeleteModal
        state={deleteMoleculeDialog}
        footer={deleteMoleculeDialogFooter}
        onHide={hideDeleteMoleculeDialog}
        deletedItem={molecule}
        name={molecule.name}
      />
    </>
  )
})

export default DeleteMolecule
