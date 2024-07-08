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
const router = (0, express_1.Router)();
router.post('/sign-up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        console.log(username, " ", email, " ", password);
        const userExists = yield User_1.default.findOne({ email: email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }
        const user = new User_1.default({
            username: username,
            email: email,
            password: password
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
        if (user.password !== password) {
            res.status(400).json({ message: "Password is incorrect" });
        }
        console.log("Signed up successfully!");
        return res.status(200).json({ message: "User authenticated successfully", user });
    }
    catch (error) {
        console.log(error);
    }
}));
exports.default = router;
