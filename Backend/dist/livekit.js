"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createToken(identity, roomName) {
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
        throw new Error('LIVEKIT_API_KEY or LIVEKIT_API_SECRET is missing in .env');
    }
    if (!identity || !roomName) {
        throw new Error('Missing identity or roomName');
    }
    const token = new livekit_server_sdk_1.AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, {
        identity,
        // Optional: add TTL (time-to-live) for token
        ttl: 60 * 60, // 1 hour in seconds
    });
    token.addGrant({
        roomJoin: true,
        room: roomName,
    });
    return token.toJwt();
}
