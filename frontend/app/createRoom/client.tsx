'use client'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function ClientCreateRoom() {
  const[roomId,setRoomId] = useState("");
  const router = useRouter()
  let type = null;
  

  function createRoomHandler(){
    try {
        type = "create"
        const roomID = uuidv4(); 
        console.log(roomID);
        setRoomId(roomID)

        const url = new URL('/room', window.location.href);
        url.searchParams.append('roomId', roomID);
        url.searchParams.append('type', type);
        router.push(url.toString());
    } catch (error) {
      console.log(error);
    }
  }

  function joinRoomHandler(e : any){
    e.preventDefault();
    try {
      if(roomId){
        type = "join"
        const url = new URL('/room', window.location.href);
        url.searchParams.append('roomId', roomId);
        url.searchParams.append('type', type);
    
        router.push(url.toString());
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <button onClick={createRoomHandler}>Create a Room</button>
      <form onSubmit={joinRoomHandler}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
        />
        <button type="submit" >Join a Room</button>
      </form>
    </div>
  )
}
