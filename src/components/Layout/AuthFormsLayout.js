import React from 'react'
import logoSm from '../../assets/images/sign-colored.png'
import { Link } from 'react-router-dom'

import { Row, Col, CardBody, Card, Container } from 'reactstrap'

const AuthFormsLayout = (props) => {
  return (
    <React.Fragment>
      <div className='home-btn d-none d-sm-block'>
        <Link to='/' className='text-dark'>
          <i className='fas fa-home h2' />
        </Link>
      </div>
      <div className='account-pages mt-5 pt-sm-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col md={8} lg={6} xl={4}>
              <Card className='overflow-hidden'>
                <div className='bg-primary'>
                  <div className='text-primary text-center p-4'>
                    <h5 className='text-white font-size-20'>{props.title}</h5>

                    <p className='text-white-50'>{props.subtitle}</p>
                    <Link to='/' className='logo logo-admin'>
                      <img src={logoSm} height='30' alt='logo' />
                    </Link>
                  </div>
                </div>

                <CardBody className='p-4'>
                  <div className='p-3'>{props.children}</div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default AuthFormsLayout
