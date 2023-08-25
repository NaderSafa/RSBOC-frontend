import React, { useState, useEffect, useRef, useContext } from 'react'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

import MainContentLayout from '../../../components/Layout/MainContentLayout'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { normalizeName } from '../../../components/shared/utils'
import server from '../../../server'

const GroupStandings = ({ groupName, event: eventDetails, group }) => {
  const { toast, user } = useContext(AuthenticationContext)
  const dt = useRef(null)
  const [state, setState] = useState({
    first: 0,
    rows: 10,
    page: 0,
  })
  const [clearBtnDisabled, setClearBtnDisabled] = useState(true)
  const [globalFilterValue, setGlobalFilterValue] = useState('')

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Update windowWidth state when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => initState(), [])

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
        <p className='m-0 p-0 ml-1'>
          {normalizeName(data.players[i].full_name)}
        </p>
      </div>
    </Link>
  )

  const qualifiedBodyTemplate = (registration) => (
    <i
      className={`pi pi-${
        registration?.qualified === true ? 'check' : 'times'
      }-circle`}
    />
  )

  const pointsEditor = (options) => {
    // console.log(options)

    return (
      <i
        className={`pi pi-${
          options?.value === true
            ? 'check-circle text-green-400'
            : 'times-circle text-red-400'
        }`}
        onClick={() => {
          options.editorCallback(!options.value)
        }}
      />
    )
  }

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e
    // console.log('field ', field, 'rowData ', rowData, 'newValue ', newValue)

    rowData[field] = newValue
    server
      .patch(
        `/registration/${rowData._id}`,
        {
          [field]: newValue,
          qualifiedTo: eventDetails.finals,
          players: eventDetails,
        },
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
          summary: 'Qualified',
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
    event.preventDefault()
  }

  return (
    <MainContentLayout dt={dt} title={`Group ${groupName}`}>
      <DataTable
        ref={dt}
        value={group}
        dataKey='_id'
        globalFilterFields={['players', 'players[1].full_name']}
        emptyMessage='No players/teams found.'
        filters={state.filters}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        rows={state.rows}
        first={state.first}
        onSort={(e) => setState(e)}
        onFilter={(e) => setState(e)}
        size='small'
        exportFilename={`${eventDetails.name} - Group ${groupName}`}
      >
        <Column
          header='Player 1'
          body={(data) => playerBodyTemplate(data, 0)}
          field={(data) => data.players[0].full_name}
        />
        <Column
          header='Player 2'
          body={(data) => playerBodyTemplate(data, 1)}
          field={(data) => data.players[1].full_name}
        />
        <Column
          header='P'
          field='matches_played'
          sortable
          headerTooltip='Matches Played'
        />
        <Column
          header='W'
          field='matches_won'
          sortable
          headerTooltip='Matches Won'
        />
        <Column
          header='L'
          field='matches_lost'
          sortable
          headerTooltip='Matches Lost'
        />
        <Column
          header='+/-'
          field='sets_difference'
          sortable
          headerTooltip='Sets Difference'
        />
        <Column
          header='SF'
          field='sets_won'
          sortable
          headerTooltip='Sets For'
        />
        <Column
          header='SA'
          field='sets_lost'
          sortable
          headerTooltip='Sets Against'
        />
        <Column header='Points' field='group_points' sortable />
        {['championship', 'admin'].includes(user.role) && (
          <Column
            header='Qualified'
            field='qualified'
            body={qualifiedBodyTemplate}
            editor={(options) => pointsEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
        )}
      </DataTable>
    </MainContentLayout>
  )
}

export default GroupStandings
