import React, { useEffect, useState } from 'react'
import server from '../../../server'
import GroupStandings from './group-standings.component'
import Loading from '../../../components/shared/loading.component'

const Groups = ({ event }) => {
  const [groups, setGroups] = useState()
  const [loading, setLoading] = useState(true)

  const getGroups = () => {
    setLoading(true)
    server
      .get('/group', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            'SPEEDBALL_HUB::TOKEN'
          )}`,
        },
        params: {
          event: event._id,
        },
      })
      .then((res) => {
        const transformedGroups = res.data.groups.map((group) => {
          return {
            ...group,
            registrations: group.registrations
              .map((registration) => {
                return {
                  ...registration,
                  matches_played:
                    registration.matches_won || registration.matches_lost
                      ? registration.matches_won + registration.matches_lost
                      : 0,
                  group_points:
                    registration.matches_won || registration.matches_lost
                      ? registration.matches_won *
                          event.event_type.points_per_win +
                        registration.matches_lost *
                          event.event_type.points_per_lose
                      : 0,
                  sets_difference:
                    registration.sets_won || registration.sets_lost
                      ? registration.sets_won - registration.sets_lost
                      : 0,
                  matches_won: registration.matches_won
                    ? registration.matches_won
                    : 0,
                  matches_lost: registration.matches_lost
                    ? registration.matches_lost
                    : 0,
                  sets_won: registration.sets_won ? registration.sets_won : 0,
                  sets_lost: registration.sets_lost
                    ? registration.sets_lost
                    : 0,
                }
              })
              .sort((a, b) => b.group_points - a.group_points),
          }
        })
        // console.log(res.data.groups)
        setLoading(false)
        setGroups(transformedGroups)
      })
      .catch((e) => {
        setLoading(false)
        console.log(e)
      })
  }

  useEffect(() => getGroups(), [])

  return (
    <>
      {loading === true ? (
        <Loading />
      ) : (
        <>
          {groups.map((group) => (
            <GroupStandings
              key={group._id}
              event={event}
              group={group.registrations}
              groupName={group.name}
            />
          ))}
        </>
      )}
    </>
  )
}

export default Groups
