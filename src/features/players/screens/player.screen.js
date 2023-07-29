import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaWeightScale } from 'react-icons/fa6'
import { GiBodyHeight } from 'react-icons/gi'
import { IoHandRightSharp, IoHandLeftSharp } from 'react-icons/io5'
import { Button } from 'primereact/button'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import server from '../../../server'
import ProfileHero from '../components/profile-hero.component'

const PlayerScreen = () => {
  const { playerId } = useParams()
  const { user, onProfileUpdate } = useContext(AuthenticationContext)

  const profileOwner =
    user._id === playerId || window.location.href.endsWith('/profile')

  const [userData, setUserData] = useState()
  const [playerInfo, setPlayerInfo] = useState(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (user._id === playerId || window.location.href.endsWith('/profile')) {
      setUserData(user)
    } else {
      setEditMode(false)
      server
        .get(`users/${playerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((res) => setUserData(res.data.user))
        .catch((err) => console.log(err))
    }
  }, [playerId, user._id, user])

  document.title = profileOwner
    ? 'Profile | Speedball Hub'
    : 'Player | Speedball Hub'

  const renderButtons = () => (
    <div className='w-full'>
      <div className='flex justify-content-end'>
        <Button
          label='Save changes'
          icon='pi pi-save'
          size='small'
          disabled={
            !playerInfo.full_name ||
            !playerInfo.country ||
            !playerInfo.gender ||
            !playerInfo.phone_number ||
            !playerInfo.dob ||
            !playerInfo.preferred_hand ||
            !playerInfo.height
              ? true
              : false
          }
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
            // setPlayerInfo({})
          }}
        />
      </div>
    </div>
  )

  return (
    <>
      <h1 className='text-lg'>Player profile</h1>
      <ProfileHero
        userData={userData}
        setPlayerInfo={setPlayerInfo}
        editMode={editMode}
        setEditMode={setEditMode}
        profileOwner={profileOwner}
      />
      {editMode && renderButtons()}
      <div className='flex-column-reverse flex lg:gap-2 lg:flex-row lg:grid mt-2'>
        <div className='lg:col-9 lg:p-0'>
          <Container className='mt-2'>
            <h2 className='text-base mt-0'>Latest Results</h2>
          </Container>
        </div>
        <div className='lg:col lg:p-0'>
          <Container className='lg:mt-2'>
            <h2 className='text-base mt-0'>Player Info</h2>
            <div className='ml-2 text-black-alpha-80'>
              {userData?.preferred_hand && (
                <li className='flex mb-2'>
                  {userData?.preferred_hand === 'R' ? (
                    <IoHandRightSharp className='mr-2' />
                  ) : (
                    <IoHandLeftSharp className='mr-2' />
                  )}
                  <p className='m-0 p-0 text-sm font-medium'>{`${
                    userData?.preferred_hand === 'R' ? 'Right' : 'Left'
                  }`}</p>
                </li>
              )}
              {userData?.weight && (
                <li className='flex mb-2'>
                  <FaWeightScale className='mr-2' />
                  <p className='m-0 p-0 text-sm font-medium'>{`${userData?.weight} kg`}</p>
                </li>
              )}
              {userData?.height && (
                <li className='flex mb-2'>
                  <GiBodyHeight className='mr-2' />
                  <p className='m-0 p-0 text-sm font-medium'>{`${userData?.height} cm`}</p>
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
