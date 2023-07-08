// const axios = require('axios').default
import axios from 'axios'

// COMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
const IP = 'api.padashboard.ca'
const API_URL = `https://${IP}`

// UNCOMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
// const IP = 'localhost:8000'
// const API_URL = `http://${IP}`

export { API_URL }

// Return a custom axios instance
const server = axios.create({
  baseURL: `${API_URL}`,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
})

export default server
