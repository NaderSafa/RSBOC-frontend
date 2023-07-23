import React, { useContext, useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import server from '../../../server'
import { AuthenticationContext } from '../../../Auth/authentication.context'

export default function PlayersDropdown({
  event,
  selectedPlayer,
  setSelectedPlayer,
}) {
  const [availablePlayers, setAvailablePlayers] = useState([])

  const { user } = useContext(AuthenticationContext)

  useEffect(() => {
    server
      .get('users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: {
          gender:
            event.gender === 'male'
              ? 'M'
              : event.gender === 'female'
              ? 'F'
              : user.gender === 'M'
              ? 'F'
              : 'M',
          limit: 100,
          event_id: event._id,
          sortByField: 'full_name',
        },
      })
      .then((res) => setAvailablePlayers(res.data.users))
      .catch((err) => console.log(err))
  }, [])

  const selectedPlayerTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex align-items-center'>
          <div>{option.full_name}</div>
        </div>
      )
    }

    return <span>{props.placeholder}</span>
  }

  const countryOptionTemplate = (option) => {
    return (
      <div className='flex align-items-center'>
        <div
          className={`bg-cover bg-center flex align-items-center justify-content-center h-2rem w-2rem border-circle`}
          shape='circle'
          style={{
            backgroundImage: `url(${option.profile_picture_url})`,
          }}
        >
          {!option.profile_picture_url && <i className='pi pi-user' />}
        </div>

        <div className='ml-2'>{option.full_name}</div>
      </div>
    )
  }

  return (
    <div className=''>
      <Dropdown
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.value)}
        options={availablePlayers}
        optionLabel='full_name'
        placeholder='Select a Partner'
        filter
        valueTemplate={selectedPlayerTemplate}
        itemTemplate={countryOptionTemplate}
        className='w-full text-sm border-0 outline-none mt-2 md:mt-0'
        // className='w-full md:w-14rem'
        pt={{
          root: {
            className: 'bg-transparent',
          },
          input: { className: 'p-0 m-0 text-sm bg-transparent font-semibold' },
          panel: {
            className: 'shadow-none text-sm w-16rem border-1 mt-1',
            style: { backgroundColor: '#f5f5f5', borderColor: '#ebebeb' },
          },
          itemGroup: { className: '' },
        }}
      />
    </div>
  )
}
