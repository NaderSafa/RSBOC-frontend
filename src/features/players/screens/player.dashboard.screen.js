import React, { useState, useEffect } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Rating } from 'primereact/rating'
import { Tag } from 'primereact/tag'
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs'

import Container from '../../../infrastrucrure/layout/components/container.component'
import server from '../../../server'
import { formatDate } from '../../../components/shared/utils'
import { Toolbar } from 'primereact/toolbar'

const PlayerDashboard = () => {
  const [events, setEvents] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [loading, setLoading] = useState(true)

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

  const imageBodyTemplate = (product) => {
    return (
      <img
        src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
        alt={product.image}
        className='w-6rem shadow-2 border-round'
      />
    )
  }

  const priceBodyTemplate = (product) =>
    product.dates.map((date) => formatDate(date)).join(', ')

  const ageLimitBodyTemplate = (product) => {
    return (
      <p className='m-0'>
        {product.age_limit === 0 ? 'open' : product.age_limit}
      </p>
    )
  }

  const statusBodyTemplate = (product) => {
    const currentDate = new Date()
    return (
      <>
        {currentDate < new Date(product.registration_start_date) ? (
          <Tag value='opens soon' severity='warning' />
        ) : currentDate <= new Date(product.registration_end_date) ? (
          <Tag value='open' severity='success' />
        ) : (
          <Tag value='closed' severity='danger' />
        )}
      </>
    )
  }

  const genderBodyTemplate = (product) => {
    switch (product.gender) {
      case 'men':
        return <BsGenderMale />

      case 'women':
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

  const footer = `In total there are ${events ? events.length : 0} events.`

  return (
    <>
      <Container className='w-full lg:py-5'>
        <DataTable
          value={events}
          header={header}
          loading={loading}
          // footer={footer}
          tableStyle={{ minWidth: '60rem' }}
          size='small'
          // rowClassName='bg-transparent'
          // className='bg-white-alpha-30 border-0'
          //   pt={{
          //     header: { style: { background: '#f5f5f5' } },
          //   }}
        >
          <Column field='name' header='Name' sortable />

          <Column
            field='dates'
            sortable
            header='Dates'
            body={priceBodyTemplate}
          />
          <Column field='gender' header='Gender' body={genderBodyTemplate} />
          <Column
            field='age_limit'
            header='Age Limit'
            body={ageLimitBodyTemplate}
          />
          <Column field='event_code' header='Type' />
          <Column header='Status' body={statusBodyTemplate} />
        </DataTable>
      </Container>
    </>
  )
}

export default PlayerDashboard
