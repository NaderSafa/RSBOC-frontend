import React, { useState, useEffect, useContext } from 'react'
import { PickList } from 'primereact/picklist'
import { useParams } from 'react-router-dom'
import server from '../../../server'
import { Button } from 'primereact/button'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const CreateGroup = ({ event }) => {
  const { eventId } = useParams()
  const { toast } = useContext(AuthenticationContext)

  const [source, setSource] = useState([])
  const [target, setTarget] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    server
      .get('registration', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: {
          event: eventId,
          // group: true,
        },
      })
      .then((res) => {
        // console.log(res.data.registrations)
        setSource(() =>
          res.data.registrations.map((registration) => {
            return {
              ...registration,
              player1: registration.players[0],
              player2: registration.players[1],
            }
          })
        )
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
      })
  }, [])

  const onChange = (event) => {
    setSource(event.source)
    setTarget(event.target)
  }

  const handleSaveGroup = () => {
    setLoading(true)
    if (
      target.length > event.event_type.max_group_teams ||
      target.length < event.event_type.min_group_teams
    ) {
      toast.current.show({
        severity: 'error',
        summary: 'Error in Saving',
        detail: 'Number of players per group does not meet requirements',
      })
      setLoading(false)
      return
    }

    let sortedRegistrations = [...target].sort((a, b) => b.points - a.points)
    sortedRegistrations = sortedRegistrations.map(
      (registration) => registration._id
    )

    server
      .post('group', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: {
          registrations: sortedRegistrations,
          eventId,
        },
      })
      .then((res) => {
        console.log(res.data)
        setTarget([])
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const itemTemplate = (item) => {
    return (
      <div className='flex align-items-center'>
        <div
          className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2`}
          shape='circle'
          style={{
            backgroundImage: `url(${item.players[0].club.image_url})`,
          }}
        />
        <div
          className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
          shape='circle'
          style={{
            backgroundImage: `url(${item.players[1].club.image_url})`,
          }}
        />
        <p className='m-0 p-0 text-sm'>
          {`${item.players[0].full_name} & ${item.players[1].full_name} ${
            item.points ? `(${item.points})` : ''
          }`}
        </p>
      </div>
    )
  }

  return (
    <>
      {loading === true ? (
        <div className='h-full flex justify-content-center align-items-center'>
          <i className='pi pi-spinner pi-spin text-red-400 text-4xl' />
        </div>
      ) : (
        <PickList
          source={source}
          target={target}
          onChange={onChange}
          itemTemplate={itemTemplate}
          filter
          filterBy='player1.full_name,player2.full_name'
          breakpoint='1400px'
          sourceHeader='Available'
          targetHeader='Group'
          sourceStyle={{ height: '30rem' }}
          targetStyle={{ height: '30rem' }}
          sourceFilterPlaceholder='Search by player name'
          targetFilterPlaceholder='Search by player name'
          pt={{
            root: { className: 'py-2' },
            header: { className: 'border-1' },
            filterContainer: { className: 'border-1' },
            list: { className: 'border-1' },
          }}
        />
      )}
      <div className='flex justify-content-end'>
        <Button
          label='Save Group'
          text
          onClick={handleSaveGroup}
          size='small'
          icon={`pi pi-${loading ? 'spin pi-spinner' : 'save'}`}
          disabled={loading ? true : false}
          className='m-0 w-10rem'
        />
      </div>
    </>
  )
}

export default CreateGroup
