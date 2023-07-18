import React from 'react'
import { Button } from 'primereact/button'
import { Toolbar } from 'primereact/toolbar'
import { ScrollTop } from 'primereact/scrolltop'
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
    <div className='page-content'>
      <div className='container-fluid'>
        <h2 className='fs-3 fw-bold mt-4 mb-4'>{props.title}</h2>

        <div>
          <div>
            {props.children}
            {props.dt && (
              <Toolbar className='mt-2' end={rightToolbarTemplate} />
            )}
          </div>
        </div>
        <ScrollTop />
      </div>
    </div>
  )
}

export default MainContentLayout
