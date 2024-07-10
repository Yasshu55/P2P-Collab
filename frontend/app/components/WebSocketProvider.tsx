'use client'
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface WebSocketContextValue{
    socket : WebSocket | null
}

const WebSocketContext = createContext<WebSocketContextValue | undefined>(undefined)

export const WebSocketProvider = ({children} : {children : ReactNode}) =>{
    try {
        const [socket,setSocket] = useState<WebSocket | null>(null)

        useEffect(() =>{
            const searchParams = new URLSearchParams(window.location.search)
            const roomId = searchParams.get('roomId')
            if(!roomId) return;

            console.log("Attempting to connect to WebSocket with roomId:", roomId);
            const newSocket = new WebSocket(`ws://localhost:8000?roomId=${roomId}`);
            newSocket.onopen = () => {
                console.log("Connection established: ", roomId);
                newSocket.send("Hello Server! This is the room ID: " + roomId);
            };
    
            newSocket.onmessage = (message) => {
                console.log("Message received from backend: ", message.data);
            };

            newSocket.onerror = (error) => {
              console.error("WebSocket error:", error);
            };
    
            newSocket.onclose = (event) => {
                console.log("WebSocket connection closed:", event.reason);
            };
    
            setSocket(newSocket);
    
            return () => {
              console.log("Closing WebSocket connection");
              newSocket.close();
          };
        },[])

        return (
            <WebSocketContext.Provider value={{ socket }}>
                {children}
            </WebSocketContext.Provider>
        );
    } catch (error) {
     console.log("Error in wsProvider : ",error);
    }
}

export const useWebSocket = (): WebSocketContextValue => {
    const context = useContext(WebSocketContext);
    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
};