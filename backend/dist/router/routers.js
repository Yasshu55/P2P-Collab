"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../db/models/User"));
const Room_1 = __importDefault(require("../db/models/Room"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthMiddleware_1 = require("../utils/AuthMiddleware");
const router = (0, express_1.Router)();
router.post('/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        console.log(username, " ", email, " ", password);
        const userExists = yield User_1.default.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = new User_1.default({
            username: username,
            email: email,
            password: hashedPassword
        });
        yield user.save();
        console.log("Signed up successfully!");
        return res.status(200).json({ message: "User created successfully" });
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/sign-in', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, " ", password);
        const user = yield User_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Password is incorrect" });
        }
        console.log("Signed in successfully!");
        const token = yield (0, AuthMiddleware_1.generateToken)(user);
        return res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' })
            .status(200)
            .json({ message: "User authenticated successfully", user });
    }
    catch (error) {
        console.log(error);
    }
}));
// Here put a authMiddleware to verify the user
router.post('/create-room', AuthMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { roomId } = req.body;
        console.log("Create Room api - Room ID : " + roomId);
        const roomExists = yield Room_1.default.findOne({ roomId });
        if (roomExists) {
            return res.status(400).json({ message: "Room already exists" });
        }
        const newRoom = new Room_1.default({ roomId, users: [] });
        yield newRoom.save();
        console.log("Room created successfully!");
        return res.status(200).json({ message: "Room created successfully" });
    }
    catch (error) {
        console.log(error);
    }
}));
router.post('/join-room', AuthMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { roomId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        console.log("Join room api - RoomId : " + roomId + " UserID : " + userId);
        const room = yield Room_1.default.findOne({ roomId });
        if (!room) {
            return res.status(400).json({ message: "Room does not exists" });
        }
        if (!room.users.includes(userId)) {
            room.users.push(userId);
            yield room.save();
        }
        return res.status(200).json({ message: "User joined room successfully", roomId });
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
