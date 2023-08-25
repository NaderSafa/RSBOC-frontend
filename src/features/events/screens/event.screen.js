import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'primereact/button'

import server from '../../../server'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'

import RegistrationsTable from '../components/registrations.table.component'
import { TabMenu } from 'primereact/tabmenu'
import GroupComponent from '../components/group.component'
import Matches from '../components/matches.component'
import Groups from '../components/groups.component'
import EventHero from '../components/events/event-hero.component'
import EventInfo from '../components/events/event-info.component'

const EventScreen = () => {
  const { eventId } = useParams()

  const { user, isProfileComplete } = useContext(AuthenticationContext)

  const [loading, setLoading] = useState()
  const [eventDetails, setEventDetails] = useState()
  const [eligable, setEligable] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const navigate = useNavigate()

  const [items, setItems] = useState([
    {
      label:
        eventDetails?.event_type?.players_per_event === 1 ? 'Players' : 'Teams',
      icon: 'pi pi-fw pi-users',
    },
    { label: 'Standings', icon: 'pi pi-fw pi-sitemap' },
    { label: 'Matches', icon: 'pi pi-fw pi-star' },
  ])

  const [groups, setGroups] = useState([])

  const getGroupsData = () => {
    server
      .get(`/group/?event=${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => setGroups(res.data.groups))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getGroupsData()

    if (eventDetails?.event_type?.tournament_format === 'single elimination') {
      setItems([
        {
          label:
            eventDetails?.event_type?.players_per_event === 1
              ? 'Players'
              : 'Teams',
          icon: 'pi pi-fw pi-users',
        },
        {
          label: 'Draw',
          icon: 'pi pi-fw pi-sitemap',
        },
        {
          label: 'Matches',
          icon: 'pi pi-fw pi-star',
        },
      ])
    }
  }, [eventDetails])

  useEffect(() => {
    setLoading(true)
    server
      .get(`/event/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => {
        setLoading(false)
        setEventDetails(res.data.event)
      })
      .catch((e) => console.log(e))
  }, [])

  useEffect(() => {
    if (
      eventDetails?.gender === 'mixed' ||
      (eventDetails?.gender === 'male' && user?.gender === 'M') ||
      (eventDetails?.gender === 'female' && user?.gender === 'F')
    ) {
      setEligable(true)
    }
    if (
      new Date() >= new Date(eventDetails?.registration_start_date) &&
      new Date() <= new Date(eventDetails?.registration_end_date)
    ) {
      setOpen(true)
    }
  }, [eventDetails, user?.gender])

  return (
    <>
      {loading ? (
        <div className='h-full flex justify-content-center align-items-center'>
          <i className='pi pi-spinner pi-spin text-red-400 text-4xl' />
        </div>
      ) : (
        <>
          <h1 className='text-lg'>Event Details</h1>
          <EventHero eventDetails={eventDetails} />
          {user.role === 'player' && eligable && open && isProfileComplete ? (
            <div className='w-full mt-2'>
              <div className='flex justify-content-end'>
                {user.registered_events.indexOf(eventId) !== -1 ? (
                  <p className='text-red-400'>
                    You have already registered to this event!
                  </p>
                ) : (
                  <Button
                    label='Apply Now'
                    icon='pi pi-sign-in'
                    iconPos='right'
                    size='small'
                    text
                    onClick={() => {
                      navigate('register', { state: eventDetails })
                    }}
                  />
                )}
              </div>
            </div>
          ) : ['championship', 'admin'].includes(user.role) ? (
            <div className='w-full mt-2'>
              <div className='flex justify-content-end'>
                <Button
                  label='Manage Event'
                  icon='pi pi-sign-in'
                  iconPos='right'
                  size='small'
                  text
                  onClick={() => {
                    navigate('manage', { state: eventDetails })
                  }}
                />
              </div>
            </div>
          ) : null}

          <div className='flex-column-reverse flex lg:gap-2 lg:flex-row lg:grid mt-2'>
            <div className='lg:col-9 lg:p-0'>
              <Container className='mt-2'>
                <TabMenu
                  model={items}
                  activeIndex={activeIndex}
                  onTabChange={(e) => setActiveIndex(e.index)}
                  className='mb-2 text-xs md:text-base'
                />
                {items[activeIndex].label === 'Teams' ||
                items[activeIndex].label === 'Players' ? (
                  <RegistrationsTable eventId={eventId} event={eventDetails} />
                ) : items[activeIndex].label === 'Standings' ? (
                  <div>
                    <Groups event={eventDetails} />
                    {false &&
                      groups.map((group) => (
                        <GroupComponent
                          key={group._id}
                          group={group}
                          setGroups={setGroups}
                        />
                      ))}
                  </div>
                ) : items[activeIndex].label === 'Matches' ? (
                  <Matches groups={groups} event={eventDetails} />
                ) : null}
              </Container>
            </div>
            <div className='lg:col lg:p-0'>
              <EventInfo eventDetails={eventDetails} />
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default EventScreen
