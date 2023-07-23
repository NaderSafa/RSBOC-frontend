import React, { useContext, useState } from 'react'
import Container from '../../../infrastrucrure/layout/components/container.component'
import ProfileInput from './profile-input.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import server from '../../../server'
import { Button } from 'primereact/button'

const ProfileHero = ({
  userData,
  setPlayerInfo = () => {},
  editMode = false,
  setEditMode = () => {},
  profileOwner = false,
}) => {
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [hovering, setHovering] = useState(false)
  const [showUploadButton, setShowUploadButton] = useState(false)

  const { toast, onProfileUpdate, user } = useContext(AuthenticationContext)

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
  return (
    <Container className='relative flex m-0 mt-3 align-items-start justify-content-between w-full'>
      {userData ? (
        <>
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
                    backgroundImage: `url(${userData?.profile_picture_url})`,
                  }}
                >
                  {!userData?.profile_picture_url && !hovering && (
                    <i className='pi pi-user text-6xl' />
                  )}
                  {userData._id === user._id && hovering && (
                    <i
                      className={`pi pi-${
                        userData?.profile_picture_url ? 'user-edit' : 'plus'
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
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='full_name'
                  editMode={editMode}
                  required
                />
                <ProfileInput
                  label='Nick Name'
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='nick_name'
                  editMode={editMode}
                  hidden
                />
                <ProfileInput
                  label='Club'
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='club'
                  editMode={editMode}
                  type='club'
                  required
                />
                <ProfileInput
                  label='Country'
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='country'
                  editMode={editMode}
                  type='country'
                  required
                  hidden
                />
              </div>
              <div className='col-12 p-0 m-0 lg:col-5'>
                <ProfileInput
                  label='Gender'
                  userData={userData}
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
                  userData={userData}
                  type='date'
                  setPlayerInfo={setPlayerInfo}
                  property='dob'
                  editMode={editMode}
                  required
                />
                <ProfileInput
                  label='Federation ID'
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='national_federation_id'
                  editMode={editMode}
                  type='number'
                  hidden
                />
                <ProfileInput
                  label='Phone'
                  userData={userData}
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
                  userData={userData}
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
                  userData={userData}
                  setPlayerInfo={setPlayerInfo}
                  property='weight'
                  editMode={editMode}
                  type='number'
                  hidden
                />
                <ProfileInput
                  userData={userData}
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
        </>
      ) : (
        <div className='h-full w-full flex justify-content-center align-items-center'>
          <i className='pi pi-spinner pi-spin text-red-400 text-4xl' />
        </div>
      )}
    </Container>
  )
}

export default ProfileHero
