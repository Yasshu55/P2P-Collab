import express from "express"
import WebSocket, { WebSocketServer } from 'ws';
import dotenv from "dotenv"
import cors from "cors"
import url from 'url'
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const httpServer = app.listen(8000,() => {
    console.log(`Server is running on port ${PORT}`)
})

const PORT = process.env.PORT || 8000
const wss = new WebSocketServer({server : httpServer})
const rooms = new Map()

wss.on("connection", function connection(ws,req : any){
   
    const parameters = url.parse(req.url, true);
    const roomId = parameters.query.roomId;
    const type = parameters.query.type;
    console.log("Room ID received : ",roomId);
    console.log("Type received : ",type);

    if(type === 'create'){
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
    }

    if(type === 'join'){
        if (!rooms.has(roomId)) {
            return ws.send(JSON.stringify({type: 'error', message: 'Room does not exist'}));
        }
    }
        const room = rooms.get(roomId)
        room.add(ws)
        console.log(rooms);
        
        
        ws.on('error',console.error)
        
        
        ws.on('message', (data) => {
            room.forEach((client : any) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    console.log("Data : ",data);
                    // client.send(data);
                }
            });
    });

    ws.on('close', () => {
        room.delete(ws);
        if (room.size === 0) {
          rooms.delete(roomId);
        }
    });
})
