import React from 'react'
import Container from '../../../../infrastrucrure/layout/components/container.component'
import { formatDate } from '../../../../components/shared/utils'

const EventInfo = ({ eventDetails }) => {
  return (
    <Container className='lg:mt-2'>
      <h2 className='text-base mt-0'>Additional Info</h2>
      <div className='ml-2 text-black-alpha-80'>
        <div className='mb-1'>
          <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
            Best of:
          </h3>
          <p className='inline m-0 p-0'>
            {eventDetails?.event_type?.best_of[0]}
            {eventDetails?.event_type?.best_of[1] === 1
              ? `[ F:${eventDetails?.event_type?.best_of[2]}]`
              : eventDetails?.event_type?.best_of[1] === 2
              ? `[ F & SF:${eventDetails?.event_type?.best_of[2]}]`
              : ''}
          </p>
        </div>
        <div className='mb-1'>
          <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
            Points/set:
          </h3>
          <p className='inline m-0 p-0'>
            {eventDetails?.event_type?.points_per_set}
          </p>
        </div>
        <div className='mb-1'>
          <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
            Tie breaks:
          </h3>
          <p className='inline m-0 p-0'>
            {eventDetails?.event_type?.tie_breaks}
          </p>
        </div>
        {eventDetails?.requires_registration && (
          <>
            <div className='mb-1'>
              <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                Fees:
              </h3>
              <p className='inline m-0 p-0'>
                {eventDetails?.fees + ' ' + eventDetails?.currency}
              </p>
            </div>
            <div className='mb-1'>
              <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                Registration Starts:
              </h3>
              <p className='m-0 p-0'>
                {formatDate(eventDetails?.registration_start_date)}
              </p>
            </div>
            <div>
              <h3 className='text-base font-medium m-0 mr-2 p-0 inline'>
                Registration Ends:
              </h3>
              <p className='m-0 p-0'>
                {formatDate(eventDetails?.registration_end_date)}
              </p>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}

export default EventInfo
