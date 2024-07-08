'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Chat() {
  const [socket,setSocket] = useState<WebSocket | null>(null)
  const searchParams = useSearchParams()
  const typeOfReq = searchParams.get("type");
  const roomId = searchParams.get("roomId");

  const submitHandler = () =>{
    try {
      
    } catch (error) {
      console.log(error);   
    }
  }

  useEffect(() =>{
    if (!roomId || !typeOfReq) return;
    const newSocket = new WebSocket(`ws://localhost:8000?roomId=${roomId}&type=${typeOfReq}`)

    newSocket.onopen = () =>{
        console.log("Connection is Established! : ", roomId);
        newSocket.send("Hello Server! This is the room ID : "+roomId)
    }

    newSocket.onmessage = (message) =>{
        const data = JSON.parse(message.data);
    }

    setSocket(newSocket)
    
    return () => newSocket.close();
}, [roomId, typeOfReq]);

  return (
    <div>
      <form action="" method="post" onClick={submitHandler}>
        <input type="text" name="message" id="message" placeholder="Type your message here..."/>
        <input type="submit" value="Send" />
      </form>
    </div>
  )
}
