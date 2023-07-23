import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import ReactCountryFlag from 'react-country-flag'
import server from '../../../server'

const SelectClub = ({ selectedClub, setSelectedClub }) => {
  const [clubs, setClubs] = useState()

  useEffect(() => {
    server
      .get('/club', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => setClubs(res.data.clubs))
      .catch((error) => console.log(error))
  }, [])

  const selectedClubTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <ReactCountryFlag countryCode={option.code} className='mr-2' />
          <div>{option.name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const clubOptionTemplate = (option) => {
    return (
      <div className='flex align-items-center'>
        <div
          className={`bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2`}
          shape='circle'
          style={{
            backgroundImage: `url(${option.image_url})`,
          }}
        />

        <div className='ml-2'>{option.name}</div>
      </div>
    )
  }

  return (
    <Dropdown
      value={selectedClub}
      onChange={(e) => setSelectedClub(e.value)}
      options={clubs}
      optionLabel='name'
      optionValue='_id'
      placeholder='Club'
      valueTemplate={selectedClubTemplate}
      itemTemplate={clubOptionTemplate}
      className='w-full text-sm border-0 outline-none'
      filter
      filterPlaceholder='type...'
      pt={{
        root: {
          className: 'bg-transparent',
        },
        input: { className: 'p-0 m-0 text-sm bg-transparent font-semibold' },
        panel: {
          className: 'shadow-none text-sm w-12rem border-1 mt-1',
          style: { backgroundColor: '#f5f5f5', borderColor: '#ebebeb' },
        },
        itemGroup: { className: '' },
      }}
    />
  )
}

export default SelectClub
