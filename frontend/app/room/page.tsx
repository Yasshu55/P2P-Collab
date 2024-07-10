import Room from '@/app/components/Room'
import React from 'react'
import Chat from '../components/Chat'
import { WebSocketProvider } from '../components/WebSocketProvider'

export default function Rooms() {
  return (
    <div>
        <WebSocketProvider>
          <Room />
          <Chat />
        </WebSocketProvider>
    </div>
  )
}
