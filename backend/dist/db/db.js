"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
function runDb() {
    const uri = process.env.MONGO_URL || "";
    console.log(uri);
    mongoose_1.default.connect(uri);
    const db = mongoose_1.default.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
        console.log('Connected to MongoDB');
    });
    db.on('disconnected', () => {
        console.log('Disconnected from MongoDB');
    });
}
exports.default = runDb;
