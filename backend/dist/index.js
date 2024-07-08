"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
const ws_1 = require("./handlers/ws");
const routers_1 = __importDefault(require("./router/routers"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api', routers_1.default);
const httpServer = app.listen(8000, () => {
    console.log(`Server is running on port ${PORT}`);
});
const PORT = process.env.PORT || 8000;
(0, db_1.default)();
(0, ws_1.handleWebSocket)(httpServer);
