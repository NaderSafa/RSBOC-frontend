import React, { useState, useEffect, useRef } from 'react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'

import MainContentLayout from '../../../components/Layout/MainContentLayout'
import {
  DateFilterTemplate,
  InputFieldTemplate,
} from '../../../components/shared/FilterTemplates'
import server from '../../../server'
import { formatCurrency, formatDate } from '../../../components/shared/utils'

export default function PlayersScreen() {
  const dt = useRef(null)

  const [manufacturers, setManufacturers] = useState()
  const [tableLoading, setTableLoading] = useState(true)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })
  const [dates, setDates] = useState()

  const getData = () => {
    setTableLoading(true)

    let startDate
    let endDate

    const currentDate = new Date()

    if (dates) {
      startDate = dates[0]
      endDate = dates[1] ? dates[1] : currentDate
    } else {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      endDate = currentDate
      setDates([startDate, endDate])
    }

    const requestParams = `?startDate=${formatDate(
      startDate
    )}&endDate=${formatDate(endDate)}`

    server
      .get(`/manufacturers/pharmacy${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        // console.log('response', response)
        setManufacturers(response.data.Manufacturers)
        setTableLoading(false)
      })
      .catch((error) => {
        console.log('error', error)
        setTableLoading(false)
        // setError(error.response.data.message)
      })
  }

  useEffect(() => {
    checkClearBtn()
    return getData()
  }, [state, dates])

  useEffect(() => initState(), [])

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

  const initState = () => {
    setState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'manufacturer.name': {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        totalExtendedPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        totalRefundedAmount: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
      },
    }))
    setDates(null)
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
    <>
      <DateFilterTemplate
        state={dates}
        stateHandler={(e) => {
          return setDates(e.value)
        }}
      />
    </>
  )

  // BODY TEMPLATES
  const orderAmountBodyTemplate = (order) =>
    formatCurrency(order.totalExtendedPrice)

  const paAmountBodyTemplate = (order) =>
    formatCurrency(order.totalRefundedAmount)

  // FILTER TEMPLATES
  const manufacturerFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      placehloder='Manufacturer'
      icon='mdi mdi-cog'
    />
  )
  const orderAmountFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-currency-usd'
      type='number'
    />
  )
  const paAmountFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-currency-usd'
      type='number'
    />
  )

  return (
    <MainContentLayout title='Manufacturers Report' dt={dt}>
      <Toolbar
        className='mb-2'
        left={topLeftToolbarTemplate}
        right={topRightToolbarTemplate}
      />
      <DataTable
        ref={dt}
        value={manufacturers}
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        paginator
        showGridlines
        loading={tableLoading}
        dataKey='manufacturer.name'
        removableSort
        globalFilterFields={['name']}
        emptyMessage='No Manufactures Found.'
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        filters={state.filters}
        rows={state.rows}
        first={state.first}
        onPage={(e) => setState(e)}
        onSort={(e) => {
          e.first = 0
          setState(e)
        }}
        onFilter={(e) => setState(e)}
      >
        <Column
          field='manufacturer.name'
          header='Manufacture Name'
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={manufacturerFilterElement}
        />
        <Column
          field='totalExtendedPrice'
          header='Total Order Amount'
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={orderAmountFilterElement}
          body={orderAmountBodyTemplate}
        />
        <Column
          field='totalRefundedAmount'
          header='Total PA Amount'
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={paAmountFilterElement}
          body={paAmountBodyTemplate}
        />
      </DataTable>
    </MainContentLayout>
  )
}
