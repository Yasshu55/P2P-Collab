'use client'
import React, {useEffect, useState} from 'react'
import { useWebSocket } from './WebSocketProvider';
export default function Chat() {
  const {socket}  = useWebSocket()
  const [message,setMessage] = useState<string>("");

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("SubmitHandler Entered");
    
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ message }));
        console.log("Message sent! ");
        
        setMessage("");
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input type="text" name="message" id="message" placeholder="Type your message here..." onChange={(e) => setMessage(e.target.value)}/>
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
