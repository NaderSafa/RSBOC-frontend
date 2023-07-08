import React, { useEffect, useCallback, useRef, useContext } from 'react'

// //Import Scrollbar
import SimpleBar from 'simplebar-react'

// MetisMenu
import MetisMenu from 'metismenujs'
import { useLocation } from 'react-router-dom'
import { AuthenticationContext } from '../../../Auth/authentication.context'
import PharmacySidebarContent from './PharmacySidebarContent'
import AdminSidebarContent from './AdminSidebarContent'

const SidebarContent = (props) => {
  const { isAdmin } = useContext(AuthenticationContext)
  const location = useLocation()
  const ref = useRef()
  const path = location.pathname

  const activateParentDropdown = useCallback((item) => {
    item.classList.add('active')
    const parent = item.parentElement
    const parent2El = parent.childNodes[1]

    if (parent2El && parent2El.id !== 'side-menu') {
      parent2El.classList.add('mm-show')
    }

    if (parent) {
      parent.classList.add('mm-active')
      const parent2 = parent.parentElement

      if (parent2) {
        parent2.classList.add('mm-show') // ul tag

        const parent3 = parent2.parentElement // li tag
        if (parent3) {
          parent3.classList.add('mm-active') // li
          parent3.childNodes[0].classList.add('mm-active') //a
          const parent4 = parent3.parentElement // ul
          if (parent4) {
            parent4.classList.add('mm-show') // ul
            const parent5 = parent4.parentElement
            if (parent5) {
              parent5.classList.add('mm-show') // li
              parent5.childNodes[0].classList.add('mm-active') // a tag
            }
          }
        }
      }
      scrollElement(item)
      return false
    }
    scrollElement(item)
    return false
  }, [])

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i]
      const parent = items[i].parentElement

      if (item && item.classList.contains('active')) {
        item.classList.remove('active')
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null
        if (parent2El && parent2El.id !== 'side-menu') {
          parent2El.classList.remove('mm-show')
        }

        parent.classList.remove('mm-active')
        const parent2 = parent.parentElement

        if (parent2) {
          parent2.classList.remove('mm-show')

          const parent3 = parent2.parentElement
          if (parent3) {
            parent3.classList.remove('mm-active') // li
            parent3.childNodes[0].classList.remove('mm-active')

            const parent4 = parent3.parentElement // ul
            if (parent4) {
              parent4.classList.remove('mm-show') // ul
              const parent5 = parent4.parentElement
              if (parent5) {
                parent5.classList.remove('mm-show') // li
                parent5.childNodes[0].classList.remove('mm-active') // a tag
              }
            }
          }
        }
      }
    }
  }

  const activeMenu = useCallback(() => {
    const pathName = location.pathname
    const fullPath = pathName
    let matchingMenuItem = null
    const ul = document.getElementById('side-menu')
    const items = ul.getElementsByTagName('a')
    removeActivation(items)

    for (let i = 0; i < items.length; ++i) {
      if (fullPath === items[i].pathname) {
        matchingMenuItem = items[i]
        break
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem)
    }
  }, [path, activateParentDropdown])

  useEffect(() => {
    ref.current.recalculate()
  }, [])

  useEffect(() => {
    new MetisMenu('#side-menu')
    activeMenu()
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    activeMenu()
  }, [activeMenu])

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: '100%' }} ref={ref}>
        <div id='sidebar-menu'>
          <ul className='metismenu list-unstyled' id='side-menu'>
            {isAdmin ? <AdminSidebarContent /> : <PharmacySidebarContent />}
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  )
}

export default SidebarContent
