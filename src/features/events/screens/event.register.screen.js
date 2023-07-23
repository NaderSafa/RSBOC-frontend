import React, { useContext, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { Steps } from 'primereact/steps'
import { Button } from 'primereact/button'
import server from '../../../server'
import PlayersDropdown from '../components/players.dropdown.component'
import ProfileHero from '../../players/components/profile-hero.component'
import { RadioButton } from 'primereact/radiobutton'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const EventRegisterScreen = () => {
  const { state: event } = useLocation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState()
  const [file, setFile] = useState()
  const [registration, setRegistration] = useState()
  const [loading, setLoading] = useState(false)

  const { toast, user } = useContext(AuthenticationContext)

  const steps = [
    {
      label: 'Payment',
    },
    {
      label: 'Summary',
    },
  ]
  event.event_type.players_per_team > 1 && steps.unshift({ label: 'Partner' })

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

  const register = () => {
    if (file) {
      setLoading(true)
      const formData = new FormData()
      formData.append('filename', file)
      server
        .post('/registration/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem(
              'SPEEDBALL_HUB::TOKEN'
            )}`,
          },
        })
        .then((res) => {
          server
            .post(
              '/registration',
              {
                players: [user._id, selectedPartner._id],
                event: event,
                fees: event.fees,
                currency: event.currency,
                payment_method: paymentMethod,
                payment_image_url: res.data.downloadURL,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    'SPEEDBALL_HUB::TOKEN'
                  )}`,
                },
              }
            )
            .then((res) => {
              setRegistration(res.data.registration)
              setActiveIndex((prevState) => prevState + 1)
              setLoading(false)
            })
            .catch((e) => {
              setLoading(false)
              toast.current.show({
                severity: 'error',
                summary: 'Error in Registration',
                detail: e.response.data.message,
              })
              console.log(e)
            })
        })
        .catch((e) => {
          console.log(e)
          toast.current.show({
            severity: 'error',
            summary: 'Error in Registration',
            detail: e.response.data.message,
          })
          setLoading(false)
        })
    } else {
      server
        .post(
          '/registration',
          {
            players: [user._id, selectedPartner._id],
            event: event,
            fees: event.fees,
            currency: event.currency,
            payment_method: paymentMethod,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'SPEEDBALL_HUB::TOKEN'
              )}`,
            },
          }
        )
        .then((res) => {
          setRegistration(res.data.registration)
          setActiveIndex((prevState) => prevState + 1)
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          toast.current.show({
            severity: 'error',
            summary: 'Error in Registration',
            detail: e.response.data.message,
          })
          console.log(e)
        })
    }
  }

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

        <div className=' mt-4'>
          {activeIndex === 0 && event.event_type.players_per_team > 1 && (
            <div className='flex flex-column md:flex-row justify-content-center align-items-center'>
              <h4 className=' m-0 md:mr-4 text-sm font-semibold'>
                Choose your partner
              </h4>
              <PlayersDropdown
                event={event}
                selectedPlayer={selectedPlayer}
                setSelectedPlayer={setSelectedPlayer}
              />
            </div>
          )}
          {((activeIndex === 1 && event.event_type.players_per_team > 1) ||
            (activeIndex === 0 && event.event_type.players_per_team === 1)) && (
            <>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center'>
                <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                  Registration Fees
                </h4>
                <p className='m-0 p-0 mt-1 md:mt-0'>
                  {event.fees + ' ' + event.currency}
                </p>
              </div>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-2'>
                <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                  Choose payment method
                </h4>
                <div className='card flex justify-content-center mt-2 md:mt-0'>
                  <div className='flex flex-wrap gap-3'>
                    <div className='flex align-items-center'>
                      <RadioButton
                        inputId='paymentMethod1'
                        name='pizza'
                        value='instapay'
                        onChange={(e) => setPaymentMethod(e.value)}
                        checked={paymentMethod === 'Instapay'}
                      />
                      <label htmlFor='paymentMethod1' className='ml-2'>
                        Instapay
                      </label>
                    </div>
                    <div className='flex align-items-center'>
                      <RadioButton
                        inputId='paymentMethod3'
                        name='pizza'
                        value='cash'
                        onChange={(e) => setPaymentMethod(e.value)}
                        checked={paymentMethod === 'Cash'}
                      />
                      <label htmlFor='paymentMethod3' className='ml-2'>
                        Cash
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {((activeIndex === 2 && event.event_type.players_per_team > 1) ||
            (activeIndex === 1 && event.event_type.players_per_team === 1)) && (
            <div className='flex flex-column align-items-center justify-content-center'>
              <i className='pi pi-check text-center text-8xl text-green-200' />
              <h2 className='text-center text-lg m-0 p-0 mt-1'>
                Registration Complete
              </h2>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-2'>
                <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                  Registration No.
                </h4>
                <p className='m-0 p-0 mt-1 md:mt-0 text-red-400'>
                  {registration._id}
                </p>
              </div>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-2'>
                <p className='m-0 p-0 mt-1 md:mt-0'>
                  You have successfully completed your registration to{' '}
                  {event.name}
                </p>
              </div>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-2'>
                <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                  Registration Fees
                </h4>
                <p className='m-0 p-0 mt-1 md:mt-0'>
                  {event.fees + ' ' + event.currency}
                </p>
              </div>
              <div className='flex flex-column md:flex-row justify-content-center align-items-center mt-2'>
                <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                  Payment Method
                </h4>
                <div className='card flex justify-content-center mt-1 md:mt-0'>
                  {paymentMethod}
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
      {selectedPartner && activeIndex === 0 && (
        <ProfileHero userData={selectedPartner} />
      )}
      {paymentMethod === 'instapay' &&
        ((activeIndex === 1 && event.event_type.players_per_team > 1) ||
          (activeIndex === 0 && event.event_type.players_per_team === 1)) && (
          <Container className='mt-2'>
            <div className='flex flex-column md:flex-row justify-content-center align-items-center'>
              <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                Instapay address
              </h4>
              <p className='m-0 p-0 mt-1 md:mt-0'>mazenrefaat@instapay</p>
            </div>

            <div className='flex justify-content-center align-items-center mt-2'>
              <h4 className='m-0 md:mr-4 text-sm font-semibold'>
                Upload Payment SS
              </h4>
              <input
                type='file'
                accept='.jpg,.png,.gif,.jpeg'
                onChange={handleFileUpload}
                max='2097152'
                className=''
              />
            </div>
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
            className={`${
              activeIndex === 0 || activeIndex === 2 ? 'hidden' : ''
            }`}
            onClick={() => {
              setActiveIndex((prevState) => prevState - 1)
            }}
          />
          <Button
            label={activeIndex === 0 ? 'Next' : 'Register'}
            icon='pi pi-arrow-right'
            size='small'
            text
            loading={loading}
            iconPos='right'
            disabled={
              (activeIndex === 0 && selectedPartner) ||
              (activeIndex === 1 && paymentMethod === 'cash') ||
              (activeIndex === 1 && paymentMethod === 'instapay' && file)
                ? false
                : true
            }
            className={activeIndex + 1 === steps.length ? 'hidden' : ''}
            onClick={() => {
              if (activeIndex === 0) {
                setActiveIndex((prevState) => prevState + 1)
              } else {
                register()
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

export default EventRegisterScreen
