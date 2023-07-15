import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Avatar } from 'primereact/avatar'
import { FaWeightScale } from 'react-icons/fa6'
import { GiBodyHeight } from 'react-icons/gi'
import { IoHandRightSharp, IoHandLeftSharp } from 'react-icons/io5'

import Container from '../../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import ProfileInput from '../components/profile-input.component'
import { Button } from 'primereact/button'

const PlayerScreen = () => {
  const { playerId } = useParams()
  const { user, onProfileUpdate } = useContext(AuthenticationContext)
  const profileOwner =
    user._id === playerId || window.location.href.endsWith('/profile')

  const [playerInfo, setPlayerInfo] = useState()
  const [editMode, setEditMode] = useState(false)

  const renderButtons = () => (
    <div className='w-full'>
      <div className='flex justify-content-end'>
        <Button
          label='Save changes'
          icon='pi pi-save'
          size='small'
          disabled={!playerInfo.full_name ? true : false}
          text
          onClick={() => {
            onProfileUpdate(playerInfo).then(() => setEditMode(false))
          }}
        />
        <Button
          label='Cancel'
          size='small'
          text
          severity='secondary'
          onClick={() => {
            setEditMode(false)
            setPlayerInfo(null)
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <h1 className='text-lg'>Player profile</h1>
      <Container className='flex m-0 mt-3 align-items-start justify-content-between w-full'>
        <div className='flex flex-column lg:flex-row align-items-center w-full'>
          <div className='p-0 lg:mr-4'>
            <Avatar
              icon='pi pi-user text-6xl'
              className='w-8rem h-8rem'
              shape='circle'
            />
          </div>
          <div className='mt-3 grid w-full lg:mt-0'>
            <div className='col-12 p-0 m-0'>
              <ProfileInput
                label='Full Name'
                setPlayerInfo={setPlayerInfo}
                property='full_name'
                editMode={editMode}
                required
              />
              <ProfileInput
                label='Nick Name'
                setPlayerInfo={setPlayerInfo}
                property='nick_name'
                editMode={editMode}
                hidden
              />
              <ProfileInput
                label='Country'
                setPlayerInfo={setPlayerInfo}
                property='country'
                editMode={editMode}
                type='country'
              />
            </div>
            <div className='col-12 p-0 m-0 lg:col-5'>
              <ProfileInput
                label='Gender'
                setPlayerInfo={setPlayerInfo}
                property='gender'
                editMode={editMode}
                type='select'
                options={[
                  { name: 'Male', code: 'M' },
                  { name: 'Female', code: 'F' },
                ]}
              />
              <ProfileInput
                label='Birth Date'
                type='date'
                setPlayerInfo={setPlayerInfo}
                property='dob'
                editMode={editMode}
              />
              <ProfileInput
                label='Federation ID'
                setPlayerInfo={setPlayerInfo}
                property='national_federation_id'
                editMode={editMode}
                type='number'
                hidden
              />
            </div>
            <div className='col p-0 m-0'>
              <ProfileInput
                label='Preferred Hand'
                setPlayerInfo={setPlayerInfo}
                property='preferred_hand'
                editMode={editMode}
                type='select'
                options={[
                  { name: 'Left', code: 'L' },
                  { name: 'Right', code: 'R' },
                ]}
                hidden
              />
              <ProfileInput
                label='Weight (kg)'
                setPlayerInfo={setPlayerInfo}
                property='weight'
                editMode={editMode}
                type='number'
                hidden
              />
              <ProfileInput
                label='Height (cm)'
                setPlayerInfo={setPlayerInfo}
                property='height'
                editMode={editMode}
                type='number'
                hidden
              />
            </div>
          </div>
        </div>
        {profileOwner && (
          <i
            className={`pi pi-user-edit cursuer-pointer transition-colors text-${
              editMode ? 'black-alpha-20' : 'black-alpha-80 hover:text-red-300'
            } transition-duration-300`}
            onClick={() => setEditMode(true)}
          />
        )}
      </Container>
      {editMode && renderButtons()}

      <div className='flex-column-reverse flex lg:gap-2 lg:flex-row lg:grid mt-2 lg:h-screen'>
        <div className='lg:col-9 lg:p-0 h-full'>
          <Container className='h-full overflow-scroll mt-2'>
            <h2 className='text-base mt-0'>Latest Results</h2>
          </Container>
        </div>
        <div className='lg:col lg:p-0'>
          <Container className='lg:mt-2'>
            <h2 className='text-base mt-0'>Player Info</h2>
            <div className='ml-2 text-black-alpha-80'>
              {user.preferred_hand && (
                <li className='flex mb-2'>
                  {user.preferred_hand === 'R' ? (
                    <IoHandRightSharp className='mr-2' />
                  ) : (
                    <IoHandLeftSharp className='mr-2' />
                  )}
                  <p className='m-0 p-0 text-sm font-medium'>{`${
                    user.preferred_hand === 'R' ? 'Right' : 'Left'
                  }`}</p>
                </li>
              )}
              {user.weight && (
                <li className='flex mb-2'>
                  <FaWeightScale className='mr-2' />
                  <p className='m-0 p-0 text-sm font-medium'>{`${user.weight} kg`}</p>
                </li>
              )}
              {user.height && (
                <li className='flex mb-2'>
                  <GiBodyHeight className='mr-2' />
                  <p className='m-0 p-0 text-sm font-medium'>{`${user.height} cm`}</p>
                </li>
              )}
            </div>
          </Container>
        </div>
      </div>
    </>
  )
}

export default PlayerScreen
