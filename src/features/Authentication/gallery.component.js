import React, { useState, useEffect } from 'react'
import { Galleria } from 'primereact/galleria'

export default function Gallery() {
  const [images, setImages] = useState(null)
  const responsiveOptions = [
    {
      breakpoint: '991px',
      numVisible: 4,
    },
    {
      breakpoint: '767px',
      numVisible: 3,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ]

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((response) => response.json())
      .then((json) => {
        setImages(json.slice(0, 3))
        console.log(json.slice(0, 3))
      })
  }, [])

  const itemTemplate = (item) => {
    return (
      <img
        src={item.url}
        alt={item.title}
        style={{ width: '100%', display: 'block' }}
      />
    )
  }

  const caption = (item) => {
    return (
      <React.Fragment>
        <div className='text-xl mb-2 font-bold'>{item.title}</div>
        <p className='text-white'>{item.alt}</p>
      </React.Fragment>
    )
  }

  return (
    <Galleria
      value={images}
      item={itemTemplate}
      caption={caption}
      autoPlay
      transitionInterval={3000}
      style={{ position: 'cover' }}
    />
  )
}
