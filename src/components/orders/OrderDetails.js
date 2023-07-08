import React, { useState, useEffect, useRef, useContext } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { InputText } from 'primereact/inputtext'

import { Button } from 'primereact/button'

import server from '../../server'
import { formatCurrency, formatPercentage } from '../shared/utils'
import MainContentLayout from '../Layout/MainContentLayout'
import { InputFieldTemplate } from '../shared/FilterTemplates'
import { AuthenticationContext } from '../../Auth/authentication.context'
import OrderDetailsHeader from './OrderDetailsHeader'

const OrderDetails = () => {
  const { orderId } = useParams()
  const order = useLocation()

  const { isAdmin } = useContext(AuthenticationContext)

  const dt = useRef(null)
  const [orderDetails, setOrderDetails] = useState(null)
  const [filters, setFilters] = useState(null)
  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  const getData = () => {
    setTableLoading(true)

    server
      .get(`/invoicesDetails/?orderNumber=${orderId}&limit=1000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        const orderDetailsData = response.data.details
        setOrderDetails(orderDetailsData)
        // setTotalRecords(response.data.totalCount)
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
    initState()
    return getData()
  }, [])

  useEffect(() => {
    checkClearBtn()
  }, [state])

  const checkClearBtn = () => {
    if (state.sortField || state.sortOrder) {
      setClearBtnDisabled(false)
      return
    }
    for (const key in state?.filters) {
      if (key === 'global') {
        continue
      } else if (
        state?.filters[key].constraints[0].value ||
        state?.filters[key]?.constraints[1]?.value
      ) {
        setClearBtnDisabled(false)
        return
      }
    }
    setClearBtnDisabled(true)
  }

  const clearFilter = () => {
    initState()
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value
    let _filters = { ...filters }

    _filters['global'].value = value

    setFilters(_filters)
    setGlobalFilterValue(value)
  }

  const initState = () => {
    setState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        itemCode: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        'manufacturer.name': {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        'molecule.name': {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        shippedQuantity: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        unitPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        extendedPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        refundedAmount: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        paPercentage: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
      },
    }))
    setGlobalFilterValue('')
  }

  // TOOLBAR
  const topLeftToolbarTemplate = () => (
    <Button
      type='button'
      icon='pi pi-filter-slash'
      label='Clear'
      outlined
      onClick={clearFilter}
      disabled={clearBtnDisabled}
    />
  )

  const topRightToolbarTemplate = () => (
    <InputText
      value={globalFilterValue}
      onChange={onGlobalFilterChange}
      placeholder='Keyword Search'
    />
  )

  // BODY TEMPLATES
  const unitPriceBodyTemplate = (order) => formatCurrency(order.unitPrice)

  const extendedPriceBodyTemplate = (order) =>
    formatCurrency(order.extendedPrice)

  const refundedAmountBodyTemplate = (order) =>
    formatCurrency(order.refundedAmount)

  const paPercentageBodyTemplate = (order) =>
    formatPercentage(order.paPercentage)

  // FILTER TEMPLATES
  const itemCodeFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      placehloder='Molecule'
      icon='pi pi-hashtag'
      type='number'
    />
  )
  const manufacturerFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      placehloder='Manufacturer'
      icon='mdi mdi-cog'
    />
  )
  const moleculeFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      placehloder='Molecule'
      icon='mdi mdi-star'
    />
  )
  const shippedQuantityFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='pi pi-hashtag'
      type='number'
    />
  )
  const unitPriceFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-currency-usd'
      type='number'
    />
  )
  const extendedPriceFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-currency-usd'
      type='number'
    />
  )
  const refundedAmountFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-currency-usd'
      type='number'
    />
  )
  const paPercentageFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-percent-outline'
      type='number'
    />
  )

  return (
    <MainContentLayout
      title={`Order Details #${order.state.supplierInvoiceNo}`}
      dt={dt}
    >
      <OrderDetailsHeader order={order.state} />
      <Toolbar
        className='mb-2'
        left={topLeftToolbarTemplate}
        right={topRightToolbarTemplate}
      />
      <DataTable
        ref={dt}
        value={orderDetails}
        paginator
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={tableLoading}
        dataKey='id'
        removableSort
        globalFilterFields={['manufacturer.name', 'molecule.name']}
        emptyMessage='No order details found.'
        filters={state.filters}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        rows={state.rows}
        first={state.first}
        onPage={(e) => setState(e)}
        onSort={(e) => setState(e)}
        onFilter={(e) => setState(e)}
      >
        <Column
          field='itemCode'
          header='Item Code'
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={itemCodeFilterElement}
        />
        <Column
          header='Manufacturer Name'
          field='manufacturer.name'
          filter
          showFilterMenuOptions={false}
          sortable
          filterElement={manufacturerFilterElement}
        />
        <Column
          header='Molecule'
          field='molecule.name'
          showFilterMenuOptions={false}
          filter
          sortable
          filterElement={moleculeFilterElement}
        />
        <Column
          header='Shipped Quantity'
          field='shippedQuantity'
          filter
          sortable
          filterElement={shippedQuantityFilterElement}
          showFilterMenuOptions={false}
        />
        <Column
          header='Unit Price'
          field='unitPrice'
          body={unitPriceBodyTemplate}
          filterElement={unitPriceFilterElement}
          filter
          sortable
          showFilterMenuOptions={false}
        />
        <Column
          field='extendedPrice'
          header='Extended Price'
          body={extendedPriceBodyTemplate}
          filterElement={extendedPriceFilterElement}
          filter
          sortable
          showFilterMenuOptions={false}
        />
        {isAdmin && (
          <Column
            field='refundedAmount'
            header='PA Amount'
            body={refundedAmountBodyTemplate}
            filterElement={refundedAmountFilterElement}
            filter
            sortable
            showFilterMenuOptions={false}
          />
        )}
        {isAdmin && (
          <Column
            field='paPercentage'
            header='PA Percentage'
            body={paPercentageBodyTemplate}
            filterElement={paPercentageFilterElement}
            filter
            sortable
            showFilterMenuOptions={false}
          />
        )}
      </DataTable>
    </MainContentLayout>
  )
}

export default OrderDetails
