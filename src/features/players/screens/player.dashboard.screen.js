import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs'

import Container from '../../../infrastrucrure/layout/components/container.component'
import server from '../../../server'
import { formatDate } from '../../../components/shared/utils'
import { useNavigate } from 'react-router-dom'

const PlayerDashboard = () => {
  const [events, setEvents] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState()

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    server
      .get('/event', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => {
        setLoading(false)
        setEvents(res.data.events)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e)
      })
  }, [refresh])

  const imageBodyTemplate = (event) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/event/${event.image}`}
        alt={event.image}
        className='w-6rem shadow-2 border-round'
      />
    )
  }

  const priceBodyTemplate = (event) =>
    event.dates.map((date) => formatDate(date)).join(', ')

  const ageLimitBodyTemplate = (event) => {
    return (
      <p className='m-0'>{event.age_limit === 0 ? 'open' : event.age_limit}</p>
    )
  }

  const statusBodyTemplate = (event) => {
    const currentDate = new Date()
    return (
      <>
        {currentDate < new Date(event.registration_start_date) ? (
          <Tag value='soon' severity='warning' />
        ) : currentDate <= new Date(event.registration_end_date) ? (
          <Tag value='open' severity='success' />
        ) : (
          <Tag value='closed' severity='danger' />
        )}
      </>
    )
  }

  const genderBodyTemplate = (event) => {
    switch (event.gender) {
      case 'male':
        return <BsGenderMale />

      case 'female':
        return <BsGenderFemale />

      default:
        return (
          <>
            <BsGenderMale className='mr-2' />
            <BsGenderFemale />
          </>
        )
    }
  }

  const header = () => (
    <div className='flex flex-wrap align-items-center justify-content-between gap-2'>
      <span className='text-xl text-700 font-bold'>Upcoming Events</span>
      <i
        className={`pi pi-${
          loading ? 'spin pi-spinner' : 'refresh text-red-300'
        } cursor-pointer`}
        onClick={() => setRefresh((prevState) => !prevState)}
      />
    </div>
  )

  const onRowSelect = (e) => navigate(`/events/${e.data._id}`)

  document.title = 'Dashboard | Speedball Hub'

  return (
    <>
      <Container className='w-full lg:py-5'>
        <DataTable
          dataKey='_id'
          value={events}
          header={header}
          loading={loading}
          tableStyle={{ minWidth: '45rem' }}
          size='small'
          onRowSelect={onRowSelect}
          selectionMode='single'
          selection={selectedEvent}
          onSelectionChange={(e) => setSelectedEvent(e.value)}
        >
          <Column field='tournament.short_name' header='Tournament' sortable />
          <Column field='name' header='Event' sortable />
          <Column field='event_type.head' header='Type' />
          <Column field='gender' header='Gender' body={genderBodyTemplate} />
          <Column field='event_type.tournament_format' header='Format' />
          <Column
            field='age_limit'
            header='Age Limit'
            body={ageLimitBodyTemplate}
          />
          <Column
            field='dates'
            sortable
            header='Dates'
            body={priceBodyTemplate}
          />
          <Column header='Status' body={statusBodyTemplate} />
        </DataTable>
      </Container>
    </>
  )
}

export default PlayerDashboard
