import React, { useState, useEffect, useRef, useContext } from 'react'
import server from '../../../server'
import { FilterMatchMode, FilterOperator } from 'primereact/api'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

import MainContentLayout from '../../../components/Layout/MainContentLayout'
import { InputFieldTemplate } from '../../../components/shared/FilterTemplates'
import { Link } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { InputNumber } from 'primereact/inputnumber'
import { normalizeName } from '../../../components/shared/utils'

const GroupStandings = ({ groupName, event, group }) => {
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

  return (
    <MainContentLayout dt={dt}>
      <DataTable
        ref={dt}
        value={group}
        paginator
        paginatorTemplate='FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'
        rowsPerPageOptions={[5, 10, 25, 50]}
        dataKey='_id'
        globalFilterFields={['players', 'players[1].full_name']}
        emptyMessage='No players/teams found.'
        filters={state.filters}
        sortField={state.sortField}
        sortOrder={state.sortOrder}
        rows={state.rows}
        first={state.first}
        onPage={(e) => setState(e)}
        onSort={(e) => setState(e)}
        onFilter={(e) => setState(e)}
        size='small'
        exportFilename={`${event.name} - Group ${groupName}`}
        paginatorClassName='text-xs p-0 m-0 bg-transparent border-0'
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
      </DataTable>
    </MainContentLayout>
  )
}

export default GroupStandings
