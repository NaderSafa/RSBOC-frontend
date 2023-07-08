import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'

import MainContentLayout from '../../Layout/MainContentLayout'
import { formatDate, formatPercentage } from '../../shared/utils'
import server from '../../../server'
import {
  SingleDateFilterTemplate,
  InputFieldTemplate,
} from '../../shared/FilterTemplates'

// //theme
import 'primereact/resources/themes/lara-light-indigo/theme.css'
// //core
import 'primereact/resources/primereact.min.css'
// //icons
import 'primeicons/primeicons.css'
import ModifyMolecule from './ModifyMolecule'

export default function MoleculeHistory() {
  let emptyMolecule = {
    name: '',
    source: '',
    drugIdentificationNo: null,
    paPercentage: null,
    startDate: null,
  }

  const [moleculeHistory, setMoleculeHistory] = useState()
  const [tableLoading, setTableLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)

  const [molecule, setMolecule] = useState(emptyMolecule)

  const [lazyState, setLazyState] = useState({ rows: 10, page: 0, first: 0 })

  const dt = useRef()
  const AddEditRef = useRef()
  const DeleteRef = useRef()
  const refs = { AddEditRef, DeleteRef }
  const { state } = useLocation()
  const { din } = useParams()

  const initLazyState = () => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        paPercentage: {
          operator: 'and',
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        startDate: { value: '' },
        endDate: { value: '' },
      },
    }))
  }

  const getData = () => {
    const startDate = lazyState?.filters?.startDate.value
    const endDate = lazyState?.filters?.endDate.value
    const paPercentageMin =
      lazyState?.filters?.paPercentage?.constraints[0]?.value
    const paPercentageMax =
      lazyState?.filters?.paPercentage?.constraints[1]?.value

    const requestParams =
      `?page=${Number(lazyState?.page) + 1}` +
      `&limit=${lazyState?.rows}` +
      `${paPercentageMin ? '&greaterThanPaRate=' + paPercentageMin : ''}` +
      `${paPercentageMax ? '&lessThanPaRate=' + paPercentageMax : ''}` +
      `${startDate ? '&startDate=' + startDate : ''}` +
      `${endDate ? '&endDate=' + endDate : ''}` +
      `${lazyState?.sortField ? '&sortByField=' + lazyState.sortField : ''}` +
      `${lazyState?.sortOrder ? '&sortByOrder=' + lazyState.sortOrder : ''}`

    setTableLoading(true)

    server
      .get(`/molecules/history/${din}${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        const moleculeHistory = response.data.molecules
        setMoleculeHistory(moleculeHistory)
        setTotalRecords(response.data.totalCount)
        setTableLoading(false)
        // setError(null)
        setMolecule({
          ...molecule,
          name: response.data.moleculeName,
          source: response.data.moleculeSource,
          drugIdentificationNo: response.data.molecules[0].drugIdentificationNo,
        })
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

  const onPage = (event) => {
    setLazyState(event)
  }

  const onSort = (event) => {
    setLazyState(event)
  }

  const onFilter = (event) => {
    setLazyState(event)
  }

  // BODY TEMPLATES
  const startDateBodyTemplate = (order) => formatDate(order.startDate)
  const paPercentageBodyTemplate = (order) =>
    formatPercentage(order.paPercentage)
  const endDateBodyTemplate = (order) => formatDate(order.endDate)

  // Filter TEMPLATES
  const paPercentageFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-percent-outline'
      type='number'
    />
  )

  const startDateFilterElement = (options) => (
    <SingleDateFilterTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e.value, options.index)}
    />
  )

  const endDateFilterElement = (options) => (
    <SingleDateFilterTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e.value, options.index)}
    />
  )

  const checkClearBtn = () => {
    if (lazyState?.sortField || lazyState?.sortOrder) {
      setClearBtnDisabled(false)
      return
    }
    for (const filterKey in lazyState?.filters) {
      const constraints = lazyState?.filters[filterKey].constraints
      for (const constraintKey in constraints) {
        if (constraints[constraintKey].value) {
          setClearBtnDisabled(false)
          return
        }
      }
      if (lazyState?.filters[filterKey]?.value) {
        setClearBtnDisabled(false)
        return
      }
    }

    setClearBtnDisabled(true)
  }

  // TOOLBARS
  const leftToolbarTemplate = () => (
    <Button
      type='button'
      icon='pi pi-filter-slash'
      label='Clear'
      outlined
      onClick={initLazyState}
      disabled={clearBtnDisabled}
    />
  )

  const topRightToolbarTemplate = () => {
    return (
      <div className='d-flex gap-2'>
        <Button
          label='Edit'
          icon='pi pi-pencil'
          severity='success'
          onClick={() => AddEditRef.current.editMolecule(molecule)}
        />
        <Button
          label='Delete'
          icon='pi pi-trash'
          severity='danger'
          onClick={() => DeleteRef.current.confirmDeleteMolecule(molecule)}
        />
      </div>
    )
  }

  return (
    <MainContentLayout title={`Molecule History (${molecule.name})`} dt={dt}>
      <Toolbar
        className='mb-2'
        left={leftToolbarTemplate}
        right={topRightToolbarTemplate}
      />
      <DataTable
        ref={dt}
        lazy
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRecords={totalRecords}
        paginator
        value={moleculeHistory}
        dataKey='id'
        tableStyle={{ minWidth: '50rem' }}
        loading={tableLoading}
        filters={lazyState?.filters}
        sortField={lazyState?.sortField}
        sortOrder={lazyState?.sortOrder}
        rows={lazyState?.rows}
        first={lazyState?.first}
        onPage={onPage}
        onSort={onSort}
        onFilter={onFilter}
        removableSort
        showGridlines
      >
        <Column field='drugIdentificationNo' header='DIN' />
        <Column
          field='paPercentage'
          header='PA Percentage'
          body={paPercentageBodyTemplate}
          sortable
          filter
          filterElement={paPercentageFilterElement}
          showFilterMenuOptions={false}
          showFilterOperator={false}
          showAddButton={false}
        />
        <Column
          field='startDate'
          header='Start Date'
          body={startDateBodyTemplate}
          sortable
          dataType='date'
          filter
          filterElement={startDateFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          field='endDate'
          header='End Date'
          body={endDateBodyTemplate}
          sortable
          filter
          filterElement={endDateFilterElement}
          showFilterMenuOptions={false}
          showFilterOperator={false}
          showAddButton={false}
        />
      </DataTable>

      <ModifyMolecule ref={refs} getData={getData} />
    </MainContentLayout>
  )
}
