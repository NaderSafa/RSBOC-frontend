import React, { useContext, useEffect, useState } from 'react'

import LineChart from './LineChart'
import { AuthenticationContext } from '../../Auth/authentication.context'

import { DateFilterTemplate } from '../shared/FilterTemplates'
import { formatCurrency, formatDate, formatPercentage } from '../shared/utils'
import { useNavigate } from 'react-router-dom'

import server from '../../server'
import { Container, Row, Col, Card, CardBody } from 'reactstrap'

// Custom Scrollbar

import servicesIcon1 from '../../assets/images/services-icon/01.png'
import servicesIcon2 from '../../assets/images/services-icon/02.png'
import servicesIcon3 from '../../assets/images/services-icon/03.png'
import servicesIcon4 from '../../assets/images/services-icon/04.png'

const PharmacyDashboard = () => {
  const navigate = useNavigate()

  const { setIsLoading } = useContext(AuthenticationContext)
  const currentDate = new Date()
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1
  )
  const [menu, setMenu] = useState(false)
  const [date, setDate] = useState([previousMonth, currentDate])
  const [data, setData] = useState(null)

  useEffect(() => {
    if (date) {
      if (date[0] !== null && date[1] !== null) {
        // console.log(date)
      }
    }
  }, [date])

  // console.log('data', data)

  let startDate = formatDate(date[0])
  let endDate = formatDate(date[1])
  // let startDate = '2022-01-01'
  // let endDate = '2023-01-01'

  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    server
      .get(`/dashboard/pharmacy?startDate=${startDate}&endDate=${endDate}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        // console.log('response', response)

        setIsLoading(false)

        setData(response.data)
      })
      .catch((e) => {
        if (e.response.status === 401) {
          console.log('catched error')
        }
        setIsLoading(false)
      })
  }, [startDate, endDate])

  const toggle = () => {
    setMenu(!menu)
  }
  document.title = 'Dashboard | Speedball Hub'
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <div className='page-title-box text-center text-md-start  '>
            <Row className='align-items-center '>
              <Col md={7}>
                <h6 className='page-title'>Dashboard</h6>
                <ol className='breadcrumb m-0'>
                  <li
                    className='breadcrumb-item active'
                    style={{ width: '100%' }}
                  >
                    Welcome to Speedball Hub
                  </li>
                </ol>
              </Col>

              <Col md='5'>
                <div className=' d-flex gap-3 align-items-center justify-content-end'>
                  <h6 style={{ minWidth: '80px' }}>Date range:</h6>

                  <DateFilterTemplate
                    state={date}
                    stateHandler={(e) => setDate(e.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col xl={3} md={6}>
              <Card className='mini-stat bg-primary text-white'>
                <CardBody style={{ height: '120px' }}>
                  <div className='mb-4 d-flex'>
                    <div className='float-start mini-stat-img me-4'>
                      <img src={servicesIcon1} alt='' />
                    </div>
                    <div>
                      <h5 className='font-size-13 text-uppercase mt-0 text-white-50'>
                        Total Orders Amount
                      </h5>
                      <h4 className='fw-medium font-size-16'>
                        {formatCurrency(data?.dashboard?.totalOrdersAmount)}
                      </h4>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className='mini-stat bg-primary text-white'>
                <CardBody style={{ height: '120px' }}>
                  <div className='mb-4'>
                    <div className='float-start mini-stat-img me-4'>
                      <img src={servicesIcon2} alt='' />
                    </div>
                    <h5 className='font-size-13 text-uppercase mt-0 text-white-50'>
                      Total Pa Amount
                    </h5>
                    <h4 className='fw-medium font-size-16'>
                      {formatCurrency(data?.dashboard?.totalPaAmount)}
                    </h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className='mini-stat bg-primary text-white'>
                <CardBody style={{ height: '120px' }}>
                  <div className='mb-4'>
                    <div className='float-start mini-stat-img me-4'>
                      <img src={servicesIcon3} alt='' />
                    </div>
                    <h5 className='font-size-13 text-uppercase mt-0 text-white-50'>
                      Average Pa %
                    </h5>
                    <h4 className='fw-medium font-size-16'>
                      {formatPercentage(data?.dashboard?.averagePa)}
                    </h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card className='mini-stat bg-primary text-white'>
                <CardBody style={{ height: '120px' }}>
                  <div className='mb-4'>
                    <div className='float-start mini-stat-img me-4'>
                      <img src={servicesIcon4} alt='' />
                    </div>
                    <h5 className='font-size-13 text-uppercase mt-0 text-white-50'>
                      # of Orders
                    </h5>
                    <h4 className='fw-medium font-size-16'>
                      {/* {data?.totalNumberOfOrders} */}58
                    </h4>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <h6 className='card-title mb-4'>Last Six Months</h6>
                </CardBody>
                <LineChart />
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardBody>
                  <h2 className='card-title mb-4'>Latest Orders</h2>
                  <div className='wid-peity mb-4'>
                    <div className='row'>
                      {data?.latestOrders?.map((item, idx) => (
                        <React.Fragment key={idx}>
                          <div>
                            <h6>Order #{item?.supplierInvoiceNo}</h6>
                            <p className='text-muted mb-4'>
                              Total: {formatCurrency(item?.totalInvoiceAmount)}{' '}
                              | PA: {formatCurrency(item?.totalInvoicePa)}
                            </p>
                          </div>
                        </React.Fragment>
                      ))}
                      <button
                        onClick={() => navigate('orders')}
                        className='text-center'
                        style={{
                          backgroundColor: 'transparent',
                          border: '0',
                          boxShadow: 'none',
                          opacity: '0.7',
                          fontSize: '12px',
                        }}
                      >
                        View All
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PharmacyDashboard
