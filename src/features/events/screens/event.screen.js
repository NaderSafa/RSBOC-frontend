import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from 'primereact/button'

import server from '../../../server'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'

import { BsGenderFemale, BsGenderMale } from 'react-icons/bs'
import { formatDate } from '../../../components/shared/utils'
import { Tag } from 'primereact/tag'

const EventScreen = () => {
  const { eventId } = useParams()

  const { user, isProfileComplete } = useContext(AuthenticationContext)

  const [loading, setLoading] = useState()
  const [eventDetails, setEventDetails] = useState()
  const [hovering, setHovering] = useState(false)
  const [eligable, setEligable] = useState(false)
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()

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
  }, [eventDetails])

  const renderGender = () =>
    eventDetails?.gender === 'male' ? (
      Array(eventDetails?.event_type?.players_per_team)
        .fill(1)
        .map((i, idx) => <BsGenderMale key={idx} className='mr-1' />)
    ) : eventDetails?.gender === 'female' ? (
      Array(eventDetails?.event_type?.players_per_team)
        .fill(1)
        .map((i, idx) => <BsGenderFemale key={idx} className='mr-1' />)
    ) : (
      <>
        <BsGenderMale className='mr-1' />
        <BsGenderFemale className='mr-1' />
      </>
    )

  const renderTag = () => {
    const currentDate = new Date()
    return (
      <>
        {currentDate < new Date(eventDetails?.registration_start_date) ? (
          <Tag value='soon' severity='warning' />
        ) : currentDate <= new Date(eventDetails?.registration_end_date) ? (
          <Tag value='open' severity='success' />
        ) : (
          <Tag value='closed' severity='danger' />
        )}
      </>
    )
  }

  return (
    <>
      {loading ? (
        <div className='h-full flex justify-content-center align-items-center'>
          <i className='pi pi-spinner pi-spin text-red-400 text-4xl' />
        </div>
      ) : (
        <>
          <h1 className='text-lg'>Event Details</h1>
          <Container className='relative flex m-0 mt-3 align-items-start justify-content-between w-full'>
            <div className='flex flex-column lg:flex-row align-items-center w-full'>
              <div className='p-0 lg:mr-5 flex flex-column justify-content-center align-items-center'>
                <div
                  className='flex align-items-center justify-content-center bg-black-alpha-10 border-circle w-8rem h-8rem transition-colors transition-duration-500 hover:bg-black-alpha-80 cursor-pointer'
                  onMouseEnter={() => setHovering(true)}
                  onMouseLeave={() => setHovering(false)}
                >
                  <div
                    className={`bg-cover bg-center flex align-items-center justify-content-center w-8rem h-8rem border-3 border-red-100 border-circle ${
                      hovering ? 'opacity-70' : ''
                    }`}
                    shape='circle'
                    style={{
                      backgroundImage: `url(${eventDetails?.tournament?.championship?.logo_url})`,
                    }}
                  >
                    {/*!user.profile_picture_url && !hovering && (
                      <i className='pi pi-user text-6xl' />
                    )*/}
                    {hovering && (
                      <i
                        className={`pi pi-${'eye'} text-xl text-color-white`}
                        style={{ color: 'white' }}
                        onClick={() =>
                          navigate(
                            `/championships/${eventDetails.tournament.championship._id}`
                          )
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className='mt-3 grid w-full lg:mt-0'>
                <div className='col-12 p-0 m-0 mb-2'>
                  <h2 className='text-xl font-semibold m-0 p-0'>{`${eventDetails?.name}`}</h2>
                  <p className='text-sm m-0 p-0'>
                    {eventDetails?.tournament?.short_name}
                  </p>
                  <p className='m-0 mt-1 text-xs p-0'>{renderGender()}</p>
                </div>
                <div className='col-12 p-0 m-0 lg:col-5'>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Type:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.head}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Format:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.tournament_format}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Age limit:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.age_limit === 0
                        ? 'open'
                        : eventDetails?.age_limit}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Max players/teams per group:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.max_group_teams}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Min players/teams per group:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.min_group_teams}
                    </p>
                  </div>
                </div>
                <div className='col p-0 m-0'>
                  <h3 className='text-base font-medium m-0 mb-1 p-0'>
                    Event dates:
                  </h3>
                  {eventDetails?.dates.map((date, idx) => (
                    <p key={idx} className='m-0 p-0'>
                      {formatDate(date)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className='absolute right-0 mr-4'>{renderTag()}</div>
          </Container>
          {eligable && open && isProfileComplete && (
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
          )}

          <div className='flex-column-reverse flex lg:gap-2 lg:flex-row lg:grid mt-2 lg:h-screen'>
            <div className='lg:col-9 lg:p-0 h-full'>
              <Container className='h-full overflow-scroll mt-2'>
                <h2 className='text-base mt-0'>Participating Teams</h2>
              </Container>
            </div>
            <div className='lg:col lg:p-0'>
              <Container className='lg:mt-2'>
                <h2 className='text-base mt-0'>Additional Info</h2>
                <div className='ml-2 text-black-alpha-80'>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Fees:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.fees + ' ' + eventDetails?.currency}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Best of:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.best_of[0]}
                      {eventDetails?.event_type?.best_of[1] === 1
                        ? `[ F:${eventDetails?.event_type?.best_of[2]}]`
                        : eventDetails?.event_type?.best_of[1] === 2
                        ? `[ F & SF:${eventDetails?.event_type?.best_of[2]}]`
                        : ''}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Points/set:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.points_per_set}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Tie breaks:
                    </h3>
                    <p className='inline m-0 p-0'>
                      {eventDetails?.event_type?.tie_breaks}
                    </p>
                  </div>
                  <div className='mb-1'>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Registration Starts:
                    </h3>
                    <p className='m-0 p-0'>
                      {formatDate(eventDetails?.registration_start_date)}
                    </p>
                  </div>
                  <div>
                    <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                      Registration Ends:
                    </h3>
                    <p className='m-0 p-0'>
                      {formatDate(eventDetails?.registration_end_date)}
                    </p>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default EventScreen
