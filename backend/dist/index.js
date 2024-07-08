"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importStar(require("ws"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const url_1 = __importDefault(require("url"));
const db_1 = __importDefault(require("./db/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const httpServer = app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`);
});
const PORT = process.env.PORT || 8000;
(0, db_1.default)();
const wss = new ws_1.WebSocketServer({ server: httpServer });
const rooms = new Map();
wss.on("connection", function connection(ws, req) {
    const parameters = url_1.default.parse(req.url, true);
    const roomId = parameters.query.roomId;
    const type = parameters.query.type;
    console.log("Room ID received : ", roomId);
    console.log("Type received : ", type);
    if (type === 'create') {
        if (!rooms.has(roomId)) {
            console.log("Entered Create");
            rooms.set(roomId, new Set());
        }
    }
    if (type === 'join') {
        if (!rooms.has(roomId)) {
            console.log("Entered join");
            return ws.send(JSON.stringify({ type: 'error', message: 'Room does not exist' }));
        }
    }
    const room = rooms.get(roomId);
    console.log("All rooms : ", rooms.keys());
    // console.log("Current Room values : ",room);
    room.add(ws);
    ws.on('error', console.error);
    ws.on('message', (data, isBinary) => {
        room.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
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
