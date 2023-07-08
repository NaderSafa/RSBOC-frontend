import React, { useState, useContext } from 'react'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { Button } from 'reactstrap'
const NoAccounts = () => {
  const { user } = useContext(AuthenticationContext)
  // console.log(user)
  const [numbers, setNumbers] = useState(0)
  let check
  if (numbers === 0) {
    check = true
  }
  return (
    <>
      {check ? (
        <div className='p-3'>
          <p className='text-center'>
            Please contact us via this link to add your account number in our
            supported suppliers or enter the test mode and add upload data
            manually.
          </p>
          <div className='text-center mt-4 d-flex justify-content-center gap-3'>
            <Button color='' className='btn btn-outline-primary '>
              Add account number
            </Button>
            <Button type='submit' color='primary'>
              Upload data manually
            </Button>
          </div>
        </div>
      ) : (
        ''
      )}
    </>
  )
}

export default NoAccounts
