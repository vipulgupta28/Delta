"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
const livekit_server_sdk_1 = require("livekit-server-sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function createToken(identity, roomName, role) {
    const token = new livekit_server_sdk_1.AccessToken(process.env.LIVEKIT_API_KEY, process.env.LIVEKIT_API_SECRET, { identity });
    const grant = {
        roomJoin: true,
        room: roomName,
    };
    if (role === 'viewer') {
        grant.canSubscribe = true;
        grant.canPublish = false;
    }
    else {
        grant.canSubscribe = true;
        grant.canPublish = true;
    }
    token.addGrant(grant);
    return token.toJwt();
}
