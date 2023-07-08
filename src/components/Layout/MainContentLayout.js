import React from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { ScrollTop } from 'primereact/scrolltop'
import { Card, CardBody, Col, Row } from 'reactstrap'

const MainContentLayout = (props) => {
  document.title = `${props.title} | Speedball Hub`

  const exportCSV = () => props.dt.current.exportCSV()

  const rightToolbarTemplate = () => (
    <Button
      label='Export CSV'
      icon='pi pi-upload'
      className='p-button-help'
      onClick={exportCSV}
    />
  )

  return (
    <React.Fragment>
      <div className='page-content'>
        <div className='container-fluid'>
          <h2 className='fs-3 fw-bold mt-4 mb-4'>{props.title}</h2>

          <Row>
            <Col className='col-12'>
              <Card>
                <CardBody>
                  {props.children}
                  {props.dt && (
                    <Toolbar className='mt-2' right={rightToolbarTemplate} />
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ScrollTop />
        </div>
      </div>
    </React.Fragment>
  )
}

export default MainContentLayout
