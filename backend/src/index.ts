import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import runDb from "./db/db";
import { handleWebSocket } from "./handlers/ws";
import router from "./router/routers";
import http from 'http';
import cookieParser from "cookie-parser";
dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}))
app.use('/api', router);

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

runDb()
handleWebSocket(httpServer)