import React, { useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { SelectButton } from 'primereact/selectbutton'
import ReactCountryFlag from 'react-country-flag'
import SelectCountry from './select-country.component'
import SelectClub from './select-club.component'

const ProfileInput = ({
  label,
  setPlayerInfo,
  editMode,
  property,
  required,
  type,
  options,
  hidden,
  userData,
}) => {
  const { user } = useContext(AuthenticationContext)
  const [value, setValue] = useState(
    property === 'dob' && !user.dob ? new Date('1/1/2000') : user[property]
  )
  const [error, setError] = useState()

  useEffect(() => {
    setPlayerInfo((prevState) => {
      return { ...prevState, [property]: value }
    })
  }, [value, property, setPlayerInfo])

  const handleChange = (e) => setValue(e.target.value)

  const handleBlur = () =>
    !value && required && setError('this field is required')

  const handleFocus = () => setError(null)

  const renderDateInput = () => (
    <Calendar
      value={new Date(value)}
      placeholder={label}
      inputClassName='text-sm p-0 bg-transparent font-semibold'
      onChange={handleChange}
      showButtonBar
    />
  )

  const renderSelectInput = () => (
    <SelectButton
      value={value}
      onChange={(e) => setValue(e.value)}
      options={options}
      optionLabel='name'
      optionValue='code'
      size='small'
      className='p-0 m-0 text-xs'
      pt={{
        button: {
          className: 'py-0 my-0 border-1 text-sm font-semibold',
          style: { borderColor: '#ebebeb' },
        },
      }}
    />
  )

  const renderCountryInput = () => (
    <SelectCountry selectedCountry={value} setSelectedCountry={setValue} />
  )
  const renderClubInput = () => (
    <SelectClub selectedClub={value} setSelectedClub={setValue} />
  )

  const renderTextInput = () => (
    <InputText
      value={value}
      className={`text-sm p-0 bg-transparent font-semibold`}
      keyfilter={type === 'number' && 'int'}
      placeholder={label}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
    />
  )

  const renderInput = () => {
    switch (type) {
      case 'date':
        return renderDateInput()
      case 'select':
        return renderSelectInput()
      case 'country':
        return renderCountryInput()
      case 'club':
        return renderClubInput()

      default:
        return renderTextInput()
    }
  }

  return (
    <div
      className={`inline flex mb-${
        (value && !hidden && property !== 'full_name') || editMode ? '2' : '0'
      } align-items-center ${editMode ? 'grid' : ''}`}
    >
      {editMode && (
        <div className='w-8rem flex col-5'>
          <h3 className='text-xs p-0 m-0 font-medium text-black-alpha-60'>
            {label}
          </h3>
          <p className={`ml-1 m-0 p-0 text-red-400 ${!required && 'hidden'}`}>
            *
          </p>
        </div>
      )}

      <div className={`inline flex flex-column ${editMode ? 'col' : ''}`}>
        {editMode ? (
          renderInput()
        ) : hidden ? null : !userData[property] ? null : type === 'club' ? (
          userData[property] && (
            <div className='flex'>
              {userData?.club?.image_url && (
                <div
                  className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
                  shape='circle'
                  style={{
                    backgroundImage: `url(${userData.club.image_url})`,
                  }}
                />
              )}
              <ReactCountryFlag countryCode={userData.country} />
            </div>
          )
        ) : property === 'dob' ? (
          <p className='m-0 p-0'>{`${
            new Date().getFullYear() -
            new Date(userData[property]).getFullYear()
          } years`}</p>
        ) : property === 'gender' ? (
          <p className='m-0 p-0'>
            {userData[property] === 'M' ? 'Male' : 'Female'}
          </p>
        ) : (
          <>
            {userData[property] && (
              <>
                <p
                  className={`text-${
                    property === 'full_name' ? 'xl lg:text-2xl' : 'sm'
                  } font-medium p-0 m-0`}
                >
                  {`${userData[property]} ${
                    property === 'full_name' && userData?.nick_name
                      ? '( ' + userData?.nick_name + ' )'
                      : ''
                  }`}
                </p>
              </>
            )}
          </>
        )}
        {editMode && error && (
          <small className='text-xs text-red-400'>{error}</small>
        )}
      </div>
    </div>
  )
}

export default ProfileInput
