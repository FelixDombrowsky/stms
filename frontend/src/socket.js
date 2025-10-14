// src/socket.js
import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: true,
  reconnection: true,
})

export default socket
