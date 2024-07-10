'use client'
import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

export default function ClientCreateRoom() {
  const[roomId,setRoomId] = useState("");
  const router = useRouter()
  

  async function createRoomHandler(){
    try {
        const newRoomId = uuidv4(); 
        console.log(newRoomId);
        setRoomId(newRoomId)

        const res = await fetch('http://localhost:8000/api/create-room',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({roomId : newRoomId}),
          credentials: 'include',
        })

        if(!res.ok){
          throw new Error("Error Occured")
        }
        const data = await res.json()

        console.log("Created the room  : ",data);
        
        
        const url = new URL('/room', window.location.href);
        url.searchParams.append('roomId', newRoomId);
        router.push(url.toString());
    } catch (error) {
      console.log(error);
    }
  }

  async function joinRoomHandler(e : any){
    e.preventDefault();
    try {
      if(roomId){
        const res = await fetch('http://localhost:8000/api/join-room',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            roomId : roomId
          }),
          credentials: 'include',
        })

        if(!res.ok){
          throw new Error("Error Occured")
        }
        const data = await res.json()
        const url = new URL('/room', window.location.href);
        url.searchParams.append('roomId', roomId);
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
