import React, { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'

import server from '../../../server'
import { useLocation, useNavigate } from 'react-router-dom'
import MainContentLayout from '../../Layout/MainContentLayout'

import {
  InputFieldTemplate,
  MultiSelectTemplate,
} from '../../shared/FilterTemplates'

import ModifyMolecule from './ModifyMolecule'
import { Toast } from 'primereact/toast'
import { ToastPopUp } from '../../shared/utils'

export default function MoleculesTable() {
  const [molecules, setMolecules] = useState(null)
  const [selectedMolecule, setSelectedMolecule] = useState(null)
  const [totalRecords, setTotalRecords] = useState(0)
  const [tableLoading, setTableLoading] = useState(false)

  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [lazyState, setLazyState] = useState({ rows: 10, page: 0, first: 0 })

  const initLazyState = () => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        name: { value: '' },
        source: { value: '' },
        drugIdentificationNo: { value: '' },
      },
    }))
  }

  const navigate = useNavigate()

  const dt = useRef()
  const toast = useRef()
  const { state } = useLocation()
  const AddEditRef = useRef()
  const DeleteRef = useRef()
  const refs = { AddEditRef, DeleteRef }

  // Gets table data
  const getData = () => {
    const moleculeName = lazyState?.filters?.name.value
    const moleculeSource = lazyState?.filters?.source.value
    const drugIdentificationNo = lazyState?.filters?.drugIdentificationNo.value

    const requestParams =
      `?page=${lazyState?.page ? lazyState.page + 1 : 1}` +
      `&limit=${lazyState?.rows}` +
      `${
        drugIdentificationNo
          ? '&drugIdentificationNo=' + drugIdentificationNo
          : ''
      }` +
      `${moleculeName ? '&moleculeName=' + moleculeName : ''}` +
      `${
        moleculeSource
          ? moleculeSource.map((item) => `&source=${item.code}`).join('')
          : ''
      }` +
      `${lazyState?.sortField ? '&sortByField=' + lazyState.sortField : ''}` +
      `${lazyState?.sortOrder ? '&sortByOrder=' + lazyState.sortOrder : ''}`

    setTableLoading(true)

    server
      .get(`/molecules/${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        const molecules = response.data.molecules
        setMolecules(molecules)
        setTotalRecords(response.data.totalCount)
        setTableLoading(false)
        // setError(null)
      })
      .catch((error) => {
        setTableLoading(false)
        // setError(error.response.data.message)
      })
  }

  useEffect(() => {
    checkClearBtn()
    return getData()
  }, [lazyState])

  useEffect(() => initLazyState(), [])

  // Toast to show validation of deleted molecule ( delete action took place inside molecule History)
  useEffect(() => {
    state &&
      ToastPopUp(
        toast,
        'success',
        'Molecule Deleted',
        'Molecule has been Deleted successfully.'
      )
    window.history.replaceState({}, document.title)
  }, [state])

  // Handles table page change
  const onPage = (event) => {
    setLazyState(event)
  }

  // Handles table sorting
  const onSort = (event) => {
    setLazyState(event)
  }

  // Handles table filtring
  const onFilter = (event) => {
    setLazyState(event)
  }

  // Enable and disable clear button according to filtring and sorting
  const checkClearBtn = () => {
    if (lazyState?.sortField || lazyState?.sortOrder) {
      setClearBtnDisabled(false)
      return
    }
    for (const key in lazyState?.filters) {
      if (lazyState?.filters[key].value) {
        setClearBtnDisabled(false)
        return
      }
    }
    setClearBtnDisabled(true)
  }

  // Handles row selection action (redirect to molecule history table)
  const onRowSelect = (event) => {
    const molecule = molecules.find(
      (molecule) =>
        molecule.drugIdentificationNo === event.data.drugIdentificationNo
    )
    navigate(`/admin/reports/molecules/${event.data.drugIdentificationNo}`, {
      state: molecule,
    })
  }

  // Filter TEMPLATES
  const moleculeNameFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      placeholder='Molecule name'
    />
  )

  const moleculeSourceFilterElement = (options) => (
    <MultiSelectTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      placeholder='Molecule source'
      options={[
        { name: 'Single', code: 'single' },
        { name: 'Dual', code: 'dual' },
        { name: 'Multi', code: 'multi' },
      ]}
    />
  )

  const dinFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      placeholder='DIN'
    />
  )

  // (Edit - Delete) column body template
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <div className='d-flex justify-content-center gap-2'>
          <Button
            icon='pi pi-pencil'
            rounded
            outlined
            className='mr-2'
            onClick={() => AddEditRef.current.editMolecule(rowData)}
          />

          <Button
            icon='pi pi-trash'
            rounded
            outlined
            severity='danger'
            onClick={() => DeleteRef.current.confirmDeleteMolecule(rowData)}
          />
        </div>
      </React.Fragment>
    )
  }

  // Toolbar body templates
  const topLeftToolbarTemplate = () => {
    return (
      <div className='d-flex'>
        <Button
          type='button'
          icon='pi pi-filter-slash'
          label='Clear'
          outlined
          onClick={initLazyState}
          disabled={clearBtnDisabled}
        />
      </div>
    )
  }

  const topRightToolbarTemplate = () => {
    return (
      <div className='d-flex'>
        <Button
          label='New molecule'
          icon='pi pi-plus'
          severity='success'
          onClick={() => AddEditRef.current.openNew()}
        />
      </div>
    )
  }

  return (
    <>
      <div className='card flex justify-content-center'>
        <Toast ref={toast} />
      </div>

      <MainContentLayout title='Molecules' dt={dt}>
        <div className='card'>
          <Toolbar
            className='mb-2'
            left={topLeftToolbarTemplate}
            right={topRightToolbarTemplate}
          />

          <DataTable
            ref={dt}
            value={molecules}
            paginator
            lazy
            showGridlines
            removableSort
            rowsPerPageOptions={[5, 10, 25, 50]}
            totalRecords={totalRecords}
            loading={tableLoading}
            dataKey='drugIdentificationNo'
            globalFilterFields={['drugIdentificationNo', 'name', 'source']}
            selectionMode='single'
            onRowSelect={onRowSelect}
            selection={selectedMolecule}
            onSelectionChange={(e) => setSelectedMolecule(e.value)}
            emptyMessage='No molecules found.'
            filters={lazyState?.filters}
            sortField={lazyState?.sortField}
            sortOrder={lazyState?.sortOrder}
            rows={lazyState?.rows}
            first={lazyState?.first}
            onPage={onPage}
            onSort={onSort}
            onFilter={onFilter}
          >
            {/* <Column selectionMode='multiple' exportable={false}></Column> */}
            <Column
              field='drugIdentificationNo'
              header='Din'
              sortable
              style={{ minWidth: '16rem' }}
              filter
              filterElement={dinFilterElement}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            ></Column>
            <Column
              field='name'
              header='Name'
              sortable
              style={{ minWidth: '16rem' }}
              filterPlaceholder='Filter by Name'
              filter
              filterElement={moleculeNameFilterElement}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            ></Column>
            <Column
              field='source'
              header='Source Type'
              sortable
              style={{ minWidth: '12rem' }}
              filter
              filterElement={moleculeSourceFilterElement}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
            ></Column>
            <Column
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: '12rem' }}
            ></Column>
          </DataTable>

          <ModifyMolecule ref={refs} getData={getData} />
        </div>
      </MainContentLayout>
    </>
  )
}
