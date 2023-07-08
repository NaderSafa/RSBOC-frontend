import React, { useState, useEffect, useRef } from 'react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { ColumnGroup } from 'primereact/columngroup'
import { Toolbar } from 'primereact/toolbar'
import { Button } from 'primereact/button'
import { Row } from 'primereact/row'

import MainContentLayout from '../../Layout/MainContentLayout'
import {
  DateFilterTemplate,
  InputFieldTemplate,
} from '../../shared/FilterTemplates'
import server from '../../../server'
import {
  formatCurrency,
  formatDate,
  formatPercentage,
} from '../../shared/utils'

export default function ManufacturersAdmin() {
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
      startDate = new Date(currentDate.getFullYear(), 0, 1)
      endDate = currentDate
      setDates([startDate, endDate])
    }

    const requestParams = `?startDate=${formatDate(
      startDate
    )}&endDate=${formatDate(endDate)}`

    server
      .get(`/manufacturers/admin/${requestParams}`, {
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
        averagePa: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        singleSourceTotalExtendedPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        singleSourceTotalRefunded: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        singleSourceAveragePa: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        dualSourceTotalExtendedPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        dualSourceTotalRefunded: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        dualSourceAveragePa: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        multiSourceTotalExtendedPrice: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        multiSourceTotalRefunded: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: 'gte' },
            { value: null, matchMode: 'lte' },
          ],
        },
        multiSourceAveragePa: {
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

  const paPercentageBodyTemplate = (order) => formatPercentage(order.averagePa)

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
  const paPercentageFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      icon='mdi mdi-percent-outline'
      type='number'
    />
  )

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          field='manufacturer.name'
          header='Manufacture Name'
          rowSpan={2}
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={manufacturerFilterElement}
        />
        <Column
          field='totalExtendedPrice'
          header='Total Order Amount'
          rowSpan={2}
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={orderAmountFilterElement}
        />
        <Column
          field='totalRefundedAmount'
          header='Total PA Amount'
          rowSpan={2}
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={paAmountFilterElement}
        />
        <Column
          field='averagePa'
          header='Average PA Percentage'
          rowSpan={2}
          sortable
          filter
          showFilterMenuOptions={false}
          filterElement={paPercentageFilterElement}
        />
        <Column colSpan={3} header='Single Source Molecule' />
        <Column colSpan={3} header='Dual Source Molecule' />
        <Column colSpan={3} header='Multi Source Molecule' />
      </Row>
      <Row>
        <Column
          header='Order Amount'
          field='singleSourceTotalExtendedPrice'
          sortable
        />
        <Column header='PA Amount' field='singleSourceTotalRefunded' sortable />
        <Column header='PA Percentage' field='singleSourceAveragePa' sortable />
        <Column
          header='Order Amount'
          field='dualSourceTotalExtendedPrice'
          sortable
        />
        <Column header='PA Amount' field='dualSourceTotalRefunded' sortable />
        <Column header='PA Percentage' field='dualSourceAveragePa' sortable />
        <Column
          header='Order Amount'
          field='multiSourceTotalExtendedPrice'
          sortable
        />
        <Column header='PA Amount' field='multiSourceTotalRefunded' sortable />
        <Column header='PA Percentage' field='multiSourceAveragePa' sortable />
      </Row>
    </ColumnGroup>
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
        headerColumnGroup={headerGroup}
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
        <Column field='manufacturer.name' />
        <Column field='totalExtendedPrice' body={orderAmountBodyTemplate} />
        <Column field='totalRefundedAmount' body={paAmountBodyTemplate} />
        <Column field='averagePa' body={paPercentageBodyTemplate} />

        <Column
          field='singleSourceTotalExtendedPrice'
          body={(order) =>
            formatCurrency(order?.singleSourceTotalExtendedPrice)
          }
        />
        <Column
          field='singleSourceTotalRefunded'
          body={(order) => formatCurrency(order?.singleSourceTotalRefunded)}
        />
        <Column
          field='singleSourceAveragePa'
          body={(order) => formatPercentage(order?.singleSourceAveragePa)}
        />
        <Column
          field='dualSourceTotalExtendedPrice'
          body={(order) => formatCurrency(order?.dualSourceTotalExtendedPrice)}
        />
        <Column
          field='dualSourceTotalRefunded'
          body={(order) => formatCurrency(order?.dualSourceTotalRefunded)}
        />
        <Column
          field='dualSourceAveragePa'
          body={(order) => formatPercentage(order?.dualSourceAveragePa)}
        />
        <Column
          field='multiSourceTotalExtendedPrice'
          body={(order) => formatCurrency(order?.multiSourceTotalExtendedPrice)}
        />
        <Column
          field='multiSourceTotalRefunded'
          body={(order) => formatCurrency(order?.multiSourceTotalRefunded)}
        />
        <Column
          field='multiSourceAveragePa'
          body={(order) => formatPercentage(order?.multiSourceAveragePa)}
        />
      </DataTable>
    </MainContentLayout>
  )
}
