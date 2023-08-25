import React, { useState } from 'react'
import Container from '../../../../infrastrucrure/layout/components/container.component'
import { useNavigate } from 'react-router-dom'
import { Tag } from 'primereact/tag'
import { formatDate } from '../../../../components/shared/utils'
import { BsGenderFemale, BsGenderMale } from 'react-icons/bs'

const EventHero = ({ eventDetails }) => {
  const [hovering, setHovering] = useState(false)

  const navigate = useNavigate()

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
              <p className='inline m-0 p-0'>{eventDetails?.event_type?.head}</p>
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
            {eventDetails?.event_type?.tournament_format === 'groups' ? (
              <>
                <div className='mb-1'>
                  <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                    {`Max ${
                      eventDetails?.event_type?.players_per_team === 1
                        ? 'players'
                        : 'teams'
                    } per group:`}
                  </h3>
                  <p className='inline m-0 p-0'>
                    {eventDetails?.event_type?.max_group_teams}
                  </p>
                </div>
                <div className='mb-1'>
                  <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                    {`Min ${
                      eventDetails?.event_type?.players_per_team === 1
                        ? 'players'
                        : 'teams'
                    } per group:`}
                  </h3>
                  <p className='inline m-0 p-0'>
                    {eventDetails?.event_type?.min_group_teams}
                  </p>
                </div>
              </>
            ) : (
              <div className='mb-1'>
                <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                  Consolation:
                </h3>
                <p className='inline m-0 p-0'>
                  {eventDetails?.event_type?.consolation === true
                    ? 'true'
                    : 'false'}
                </p>
              </div>
            )}
          </div>
          <div className='col p-0 m-0'>
            <h3 className='text-base font-medium m-0 mb-1 p-0'>Event dates:</h3>
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
  )
}

export default EventHero
