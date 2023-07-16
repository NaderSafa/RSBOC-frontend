import axios from 'axios'

// COMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
const IP = 'rsboc-backend.vercel.app'
const API_URL = `https://${IP}/api`

// UNCOMMENT NEXT 2 LINES TO SWITCH TO LOCAL BACKEND
// const IP = 'localhost:8080'
// const API_URL = `http://${IP}/api`

export { API_URL }

// Return a custom axios instance
const server = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('SPEEDBALL_HUB::TOKEN')}`,
  },
})

export default server
