import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaWeightScale } from 'react-icons/fa6'
import { GiBodyHeight } from 'react-icons/gi'
import { IoHandRightSharp, IoHandLeftSharp } from 'react-icons/io5'
import { Button } from 'primereact/button'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import ProfileInput from '../components/profile-input.component'
import server from '../../../server'

const PlayerScreen = () => {
  const { playerId } = useParams()
  const { user, onProfileUpdate, toast } = useContext(AuthenticationContext)

  const profileOwner =
    user._id === playerId || window.location.href.endsWith('/profile')

  const [loading, setLoading] = useState(false)
  const [playerInfo, setPlayerInfo] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [file, setFile] = useState(null)
  const [hovering, setHovering] = useState(false)
  const [showUploadButton, setShowUploadButton] = useState(false)

  document.title = profileOwner
    ? 'Profile | Speedball Hub'
    : 'Player | Speedball Hub'

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile.size > 2097152) {
      toast.current.show({
        severity: 'error',
        summary: "Can't upload image",
        detail: 'Image size is too big',
      })
      return
    }
    const allowedFormats = ['jpg', 'png', 'gif', 'jpeg'] // allowed file formats
    const fileExtension = selectedFile.name.split('.').pop()

    if (allowedFormats.includes(fileExtension)) {
      setFile(selectedFile)
    } else {
      toast.current.show({
        severity: 'error',
        summary: "Can't upload image",
        detail: `File format not supported. Allowed formats: ${allowedFormats.join(
          ', '
        )}`,
      })
    }
  }

  const updateProfilePicture = () => {
    if (file) {
      setLoading(true)
      const formData = new FormData()
      formData.append('filename', file)
      server
        .post('/users/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem(
              'SPEEDBALL_HUB::TOKEN'
            )}`,
          },
        })
        .then((res) => {
          onProfileUpdate({ profile_picture_url: res.data.downloadURL })
            .then(() => {
              setLoading(false)
              setShowUploadButton(false)
            })
            .catch((e) => {
              console.log(e)
              setLoading(false)
            })
        })
        .catch((e) => {
          console.log(e)
          setLoading(false)
        })
    } else {
      toast.current.show({
        severity: 'error',
        summary: "Can't upload image",
        detail: 'Please select an Image to upload',
      })
    }
  }

  // useEffect(() => console.log(playerInfo), [playerInfo])

  // useEffect(() => {
  //   if (file) {
  //     const formData = new FormData()
  //     formData.append('filename', file)
  //     server
  //       .post('/users/upload', formData, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem(
  //             'SPEEDBALL_HUB::TOKEN'
  //           )}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       })
  //       .then((res) => {
  //         onProfileUpdate({ profile_picture_url: res.data.downloadURL })
  //           .then(() => {
  //             setShowUploadButton(false)
  //           })
  //           .catch((e) => console.log(e))
  //       })
  //       .catch((e) => console.log(e))
  //   }
  // }, [file])

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
                  backgroundImage: `url(${user.profile_picture_url})`,
                }}
              >
                {!user.profile_picture_url && !hovering && (
                  <i className='pi pi-user text-6xl' />
                )}
                {hovering && (
                  <i
                    className={`pi pi-${
                      user.profile_picture_url ? 'user-edit' : 'plus'
                    } text-xl text-color-white p-6`}
                    style={{ color: 'white' }}
                    onClick={() => setShowUploadButton(true)}
                  />
                )}
              </div>
            </div>

            {showUploadButton && (
              <div className='flex-column align-items-center flex mt-2'>
                <div>
                  <Button
                    label='Save'
                    icon={`pi pi-${loading ? 'spinner pi-spin' : 'save'}`}
                    size='small'
                    disabled={!file ? true : false}
                    text
                    onClick={updateProfilePicture}
                  />
                  <Button
                    label='Cancel'
                    size='small'
                    text
                    severity='secondary'
                    onClick={() => {
                      setShowUploadButton(false)
                      setFile(null)
                    }}
                  />
                </div>
                <input
                  type='file'
                  accept='.jpg,.png,.gif,.jpeg'
                  onChange={handleFileUpload}
                  max='2097152'
                  className=''
                />
              </div>
            )}
          </div>
          <div className='mt-3 grid w-full lg:mt-0'>
            <div className='col-12 p-0 m-0 '>
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
                required
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
                required
              />
              <ProfileInput
                label='Birth Date'
                type='date'
                setPlayerInfo={setPlayerInfo}
                property='dob'
                editMode={editMode}
                required
              />
              <ProfileInput
                label='Federation ID'
                setPlayerInfo={setPlayerInfo}
                property='national_federation_id'
                editMode={editMode}
                type='number'
                hidden
              />
              <ProfileInput
                label='Phone'
                setPlayerInfo={setPlayerInfo}
                property='phone_number'
                editMode={editMode}
                hidden
                required
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
                required
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
                required
              />
            </div>
          </div>
        </div>
        <div className='absolute right-0 mr-4'>
          {profileOwner && (
            <i
              className={`pi pi-user-edit cursuer-pointer transition-colors text-${
                editMode
                  ? 'black-alpha-20'
                  : 'black-alpha-80 hover:text-red-300'
              } transition-duration-300`}
              onClick={() => setEditMode(true)}
            />
          )}
        </div>
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
