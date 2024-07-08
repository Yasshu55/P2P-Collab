import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import runDb from "./db/db";
import { handleWebSocket } from "./handlers/ws";
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const httpServer = app.listen(8000,() => {
    console.log(`Server is running on port ${PORT}`)
})

const PORT = process.env.PORT || 8000


runDb()
handleWebSocket(httpServer)