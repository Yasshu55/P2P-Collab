'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import Whiteboard from "./Whiteboard";
export default function Room() {
    const [socket,setSocket] = useState<WebSocket | null>(null)
    const searchParams = useSearchParams()
    const typeOfReq = searchParams.get("type");
    const roomId = searchParams.get("roomId");
    const router = useRouter()

    useEffect(() =>{
        if (!roomId || !typeOfReq) return;
        const newSocket = new WebSocket(`ws://localhost:8000?roomId=${roomId}&type=${typeOfReq}`)

        newSocket.onopen = () =>{
            console.log("Connection is Established! : ", roomId);
            newSocket.send("Hello Server! This is the room ID : "+roomId)
        }

        newSocket.onmessage = (message) =>{
            const data = JSON.parse(message.data);
            console.log("type : ", data.type)
            console.log("message :",message.data.message)

            if(data.type === 'error'){
                router.push('/error')
            }
            console.log("Message Received : ",message.data)
        }

        setSocket(newSocket)
        
        return () => newSocket.close();
    }, [roomId, typeOfReq]);

    if (!roomId) {
        return <div>Loading...</div>;
    }
  return (
    <div>
        <h1>Room ID : {socket?roomId: "Not Connected"}</h1>
        {/* <Whiteboard roomId={roomId}/> */}
    </div>
  )
}
