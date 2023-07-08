import React from 'react'
import { Container, Row } from 'reactstrap'

const Footer = () => {
  return (
    <React.Fragment>
      <footer className='footer'>
        <Container fluid={true}>
          <Row>
            <div className='col-12'>
              Copyright {new Date().getFullYear()} © Speedball Hub
              <span className='d-none d-sm-inline-block'>
                &nbsp;| Powered By&nbsp;
                <a target='_blank' href='http://orthoplexsolutions.com/'>
                  Orthoplex Solutions.
                </a>
              </span>
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
