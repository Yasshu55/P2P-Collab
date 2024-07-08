import WebSocket, { WebSocketServer } from 'ws';
import { Request, Response } from 'express';
import url from 'url'

interface ParsedUrl {
    roomId: string;
    type: string;
}

const rooms = new Map<string, Set<WebSocket>>();

export const handleWebSocket = (server: any) => {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req : Request) => {
        const parameters = url.parse(req.url, true).query as unknown as ParsedUrl;
        const { roomId, type } = parameters;

        if (!roomId) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Invalid room ID' }));
        }

        if (!type) {
            return ws.send(JSON.stringify({ type: 'error', message: 'Invalid type, either create a room or join' }));
        }

        console.log("Room ID received:", roomId);
        console.log("Type received:", type);

        if (type === 'create' && !rooms.has(roomId)) {
            console.log("Entered Create");
            rooms.set(roomId, new Set());
        } else if (type === 'join') {
            if (!rooms.has(roomId)) {
                console.log("Entered join");
                return ws.send(JSON.stringify({ type: 'error', message: 'Room does not exist' }));
            }
        } else {
            return ws.send(JSON.stringify({ type: 'error', message: 'Invalid operation type' }));
        }

        const room = rooms.get(roomId)!;
        room.add(ws);
        ws.on('error', console.error);

        ws.on('message', (data, isBinary) => {
            room.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            });
        });

        ws.on('close', () => {
            room.delete(ws);
            if (room.size === 0) {
                rooms.delete(roomId);
            }
        });
    });
};