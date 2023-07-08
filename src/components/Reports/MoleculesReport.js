import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'

import MainContentLayout from '../Layout/MainContentLayout'
import { formatCurrency, formatDate, formatPercentage } from '../shared/utils'
import server from '../../server'
import {
  DateFilterTemplate,
  InputFieldTemplate,
  MinMaxTemplate,
  MultiSelectTemplate,
} from '../shared/FilterTemplates'

// //theme
import 'primereact/resources/themes/lara-light-indigo/theme.css'
// //core
import 'primereact/resources/primereact.min.css'
// //icons
import 'primeicons/primeicons.css'

export default function MoleculesReport() {
  const dt = useRef()

  const [orders, setOrders] = useState()
  const [tableLoading, setTableLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [dates, setDates] = useState(null)

  const navigate = useNavigate()

  const [lazyState, setLazyState] = useState({ rows: 10, page: 0, first: 0 })

  const initLazyState = () => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        'molecule.name': { value: '' },
        'molecule.source': { value: '' },
        drugIdentificationNo: { value: '' },
        totalExtendedPrice: { value: '' },
        totalRefundedAmount: { value: '' },
        averagePa: { value: '' },
      },
    }))
  }

  const onRowSelect = (event) => {
    // console.log(`Selected: ${event.data.orderNumber}`)
    const order = orders.find(
      (item) => item.drugIdentificationNo === event.data.drugIdentificationNo
    )
    navigate(`${event.data.drugIdentificationNo}`, { state: order })
  }

  const getData = () => {
    let startDate
    let endDate
    const currentDate = new Date()

    // const dates = lazyState?.filters?.averagePa.value
    // const totalAmount = lazyState?.filters?.totalRefundedAmount.value
    const moleculeName = lazyState?.filters?.['molecule.name'].value
    // const paAmount = lazyState?.filters?.totalExtendedPrice.value
    const moleculeSource = lazyState?.filters?.['molecule.source'].value
    const drugIdentificationNo = lazyState?.filters?.drugIdentificationNo.value

    if (dates) {
      startDate = dates[0]
      endDate = dates[1] ? dates[1] : currentDate
    } else {
      startDate = new Date(currentDate.getFullYear(), 0, 1)
      endDate = currentDate
      setDates([startDate, endDate])
    }

    const requestParams =
      `?startDate=${formatDate(startDate)}&endDate=${formatDate(endDate)}` +
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
      .get(`/molecules/generate-report/${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        const molecules = response.data.molecules
        setOrders(molecules)
        setTotalRecords(response.data.totalCount)
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
    // console.log('lazyState', lazyState)
    checkClearBtn()
    return getData()
  }, [lazyState, dates])

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
  const totalRefundedAmountBodyTemplate = (molecule) =>
    formatCurrency(molecule.totalRefundedAmount)
  const averagePaBodyTemplate = (molecule) =>
    formatPercentage(molecule.averagePa)
  const totalExtendedPriceBodyTemplate = (molecule) =>
    formatCurrency(molecule.totalExtendedPrice)

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

  // TOOLBARS
  const topRightToolbarTemplate = () => (
    <>
      <DateFilterTemplate
        state={dates}
        stateHandler={(e) => {
          return setDates(e.value)
        }}
      />
    </>
  )

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

  return (
    <MainContentLayout title='Molecules Report' dt={dt}>
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
        value={orders}
        selectionMode='single'
        selection={selectedOrder}
        onSelectionChange={(e) => setSelectedOrder(e.value)}
        dataKey='drugIdentificationNo'
        onRowSelect={onRowSelect}
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
        emptyMessage='No molecules found in the selected data range'
      >
        <Column
          field='molecule.name'
          header='Molecule Name'
          filter
          filterElement={moleculeNameFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          field='molecule.source'
          header='Molecule Source'
          filter
          filterElement={moleculeSourceFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          field='drugIdentificationNo'
          header='DIN'
          filter
          filterElement={dinFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          field='totalExtendedPrice'
          header='Total Extended Price'
          body={totalExtendedPriceBodyTemplate}
          sortable
        />
        <Column
          field='totalRefundedAmount'
          header='Order Refunded Amount'
          body={totalRefundedAmountBodyTemplate}
          sortable
        />
        <Column
          field='averagePa'
          header='Average PA Percentage'
          body={averagePaBodyTemplate}
          sortable
        />
      </DataTable>
    </MainContentLayout>
  )
}
