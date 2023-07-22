import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import server from '../../../server'
import PlayersDropdown from '../components/players.dropdown.component'
import ProfileInput from '../../players/components/profile-input.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const EventRegisterScreen = () => {
  const { state: event } = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [playerInfo, setPlayerInfo] = useState({})

  const { user } = useContext(AuthenticationContext)
  const navigate = useNavigate()

  const steps = [
    {
      label: 'Payment',
    },
    {
      label: 'Summary',
    },
  ]
  event.event_type.players_per_team > 1 && steps.unshift({ label: 'Partner' })

  useEffect(() => {
    if (selectedPlayer) {
      server
        .get(`/users/${selectedPlayer._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'SPEEDBALL_HUB::TOKEN'
            )}`,
          },
        })
        .then((res) => setSelectedPartner(res.data.user))
    }
  }, [selectedPlayer])

  return (
    <>
      <h1 className='text-lg'>{`${event.name} Registration`}</h1>
      <Container className='m-0 mt-3 w-full '>
        <Steps model={steps} activeIndex={activeIndex} />
        <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-4'>
          <h4 className=' m-0 lg:mr-4 text-sm font-semibold'>
            Choose your partner
          </h4>
          <PlayersDropdown
            event={event}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        </div>
      </Container>
      {selectedPartner && (
        <Container className='relative flex m-0 mt-3 align-items-start justify-content-between w-full'>
          <div className='flex flex-column lg:flex-row align-items-center w-full'>
            <div className='p-0 lg:mr-5 flex flex-column justify-content-center align-items-center'>
              <div
                className='flex align-items-center justify-content-center bg-black-alpha-10 border-circle w-8rem h-8rem transition-colors transition-duration-500 hover:bg-black-alpha-80 cursor-pointer'
                onClick={() => navigate(`/players/${selectedPartner._id}`)}
              >
                <div
                  className={`bg-cover bg-center flex align-items-center justify-content-center w-8rem h-8rem border-3 border-red-100 border-circle`}
                  shape='circle'
                  style={{
                    backgroundImage: `url(${selectedPartner.profile_picture_url})`,
                  }}
                >
                  {!selectedPartner.profile_picture_url && (
                    <i className='pi pi-user text-6xl' />
                  )}
                </div>
              </div>
            </div>
            <div className='mt-3 grid w-full lg:mt-0'>
              <div className='col-12 p-0 m-0 '>
                <ProfileInput
                  label='Full Name'
                  setPlayerInfo={setPlayerInfo}
                  property='full_name'
                  editMode={false}
                  required
                />
                <ProfileInput
                  label='Nick Name'
                  setPlayerInfo={setPlayerInfo}
                  property='nick_name'
                  editMode={false}
                  hidden
                />
                <ProfileInput
                  label='Country'
                  setPlayerInfo={setPlayerInfo}
                  property='country'
                  editMode={false}
                  type='country'
                  required
                />
              </div>
              <div className='col-12 p-0 m-0 lg:col-5'>
                <ProfileInput
                  label='Gender'
                  setPlayerInfo={setPlayerInfo}
                  property='gender'
                  editMode={false}
                  type='select'
                  options={[
                    { name: 'Male', code: 'M' },
                    { name: 'Female', code: 'F' },
                  ]}
                  required
                />
                <ProfileInput
                  label='Birth Date'
                  type='date'
                  setPlayerInfo={setPlayerInfo}
                  property='dob'
                  editMode={false}
                  required
                />
                <ProfileInput
                  label='Federation ID'
                  setPlayerInfo={setPlayerInfo}
                  property='national_federation_id'
                  editMode={false}
                  type='number'
                  hidden
                />
                <ProfileInput
                  label='Phone'
                  setPlayerInfo={setPlayerInfo}
                  property='phone_number'
                  editMode={false}
                  hidden
                  required
                />
              </div>
              <div className='col p-0 m-0'>
                <ProfileInput
                  label='Preferred Hand'
                  setPlayerInfo={setPlayerInfo}
                  property='preferred_hand'
                  editMode={false}
                  type='select'
                  options={[
                    { name: 'Left', code: 'L' },
                    { name: 'Right', code: 'R' },
                  ]}
                  hidden
                  required
                />
                <ProfileInput
                  label='Weight (kg)'
                  setPlayerInfo={setPlayerInfo}
                  property='weight'
                  editMode={false}
                  type='number'
                  hidden
                />
                <ProfileInput
                  label='Height (cm)'
                  setPlayerInfo={setPlayerInfo}
                  property='height'
                  editMode={false}
                  type='number'
                  hidden
                  required
                />
              </div>
            </div>
          </div>
          <div className='absolute right-0 mr-4'></div>
        </Container>
      )}
      <div className='w-full mt-2'>
        <div
          className={`flex justify-content-${
            activeIndex === 0 ? 'end' : 'between'
          }`}
        >
          <Button
            label='back'
            icon='pi pi-arrow-left'
            size='small'
            text
            className={`${activeIndex === 0 ? 'hidden' : ''}`}
            onClick={() => {
              setActiveIndex((prevState) => prevState - 1)
            }}
          />
          <Button
            label='Next'
            icon='pi pi-arrow-right'
            size='small'
            text
            iconPos='right'
            className={activeIndex + 1 === steps.length ? 'hidden' : ''}
            onClick={() => {
              setActiveIndex((prevState) => prevState + 1)
            }}
          />
        </div>
      </div>
    </>
  )
}

export default EventRegisterScreen
