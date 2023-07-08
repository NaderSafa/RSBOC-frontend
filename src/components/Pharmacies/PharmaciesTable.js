import React, { useState, useEffect, useRef } from 'react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'

import server from '../../server'
import { useNavigate } from 'react-router-dom'
import MainContentLayout from '../Layout/MainContentLayout'

export default function PharmaciesTable() {
  const [pharmacies, setPharmacies] = useState(null)
  const [selectedPharmacy, setSelectedPharmacy] = useState(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)

  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })

  const navigate = useNavigate()
  const dt = useRef()

  const requestParams =
    `?page=${Number(state?.page) + 1}` + `&limit=10000` + `&role=pharmacy`

  useEffect(() => {
    setTableLoading(true)
    server
      .get(`/users/get-users${requestParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        setPharmacies(response.data.users)
        setTableLoading(false)
        // setError(null)
      })
      .catch((error) => {
        console.log('error', error)
        setTableLoading(false)
        // setError(error.response.data.message)
      })
    initState()
  }, [])

  useEffect(() => {
    checkClearBtn()
  }, [state])

  const checkClearBtn = () => {
    if (globalFilterValue) {
      setClearBtnDisabled(false)
      return
    }
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
    let _filters = { ...state.filters }

    _filters['global'].value = value

    setState((prevState) => {
      return {
        ...prevState,
        filters: _filters,
      }
    })
    setGlobalFilterValue(value)
  }

  const initState = () => {
    setState((prevState) => ({
      ...prevState,
      sortField: '',
      sortOrder: '',
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        displayName: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
        pharmacyName: {
          operator: FilterOperator.AND,
          constraints: [
            { value: null, matchMode: FilterMatchMode.STARTS_WITH },
          ],
        },
      },
    }))
    setGlobalFilterValue('')
  }

  const onRowSelect = (event) => {
    const pharmacy = pharmacies.find((user) => user.id === event.data.id)
    navigate(`${event.data.pharmacyId}`, { state: pharmacy })
  }

  const topLeftToolbarTemplate = () => {
    return (
      <Button
        type='button'
        icon='pi pi-filter-slash'
        label='Clear'
        outlined
        onClick={clearFilter}
        disabled={clearBtnDisabled}
      />
    )
  }

  const topRightToolbarTemplate = () => {
    return (
      <div>
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder='Keyword Search'
          />
        </span>
      </div>
    )
  }

  return (
    <React.Fragment>
      <MainContentLayout title='Pharmacies' dt={dt}>
        <Toolbar
          className='mb-2'
          left={topLeftToolbarTemplate}
          right={topRightToolbarTemplate}
        />
        <DataTable
          ref={dt}
          value={pharmacies}
          paginator
          showGridlines
          removableSort
          rows={state.rows}
          first={state.first}
          rowsPerPageOptions={[5, 10, 25, 50]}
          loading={tableLoading}
          sortField={state.sortField}
          sortOrder={state.sortOrder}
          onPage={(e) => setState(e)}
          onSort={(e) => setState(e)}
          onFilter={(e) => setState(e)}
          dataKey='id'
          filters={state.filters}
          globalFilterFields={['displayName', 'email', 'pharmacyName']}
          selectionMode='single'
          onRowSelect={onRowSelect}
          selection={selectedPharmacy}
          onSelectionChange={(e) => setSelectedPharmacy(e.value)}
          emptyMessage='No pharmacies found.'
        >
          <Column
            field='displayName'
            header='Name'
            filter
            sortable
            filterPlaceholder='Search by Name'
            style={{ minWidth: '12rem' }}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
          />
          <Column
            field='email'
            header='Email'
            sortable
            filter
            filterPlaceholder='Search by Email'
            style={{ minWidth: '12rem' }}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
          />
          <Column
            field='pharmacyName'
            header='Pharmacy Name'
            filter
            sortable
            filterPlaceholder='Search by Pharmacy'
            style={{ minWidth: '12rem' }}
            showFilterMatchModes={false}
            showFilterOperator={false}
            showAddButton={false}
          />
        </DataTable>
      </MainContentLayout>
    </React.Fragment>
  )
}
