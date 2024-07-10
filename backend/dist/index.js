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
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use('/api', routers_1.default);
const httpServer = http_1.default.createServer(app);
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
(0, db_1.default)();
(0, ws_1.handleWebSocket)(httpServer);
