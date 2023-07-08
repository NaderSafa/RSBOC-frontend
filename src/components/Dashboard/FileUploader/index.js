import React, { useState } from 'react'

function FileUploader() {
  const [file, setFile] = useState(null)

  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0]
    const allowedFormats = ['jpg', 'png', 'gif'] // allowed file formats
    const fileExtension = selectedFile.name.split('.').pop()

    if (allowedFormats.includes(fileExtension)) {
      setFile(selectedFile)
    } else {
      alert(
        `File format not supported. Allowed formats: ${allowedFormats.join(
          ', '
        )}`
      )
    }
  }

  return (
    <div className='text-center py-3'>
      <input
        type='file'
        accept='.jpg,.png,.gif'
        onChange={handleFileUpload}
        className='btn btn-primary'
      />
      {file && <p>Selected file: {file.name}</p>}
    </div>
  )
}

export default FileUploader
