import React, { useContext } from 'react'
import { confirmDialog } from 'primereact/confirmdialog'
import server from '../../../server'
import { AuthenticationContext } from '../../../Auth/authentication.context'

const GroupComponent = ({ group, setGroups }) => {
  const { toast, user } = useContext(AuthenticationContext)

  const accept = () => {
    server
      .delete(`/group/${group._id}?event=${group.event}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => {
        setGroups((prevState) =>
          prevState.filter((filterGroup) => group._id !== filterGroup._id)
        )
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: res.data.message,
        })
      })
      .catch((err) =>
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error deleting group',
        })
      )
  }

  const confirm = () => {
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept,
    })
  }
  return (
    <div
      className={`col-12 ${
        ['admin', 'championship'].includes(user.role) ? 'lg:col-6 lg:pr-6' : ''
      }`}
    >
      <div className='flex justify-content-between align-items-center'>
        <h3 className='text-base text-black-alpha-70'>{`Group ${group.name}`}</h3>
        {['admin', 'championship'].includes(user.role) && (
          <i
            className='pi pi-trash cursuer-pointer transition-colors text-red-300 hover:text-red-600 transition-duration-300'
            onClick={confirm}
          />
        )}
      </div>
      {group.registrations.map((registration) => (
        <div className='flex align-items-center mb-3' key={registration._id}>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mr-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${registration.players[0].club.image_url})`,
            }}
          />
          <p className='m-0 p-0 text-sm'>
            {`${registration.players[0].full_name} - `}
          </p>
          <div
            className={`inline bg-cover bg-center flex align-items-center justify-content-center h-1rem w-1rem border-circle p-2 mx-1`}
            shape='circle'
            style={{
              backgroundImage: `url(${registration.players[1].club.image_url})`,
            }}
          />
          <p className='m-0 p-0 text-sm'>
            {` ${registration.players[1].full_name} ${
              registration.points ? `(${registration.points})` : ''
            }`}
          </p>
        </div>
      ))}
    </div>
  )
}

export default GroupComponent
