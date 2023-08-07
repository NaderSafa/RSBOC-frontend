import { Button } from 'primereact/button'
import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthInput from '../components/auth-input.component'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import AuthContainer from '../containers/auth.container'
import CustomLink from '../../../components/shared/custom-link.component'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [inputError, setInputError] = useState(false)

  const { onForgotPassword, isLoading } = useContext(AuthenticationContext)

  const onSubmitHandler = (e) => {
    !inputError && onForgotPassword(email.toLowerCase().trim())

    e.preventDefault()
  }
  document.title = 'Password Reset | Speedball Hub'

  return (
    <AuthContainer>
      <div>
        <h2 className='text-center text-color font-semibold text-base outline-none text-black'>
          Reset Password
        </h2>
        <p className='text-center text-sm mt-2'>
          Enter your Email and instructions will be sent to you!
        </p>
        <form onSubmit={onSubmitHandler}>
          <AuthInput
            state={email}
            stateHandler={setEmail}
            type='email'
            setInputError={setInputError}
          />

          <Button
            label='Reset Password'
            type='submit'
            className='w-full text-sm mt-4'
            size='small'
            disabled={inputError ? true : false}
            loading={isLoading}
          />
        </form>
        <p className='text-center text-sm mt-5'>
          Remember It? <CustomLink to='/login'>Login</CustomLink>
        </p>
      </div>
    </AuthContainer>
  )
}

export default ForgotPasswordScreen
