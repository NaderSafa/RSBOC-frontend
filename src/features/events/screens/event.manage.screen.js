import React, { useContext, useEffect, useState } from 'react'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import { Navigate, useLocation } from 'react-router-dom'
import Container from '../../../infrastrucrure/layout/components/container.component'
import { Button } from 'primereact/button'
import CreateGroup from '../components/create-group.component'
import server from '../../../server'
import GroupComponent from '../components/group.component'
const EventManageScreen = () => {
  const { user } = useContext(AuthenticationContext)
  const { state: event } = useLocation()
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [groups, setGroups] = useState([])

  const getGroupsData = () => {
    server
      .get(`/group/?event=${event._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
      })
      .then((res) => setGroups(res.data.groups))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getGroupsData()
  }, [])

  return (
    <>
      {['championship', 'admin'].indexOf(user.role) !== -1 ? (
        <>
          <Container>
            <h2 className='text-lg text-black-alpha-70'>Create a group</h2>
            <div className='flex justify-content-between align-items-end m-0 p-0'>
              <p className='m-0 p-0 mr-3 text-sm'>
                View all participating players/teams and create needed groups
                easily by clicking the next button.
              </p>
              <Button
                label='Create Group'
                text
                icon='pi pi-pencil'
                className='m-0 w-10rem'
                size='small'
                onClick={() => setShowCreateGroup(true)}
              />
            </div>
          </Container>
          {showCreateGroup && (
            <Container className='mt-2'>
              <CreateGroup event={event} getGroupsData={getGroupsData} />
            </Container>
          )}
          <Container className='mt-2'>
            <h2 className='text-lg text-black-alpha-70'>Groups</h2>

            <div className='grid'>
              {groups.map((group) => (
                <GroupComponent
                  key={group._id}
                  group={group}
                  setGroups={setGroups}
                />
              ))}
            </div>
          </Container>
        </>
      ) : (
        <Navigate to={-1} />
      )}
    </>
  )
}

export default EventManageScreen
