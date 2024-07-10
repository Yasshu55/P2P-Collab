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
exports.handleWebSocket = void 0;
const ws_1 = __importStar(require("ws"));
const url_1 = __importDefault(require("url"));
const rooms = new Map();
const handleWebSocket = (server) => {
    const wss = new ws_1.WebSocketServer({ server });
    wss.on("connection", (ws, req) => {
        const parameters = url_1.default.parse(req.url, true).query;
        const { roomId } = parameters;
        if (!roomId) {
            ws.send(JSON.stringify({ type: 'error', message: 'Room ID is required' }));
            ws.close();
            return;
        }
        if (!rooms.has(roomId)) {
            rooms.set(roomId, new Set());
        }
        const currentRoom = rooms.get(roomId);
        currentRoom.add({ ws });
        console.log(`Client connected to room: ${roomId}`);
        ws.on('message', (message) => {
            console.log(`Received message in room ${roomId}: `, message.toString());
            currentRoom === null || currentRoom === void 0 ? void 0 : currentRoom.forEach(client => {
                if (client.ws !== ws && client.ws.readyState === ws_1.default.OPEN) {
                    client.ws.send(message);
                }
            });
        });
        ws.on('error', console.error);
        ws.on('close', () => {
            console.log(`Client disconnected from room: ${roomId}`);
            currentRoom.forEach(client => {
                if (client.ws === ws) {
                    currentRoom.delete(client);
                }
            });
            if (currentRoom.size === 0) {
                rooms.delete(roomId);
            }
        });
    });
};
exports.handleWebSocket = handleWebSocket;
