// const axios = require('axios').default
import axios from 'axios'

// COMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
// const IP = 'rsboc-backend.vercel.app/api'
// const API_URL = `https://${IP}`

// UNCOMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
const IP = 'localhost:8080'
const API_URL = `http://${IP}/api`

export { API_URL }

// Return a custom axios instance
const server = axios.create({
  baseURL: 'https://rsboc-backend.vercel.app/api',
  // baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
  },
})

export default server
