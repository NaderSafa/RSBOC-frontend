import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'

import { classNames } from 'primereact/utils'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { InputNumber } from 'primereact/inputnumber'
import { Toast } from 'primereact/toast'

import server from '../../../server'

import { ToastPopUp } from '../../shared/utils'
import { formatDate } from '../../shared/utils'

const AddEditMolecule = forwardRef((props, ref) => {
  const { AddEditRef } = ref
  const { molecule, setMolecule, emptyMolecule } = props
  const [moleculeDialog, setMoleculeDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [isMoleculeEdit, setIsMoleculeEdit] = useState(false)

  const toast = useRef(null)

  useImperativeHandle(AddEditRef, () => ({
    openNew() {
      setSubmitted(false)
      setMoleculeDialog(true)
      setMolecule(emptyMolecule)
    },

    editMolecule(molecule) {
      setSubmitted(false)
      setIsMoleculeEdit(true)
      setMolecule({ ...molecule })
      setMoleculeDialog(true)
    },
  }))

  const hideDialog = () => {
    setMoleculeDialog(false)
    setIsMoleculeEdit(false)
  }

  // Listens to changes inside Diloge modal
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || ''
    let _molecule = { ...molecule }

    _molecule[`${name}`] = val

    setMolecule(_molecule)
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0
    let _molecule = { ...molecule }

    _molecule[`${name}`] = val

    setMolecule(_molecule)
  }

  // Handles saving new molecule and editing it
  const saveMolecule = () => {
    if (
      molecule.name.trim() &&
      molecule.drugIdentificationNo &&
      molecule.source &&
      molecule.paPercentage &&
      molecule.startDate
    ) {
      const _molecule = {
        ...molecule,
        startDate: formatDate(molecule.startDate),
      }

      server
        .post('/molecules/', _molecule, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((response) => {
          props.getData()
          if (isMoleculeEdit) {
            ToastPopUp(
              toast,
              'success',
              'Molecule Updated',
              'Molecule has been Updated successfully.'
            )
          } else {
            ToastPopUp(
              toast,
              'success',
              'Molecule Added',
              'Molecule has been added successfully.'
            )
          }
          setIsMoleculeEdit(false)
          setSubmitted(true)
        })
        .catch((e) => {
          ToastPopUp(toast, 'error', 'Error', e.response.data.message)
          setIsMoleculeEdit(false)
          setSubmitted(true)
        })

      setMoleculeDialog(false)
      setMolecule(emptyMolecule)
    } else {
      setSubmitted(true)
    }
  }

  //  Dialog footers
  const moleculeDialgeFooter = (
    <React.Fragment>
      <Button label='Cancel' icon='pi pi-times' outlined onClick={hideDialog} />
      <Button
        label={isMoleculeEdit ? 'Update Molecule' : 'Add New Molecule'}
        icon='pi pi-check'
        onClick={saveMolecule}
      />
    </React.Fragment>
  )

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>
      {/* dialog for creation and edit molecule */}
      <Dialog
        visible={moleculeDialog}
        style={{ width: '32rem' }}
        breakpoints={{ '960px': '75vw', '641px': '90vw' }}
        header={isMoleculeEdit ? 'Update Molecule' : 'Add New Molecule'}
        modal
        className='p-fluid'
        footer={moleculeDialgeFooter}
        onHide={hideDialog}
      >
        <div className='field'>
          <label htmlFor='drugIdentificationNo' className='font-bold'>
            Molecule DIN
          </label>
          <InputNumber
            id='drugIdentificationNo'
            value={molecule.drugIdentificationNo}
            autoFocus
            onChange={(e) => {
              onInputNumberChange(e, 'drugIdentificationNo')
            }}
            useGrouping={false}
            placeholder='Type DIN'
            className={classNames(
              `w-full md:w-14rem ${isMoleculeEdit && 'disabledInput'}`
            )}
            readOnly={isMoleculeEdit ? true : false}
          />
          {submitted && !molecule.drugIdentificationNo && (
            <small className='p-error'>Din is required.</small>
          )}
        </div>
        <div className='field mt-4'>
          <label htmlFor='moleculeName' className='font-bold'>
            Molecule Name
          </label>
          <InputText
            id='name'
            value={molecule.name}
            onChange={(e) => onInputChange(e, 'name')}
            placeholder='Type Molecule Name'
            required
            readOnly={isMoleculeEdit ? true : false}
            className={classNames(
              `w-full md:w-14rem ${isMoleculeEdit && 'disabledInput'}`
            )}
          />
          {submitted && !molecule.name && (
            <small className='p-error'>Name is required.</small>
          )}
        </div>
        <div className='field mt-4'>
          <label htmlFor='source' className='font-bold'>
            Molecule Source Type
          </label>
          <Dropdown
            id='source'
            value={molecule.source}
            onChange={(e) => {
              onInputChange(e, 'source')
            }}
            options={[
              { label: 'Single', value: 'single' },
              { label: 'Dual', value: 'dual' },
              { label: 'Multi', value: 'multi' },
            ]}
            optionLabel='label'
            placeholder='Select Source Type'
            // className='w-full md:w-14rem'
            readOnly={isMoleculeEdit ? true : false}
            className={classNames(
              `w-full md:w-14rem ${isMoleculeEdit && 'disabledInput'}`
            )}
          />
          {submitted && !molecule.source && (
            <small className='p-error'>Source type is required.</small>
          )}
        </div>
        <div className='field mt-4'>
          <label htmlFor='paPercentage' className='font-bold'>
            Molecule PA %
          </label>
          <InputNumber
            id='paPercentage'
            value={molecule.paPercentage}
            onChange={(e) => {
              onInputNumberChange(e, 'paPercentage')
            }}
            placeholder='Type PA %'
            className='w-full md:w-14rem'
          />
          {submitted && !molecule.paPercentage && (
            <small className='p-error'>PA is required.</small>
          )}
        </div>
        <div className='field mt-4'>
          <label htmlFor='startDate' className='font-bold'>
            Start Date
          </label>
          <Calendar
            id='startDate'
            value={molecule.startDate}
            onChange={(e) => onInputChange(e, 'startDate')}
            dateFormat='yy-mm-dd'
            placeholder='yy-mm-dd'
            mask='99/99/99'
            showIcon
            showButtonBar
            minDate={new Date()}
          />
          {submitted && !molecule.startDate && (
            <small className='p-error'>Start Date is required.</small>
          )}
        </div>
      </Dialog>
    </>
  )
})

export default AddEditMolecule
