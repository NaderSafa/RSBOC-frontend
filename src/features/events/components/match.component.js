import React, { useContext, useState } from 'react'
import RegistrationName from './registration-name.component'
import { InputNumber } from 'primereact/inputnumber'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import server from '../../../server'

const Match = ({ match, event }) => {
  const { user, toast } = useContext(AuthenticationContext)

  const [sets, setSets] = useState(
    match?.sets?.length > 0
      ? match.sets
      : [
          {
            set_number: 1,
            registration1_score: 0,
            registration2_score: 0,
          },
          {
            set_number: 2,
            registration1_score: 0,
            registration2_score: 0,
          },
        ]
  )

  const handleChange = (e) =>
    setSets((prevState) => {
      const changed = prevState.find(
        (set) => set.set_number === e.target.name[0]
      )

      if (e.target.name[1] === 1) {
        changed.registration1_score = e.value
      }
      if (e.target.name[1] === 2) {
        changed.registration2_score = e.value
      }
      return [
        ...prevState.filter((set) => set.set_number !== e.target.name[0]),
        changed,
      ].sort((a, b) => a.set_number - b.set_number)
    })

  const addSet = () => {
    if (
      event.event_type.best_of[1] === 0 &&
      sets.length < event.event_type.best_of[0]
    ) {
      setSets((prevState) =>
        [
          ...prevState,
          {
            set_number: sets.length + 1,
            registration1_score: 0,
            registration2_score: 0,
          },
        ].sort((a, b) => a.set_number - b.set_number)
      )
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: `This match is best of ${event.event_type.best_of[0]}`,
      })
    }
  }

  const popSet = () => {
    if (sets.length > 2) {
      setSets((prevState) =>
        prevState.sort((a, b) => a.set_number - b.set_number).slice(0, -1)
      )
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Match must have at least 2 sets',
      })
    }
  }

  const updateMatch = () => {
    let pointsError = ''
    const limits = [
      event.event_type.points_per_set,
      event.event_type.points_per_set + event.event_type.tie_breaks,
    ]
    const setsCount = [0, 0]
    sets.forEach((set) => {
      if (set.registration1_score === set.registration2_score) {
        setsCount[0] = setsCount[1]
        return
      } else if (set.registration1_score > set.registration2_score) {
        if (
          set.registration1_score < limits[0] ||
          set.registration1_score > limits[1]
        ) {
          pointsError = `To win a set you must have between ${limits[0]} and ${limits[1]} points`
          return
        }
        if (
          set.registration1_score - set.registration2_score < 2 &&
          event.event_type.tie_breaks !== 0 &&
          set.registration1_score !== limits[1]
        ) {
          pointsError = 'There must be at least 2 poins difference in each set'
          return
        }
        setsCount[0] = setsCount[0] + 1
      } else {
        if (
          set.registration2_score < limits[0] ||
          set.registration2_score > limits[1]
        ) {
          pointsError = `To win a set you must have between ${limits[0]} and ${limits[1]} points`
          return
        }
        if (
          set.registration2_score - set.registration1_score < 2 &&
          event.event_type.tie_breaks !== 0 &&
          set.registration2_score !== limits[1]
        ) {
          pointsError = 'There must be at least 2 poins difference in each set'
          return
        }
        setsCount[1] = setsCount[1] + 1
      }
    })

    if (pointsError !== '') {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: pointsError,
      })
      return
    }

    if (setsCount[0] === setsCount[1]) {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Draw is not accepted',
      })
      return
    }

    server
      .patch(
        `/match/${match._id}`,
        { sets: sets, played: true },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'SPEEDBALL_HUB::TOKEN'
            )}`,
          },
        }
      )
      .then((res) =>
        toast.current.show({
          severity: 'success',
          summary: 'Success',
          detail: res.data.message,
        })
      )
      .catch((err) => {
        setSets(err.response.data.sets)
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: err.response.data.message,
        })
      })
  }

  return (
    <div className='flex justify-content-between mt-3'>
      <div>
        <RegistrationName registration={match.registration1} />
        <RegistrationName registration={match.registration2} className='mt-1' />
      </div>
      <div className='flex p-0 m-0'>
        {sets.map((set) => (
          <div className='flex flex-column mr-2' key={set.set_number}>
            {['championship', 'admin'].includes(user.role) ? (
              <InputNumber
                value={set.registration1_score}
                onValueChange={handleChange}
                name={[set.set_number, 1]}
                size={1}
                max={13}
                maxLength={2}
                inputClassName='text-sm p-0 m-0 line-height-2 text-black-alpha-80 text-center'
              />
            ) : (
              <p
                className={`text-sm font-light p-0 m-0 text-center w-1rem ${
                  match.played ? 'text-black-alpha-80' : 'text-black-alpha-60'
                }`}
              >
                {set.registration1_score}
              </p>
            )}
            {['championship', 'admin'].includes(user.role) ? (
              <InputNumber
                value={set.registration2_score}
                onValueChange={handleChange}
                name={[set.set_number, 2]}
                size={1}
                max={13}
                maxLength={2}
                inputClassName='text-sm p-0 m-0 line-height-2 text-black-alpha-80 text-center'
              />
            ) : (
              <p
                className={`text-sm font-light p-0 m-0 text-center w-1rem ${
                  match.played ? 'text-black-alpha-80' : 'text-black-alpha-60'
                }`}
              >
                {set.registration2_score}
              </p>
            )}
          </div>
        ))}
        {['championship', 'admin'].includes(user.role) && (
          <div className='flex justify-content-center align-items-center'>
            <div className='flex flex-column mr-2'>
              <i
                className='pi pi-plus text-green-500 font-medium text-sm h-1rem cursor-pointer'
                onClick={addSet}
              />
              <i
                className='pi pi-minus text-red-500 font-medium text-sm mt-1 cursor-pointer'
                onClick={popSet}
              />
            </div>
            <div className='bg-green-300 text-white p-2 text-xs border-circle'>
              <i
                className='pi pi-check text-xs cursor-pointer'
                onClick={updateMatch}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Match
