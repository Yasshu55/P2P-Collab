'use client'

import { useEffect, useState } from "react"
import { useSearchParams } from 'next/navigation'
import Whiteboard from "./Whiteboard";
import { useWebSocket } from "./WebSocketProvider";
export default function Room() {
    const {socket} = useWebSocket()
    const searchParams = useSearchParams()
    const [roomId,setRoomId] = useState<string | null>(null)
    const [isConnecting, setIsConnecting] = useState(true)

    useEffect(() => {
        const paramsRoomId = searchParams.get("roomId");
        console.log("Current socket state:", socket ? "Connected" : "Not connected");
        setRoomId(paramsRoomId);

        if (socket) {
          setIsConnecting(false);
        }
    }, [searchParams,socket]);

    if (!roomId) {
        return <div>Loading...</div>;
     }

    if (isConnecting) {
      return <div>Connecting to room...</div>;
     }
  return (
    <div>
        <h1>Room ID : {socket?roomId: "Not Connected"}</h1>
        {/* <Whiteboard roomId={roomId}/> */}
    </div>
  )
}
