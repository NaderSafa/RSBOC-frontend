import React from 'react'

import { Dialog } from 'primereact/dialog'

const DeleteModal = (props) => {
  return (
    <>
      <Dialog
        visible={props.state}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header='Confirm'
        modal
        footer={props.footer}
        onHide={props.onHide}
      >
        <div className='d-flex gap-2 confirmation-content'>
          <i
            className='pi pi-exclamation-triangle mr-5'
            style={{ fontSize: '25px' }}
          />
          {props.deletedItem && (
            <span>
              Are you sure you want to delete <b>"{props.name}"</b>?
            </span>
          )}
        </div>
      </Dialog>
    </>
  )
}

export default DeleteModal
