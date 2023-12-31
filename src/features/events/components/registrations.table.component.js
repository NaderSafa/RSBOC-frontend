import React, { useState, useEffect, useRef, useContext } from 'react'
import server from '../../../server'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { formatDate } from '../../../components/shared/utils'

import MainContentLayout from '../../../components/Layout/MainContentLayout'
import { InputFieldTemplate } from '../../../components/shared/FilterTemplates'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { InputNumber } from 'primereact/inputnumber'

const RegistrationsTable = ({ eventId, event }) => {
  const dt = useRef(null)
  const [data, setData] = useState(null)
  const [filters, setFilters] = useState(null)
  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })
  const [tableLoading, setTableLoading] = useState(false)
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [globalFilterValue, setGlobalFilterValue] = useState('')
  const { user, toast } = useContext(AuthenticationContext)

  const getData = () => {
    setTableLoading(true)
    server
      .get('registration', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: {
          event: eventId,
        },
      })
      .then((res) => {
        // console.log(res.data.registrations)
        setData(res.data.registrations)
        setTableLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setTableLoading(false)
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
        'players.index[0].full_name': {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        players: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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
  const playerBodyTemplate = (data, i) => (
    <Link to={`/players/${data.players[i]?._id}`} className='text-gray-700'>
      <div className='flex align-items-center'>
        {data.players[i]?.club?.image_url && (
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${data.players[i].club.image_url})`,
            }}
          />
        )}
        <p className='m-0 p-0 ml-1'>{data.players[i].full_name}</p>
      </div>
    </Link>
  )

  // FILTER TEMPLATES
  const playerOneFilterElement = (options) => {
    return (
      <InputFieldTemplate
        state={options.value}
        stateHandler={(e) => options.filterCallback(e, options.index)}
        matchMode={options.filterModel.matchMode}
        placehloder='Manufacturer'
        icon='mdi mdi-cog'
      />
    )
  }
  const moleculeFilterElement = (options) => (
    <InputFieldTemplate
      state={options.value}
      stateHandler={(e) => options.filterCallback(e, options.index)}
      matchMode={options.filterModel.matchMode}
      placehloder='Molecule'
      icon='mdi mdi-star'
    />
  )

  const pointsEditor = (options) => {
    // console.log(options)
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
      />
    )
  }

  const onRowEditComplete = (e) => {
    console.log(e)
  }

  const preferredDatesBody = (e) => (
    <>
      {e.preferred_dates.map((date, idx) => (
        <span key={idx}>{formatDate(date)}, </span>
      ))}
    </>
  )

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e
    if (newValue > 0) {
      rowData[field] = newValue
      server
        .patch(
          `/registration/${rowData._id}`,
          { [field]: newValue },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'SPEEDBALL_HUB::TOKEN'
              )}`,
            },
          }
        )
        .then((res) => {
          toast.current.show({
            severity: 'success',
            summary: 'Points updated',
            detail: res.data.message,
          })
        })
        .catch((err) =>
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Error in updating registration',
          })
        )
    } else event.preventDefault()
  }

  return (
    <MainContentLayout dt={dt}>
      {/*
      <Toolbar
        className='mb-2'
        start={topLeftToolbarTemplate}
        end={topRightToolbarTemplate}
  />
*/}
      <DataTable
        editMode={user.role === 'championship' && 'cell'}
        // onRowEditComplete={onRowEditComplete}
        ref={dt}
        value={data}
        paginator
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        loading={tableLoading}
        dataKey='_id'
        removableSort
        globalFilterFields={['players', 'players[1].full_name']}
        emptyMessage={`No Registered ${
          event?.event_type?.players_per_team === 1 ? 'players' : 'teams'
        } yet.`}
        filters={state.filters}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        rows={state.rows}
        first={state.first}
        onPage={(e) => setState(e)}
        onSort={(e) => setState(e)}
        onFilter={(e) => setState(e)}
        size='small'
        exportFilename={event?.name}
        paginatorClassName='text-xs p-0 m-0 bg-transparent border-0'
      >
        <Column
          header='Player 1'
          body={(data) => playerBodyTemplate(data, 0)}
          field={(data) => data.players[0].full_name}
          // filter
          showFilterMenuOptions={false}
          // sortable
          filterElement={playerOneFilterElement}
        />
        <Column
          header='Player 2'
          body={(data) => playerBodyTemplate(data, 1)}
          field={(data) => data.players[1].full_name}
          showFilterMenuOptions={false}
          // filter
          // sortable
          // filterElement={moleculeFilterElement}
        />

        {['championship', 'admin'].includes(user.role) && (
          <Column
            header='Player 1 Phone'
            field={(data) => data.players[0].phone_number}
          />
        )}
        {['championship', 'admin'].includes(user.role) && (
          <Column
            header='Player 2 Phone'
            field={(data) => data.players[1].phone_number}
          />
        )}
        {['championship', 'admin'].includes(user.role) && (
          <Column
            header='Preferred Dates'
            field='preferred_dates'
            body={preferredDatesBody}
          />
        )}
        {['championship', 'admin'].includes(user.role) ? (
          <Column
            header='Points'
            field='points'
            editor={(options) => pointsEditor(options)}
            onCellEditComplete={onCellEditComplete}
            sortable
          />
        ) : (
          <Column header='Points' field='points' sortable />
        )}
      </DataTable>
    </MainContentLayout>
  )
}

export default RegistrationsTable
