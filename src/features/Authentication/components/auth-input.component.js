import React, { useEffect, useRef, useState } from 'react'

function AuthInput(props) {
  const [passwordShown, setPasswordShown] = useState(false)
  const [error, setError] = useState(null)

  const inputRef = useRef()

  useEffect(
    () => (error ? props.setInputError(true) : props.setInputError(false)),
    [error]
  )

  const handleBlur = () => {
    const emailRegixCheck = props.state
      ?.toLowerCase()
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    if (props.type === 'password' && props.state.length < 8) {
      setError('password is invalid')
    } else if (props.type === 'email' && !emailRegixCheck) {
      setError('please enter a vaild email address')
    } else if (props.required && props.state.length === 0) {
      setError('this field is required')
    }
  }

  return (
    <>
      <span
        className='p-input-icon-left p-input-icon-right w-full border-1 border-round-sm border-100 mt-3 outline-none'
        onClick={() => inputRef.current.focus()}
      >
        <i
          className={`pi pi-${
            props.type === 'password'
              ? 'lock'
              : props.type === 'email'
              ? 'envelope'
              : 'user'
          } pl-2 font-semibold`}
        />
        <input
          placeholder={
            props.placeholder
              ? props.placeholder
              : props.type.slice(0, 1).toUpperCase() + props.type.slice(1)
          }
          className='w-full text-sm font-medium py-3 pl-6 border-0 bg-transparent outline-none '
          ref={inputRef}
          type={passwordShown === true ? 'text' : props.type}
          value={props.state}
          onChange={(e) => props.stateHandler(e.target.value)}
          onBlur={handleBlur}
          onFocus={() => setError(null)}
        />
        {props.type === 'password' && (
          <i
            className={`pi pi-eye${
              passwordShown ? '' : '-slash'
            } pr-2 font-semibold cursor-pointer`}
            onClick={() => setPasswordShown((prevState) => !prevState)}
          />
        )}
      </span>
      {error && <p className='text-red-500 text-xs'>{error}</p>}
    </>
  )
}

export default AuthInput
