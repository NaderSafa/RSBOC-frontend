import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Row } from 'primereact/row'
import { Toolbar } from 'primereact/toolbar'

import MainContentLayout from '../Layout/MainContentLayout'
import server from '../../server'
import {
  DateFilterTemplate,
  DropDownTemplate,
  InputFieldTemplate,
  MinMaxTemplate,
} from '../shared/FilterTemplates'
import { formatCurrency, formatDate, formatPercentage } from '../shared/utils'

//theme
import 'primereact/resources/themes/lara-light-indigo/theme.css'
//core
import 'primereact/resources/primereact.min.css'
//icons
import 'primeicons/primeicons.css'

export default function AdminOrders() {
  const dt = useRef(null)

  const [orders, setOrders] = useState()
  const [tableLoading, setTableLoading] = useState(true)
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)

  const navigate = useNavigate()

  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })

  const initLazyState = () => {
    setLazyState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        customerAccountCode: { value: '' },
        customer: { value: '' },
        'supplier.name': { value: '' },
        supplierInvoiceNo: { value: '' },
        totalInvoicePa: { value: '' },
        totalInvoiceAmount: { value: '' },
        totalInvoicePaPercentage: { value: '' },
        orderDate: { value: '' },
      },
    }))
  }

  const onRowSelect = (event) => {
    // console.log(`Selected: ${event.data.orderNumber}`)
    const order = orders.find(
      (item) => item.supplierInvoiceNo === event.data.supplierInvoiceNo
    )
    navigate(`${event.data.supplierOrderNo}`, { state: order })
  }

  const getData = () => {
    let startDate
    let endDate
    const dates = lazyState?.filters?.orderDate.value
    const totalAmount = lazyState?.filters?.totalInvoiceAmount.value
    const supplier = lazyState?.filters?.['supplier.name'].value
    const paAmount = lazyState?.filters?.totalInvoicePa.value
    const orderNumber = lazyState?.filters?.supplierInvoiceNo.value

    if (dates) {
      const currentDate = new Date()
      startDate = formatDate(dates[0])
      endDate = dates[1] ? formatDate(dates[1]) : formatDate(currentDate)
    }

    const requestParams =
      `?page=${Number(lazyState?.page) + 1}` +
      `&limit=${lazyState?.rows}` +
      `${
        totalAmount?.min ? '&greaterThanTotalAmount=' + totalAmount.min : ''
      }` +
      `${totalAmount?.max ? '&lessThanTotalAmount=' + totalAmount.max : ''}` +
      `${paAmount?.min ? '&greaterThanPa=' + paAmount.min : ''}` +
      `${paAmount?.max ? '&lessThanPa=' + paAmount.max : ''}` +
      `${dates ? '&startDate=' + startDate : ''}` +
      `${dates ? '&endDate=' + endDate : ''}` +
      `${supplier ? '&supplierName=' + supplier.code : ''}` +
      `${orderNumber ? '&orderNo=' + orderNumber : ''}` +
      `${lazyState?.sortField ? '&sortByField=' + lazyState.sortField : ''}` +
      `${lazyState?.sortOrder ? '&sortByOrder=' + lazyState.sortOrder : ''}`

    setTableLoading(true)

    server
      .get(`/invoicesHeaders/${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        const ordersData = response.data.invoicesHeaders
        setOrders(ordersData)
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
    checkClearBtn()
    // console.log('lazyState', lazyState)
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
  const orderTotalTemplate = (order) => formatCurrency(order.totalInvoiceAmount)
  const paAmountBodyTemplate = (order) => formatCurrency(order.totalInvoicePa)
  const orderDateTemplate = (order) => formatDate(order.orderDate)
  const paRatioTemplate = (order) =>
    formatPercentage(order.totalInvoicePaPercentage)

  // FILTER TEMPLATES
  const supplierFilterElement = (options) => (
    <DropDownTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e.value, options.index)}
      placeholder='Select Supplier'
      options={[{ name: 'K+F', code: 'K%2BF' }]}
    />
  )

  const orderTotalFilterElement = (options) => (
    <MinMaxTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
    />
  )

  const paAmountFilterElement = (options) => (
    <MinMaxTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
    />
  )

  const orderDateFilterElement = (options) => (
    <DateFilterTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e.value, options.index)}
    />
  )

  const orderNumberFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      placeholder='Order no.'
    />
  )

  const checkClearBtn = () => {
    if (lazyState.sortField || lazyState.sortOrder) {
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

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          rowSpan={2}
          header='Account Number'
          field='customerAccountCode'
          // filter
          // filterElement={customerCodeFilterElement}
          // showFilterMenuOptions={false}
          // showClearButton={false}
        />
        <Column header='Account Name' rowSpan={2} field='customer' />
        <Column
          header='Supplier'
          field='supplier.name'
          rowSpan={2}
          sortable
          filter
          filterElement={supplierFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          header='Order Number'
          rowSpan={2}
          sortable
          field='supplierInvoiceNo'
          filter
          filterElement={orderNumberFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          header='Order Date'
          rowSpan={2}
          sortable
          field='orderDate'
          filter
          filterElement={orderDateFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          header='Order Total'
          rowSpan={2}
          sortable
          field='totalInvoiceAmount'
          filter
          filterElement={orderTotalFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          header='PA Amount'
          rowSpan={2}
          sortable
          field='totalInvoicePa'
          filter
          filterElement={paAmountFilterElement}
          showFilterOperator={false}
          showAddButton={false}
          showFilterMenuOptions={false}
        />
        <Column
          header='PA Percentage'
          rowSpan={2}
          sortable
          field='totalInvoicePaPercentage'
        />
        <Column header='Single Source Molecules' colSpan={3} />
        <Column header='Dual Source Molecules' colSpan={3} />
        <Column header='Multi Source Molecules' colSpan={3} />
      </Row>
      <Row>
        <Column
          header='Total Amount'
          // sortable
          field='molecules.singleSource.totalInvoiceAmount'
        />
        <Column
          header='PA Amount'
          // sortable
          field='molecules.singleSource.totalRefundedAmount'
        />
        <Column
          header='PA Percentage'
          // sortable
          field='molecules.singleSource.paPercentage'
        />
        <Column
          header='Total Amount'
          // sortable
          field='molecules.dualSource.totalInvoiceAmount'
        />
        <Column
          header='PA Amount'
          // sortable
          field='molecules.dualSource.totalRefundedAmount'
        />
        <Column
          header='PA Percentage'
          // sortable
          field='molecules.dualSource.paPercentage'
        />
        <Column
          header='Total Amount'
          // sortable
          field='molecules.multiSource.totalInvoiceAmount'
        />
        <Column
          header='PA Amount'
          // sortable
          field='molecules.multiSource.totalRefundedAmount'
        />
        <Column
          header='PA Percentage'
          // sortable
          field='molecules.multiSource.paPercentage'
        />
      </Row>
    </ColumnGroup>
  )

  const exportCSV = () => {
    dt.current.exportCSV()
  }

  // TOOLBAR
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

  const rightToolbarTemplate = () => (
    <Button
      label='Export CSV'
      icon='pi pi-upload'
      className='p-button-help'
      onClick={exportCSV}
    />
  )

  return (
    <MainContentLayout title='Orders'>
      <Toolbar className='mb-2' left={leftToolbarTemplate} />
      <DataTable
        ref={dt}
        lazy
        showGridlines
        headerColumnGroup={headerGroup}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalRecords={totalRecords}
        paginator
        value={orders}
        selectionMode='single'
        selection={selectedOrder}
        onSelectionChange={(e) => setSelectedOrder(e.value)}
        dataKey='id'
        onRowSelect={onRowSelect}
        tableStyle={{ minWidth: '50rem' }}
        loading={tableLoading}
        filters={lazyState.filters}
        sortField={lazyState.sortField}
        sortOrder={lazyState.sortOrder}
        rows={lazyState.rows}
        first={lazyState.first}
        onPage={onPage}
        onSort={onSort}
        onFilter={onFilter}
        removableSort
      >
        <Column field='customerAccountCode' />
        <Column field='customer' />
        <Column field='supplier.name' />
        <Column field='supplierInvoiceNo' />
        <Column field='orderDate' body={orderDateTemplate} />
        <Column field='totalInvoiceAmount' body={orderTotalTemplate} />
        <Column field='totalInvoicePa' body={paAmountBodyTemplate} />
        <Column field='totalInvoicePaPercentage' body={paRatioTemplate} />
        <Column
          field='molecules.singleSource.totalInvoiceAmount'
          body={(order) =>
            formatCurrency(order.molecules.singleSource.totalInvoiceAmount)
          }
        />
        <Column
          field='molecules.singleSource.totalRefundedAmount'
          body={(order) =>
            formatCurrency(order.molecules.singleSource.totalRefundedAmount)
          }
        />
        <Column
          field='molecules.singleSource.paPercentage'
          body={(order) =>
            formatPercentage(order.molecules.singleSource.paPercentage)
          }
        />
        <Column
          field='molecules.dualSource.totalInvoiceAmount'
          body={(order) =>
            formatCurrency(order.molecules.dualSource.totalInvoiceAmount)
          }
        />
        <Column
          field='molecules.dualSource.totalRefundedAmount'
          body={(order) =>
            formatCurrency(order.molecules.dualSource.totalRefundedAmount)
          }
        />
        <Column
          field='molecules.dualSource.paPercentage'
          body={(order) =>
            formatPercentage(order.molecules.dualSource.paPercentage)
          }
        />
        <Column
          field='molecules.multiSource.totalInvoiceAmount'
          body={(order) =>
            formatCurrency(order.molecules.multiSource.totalInvoiceAmount)
          }
        />
        <Column
          field='molecules.multiSource.totalRefundedAmount'
          body={(order) =>
            formatCurrency(order.molecules.multiSource.totalRefundedAmount)
          }
        />
        <Column
          field='molecules.multiSource.paPercentage'
          body={(order) =>
            formatPercentage(order.molecules.multiSource.paPercentage)
          }
        />
      </DataTable>
      <Toolbar className='mt-2' right={rightToolbarTemplate} />
    </MainContentLayout>
  )
}
