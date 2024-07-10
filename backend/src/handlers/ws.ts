import WebSocket, { WebSocketServer } from 'ws';
import { Request, Response } from 'express';
import url from 'url'

interface Client {
    ws: WebSocket;
}

const rooms = new Map<string, Set<Client>>();

export const handleWebSocket = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws : WebSocket, req : Request) => {
        const parameters = url.parse(req.url, true).query as unknown as { roomId: string };
        const { roomId  } = parameters;

        if (!roomId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room ID is required' }));
            ws.close();
            return;
        }

        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
    
        const currentRoom = rooms.get(roomId);
        currentRoom!.add({ ws });

        console.log(`Client connected to room: ${roomId}`);
        
        ws.on('message', (message) => {
            console.log(`Received message in room ${roomId}: `, message.toString());
            currentRoom?.forEach(client =>{
                if (client.ws !== ws && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(message);
                }
            })
        });
        
        ws.on('error', console.error);
        ws.on('close', () => {
            console.log(`Client disconnected from room: ${roomId}`);
            currentRoom!.forEach(client => {
                if (client.ws === ws) {
                    currentRoom!.delete(client);
                }
            });
            if (currentRoom!.size === 0) {
                rooms.delete(roomId);
            }
        });
    });
};