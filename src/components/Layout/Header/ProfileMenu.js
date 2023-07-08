import React from 'react'
import { Dropdown, DropdownToggle } from 'reactstrap'

import { useNavigate } from 'react-router-dom'

// users
import user1 from '../../../assets/images/user-4.jpg'

const ProfileMenu = (props) => {
  const navigate = useNavigate()

  return (
    <React.Fragment>
      <Dropdown className='d-inline-block' onClick={() => navigate('/profile')}>
        <DropdownToggle
          className='btn header-item waves-effect'
          id='page-header-user-dropdown'
          tag='button'
        >
          <img
            className='rounded-circle header-profile-user'
            src={user1}
            alt='Header Avatar'
          />
        </DropdownToggle>
      </Dropdown>
    </React.Fragment>
  )
}

export default ProfileMenu
