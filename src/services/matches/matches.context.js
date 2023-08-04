//  0 - import required functions and variables
import React, { createContext, useEffect, useRef, useState } from 'react'
import server from '../server'

//  1 - create context
export const MatchesContext = createContext()

// export const useAuth = () => {
//   return useContext(MatchesContext.Provider);
// };

//  2 - create provider
export const MatchesContextProvider = ({ children }) => {
  //  2.0 - grap required states, states handlers and functions from other providers

  //  2.1 - define our states
  const [isLoading, setIsLoading] = useState(true)

  const getMatches = (input) => {
    const { eventId, round, groupId } = input

    const params = {}
    if (eventId) params.event = eventId
    if (round) params.round = round
    if (groupId) params.group = groupId

    setIsLoading(true)
    server.get('/match', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('SPEEDBALL_HUB::TOKEN')}`,
      },
      params: params,
    })
  }

  // 2.3 - return needed states, states handlers and functions in you provider

  return (
    <MatchesContext.Provider
      value={{
        isLoading,
        setIsLoading,
        getMatches,
      }}
    >
      {children}
    </MatchesContext.Provider>
  )
}
