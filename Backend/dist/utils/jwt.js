"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthCookie = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const createToken = (payload) => {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is undefined. Check your .env file.');
    }
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '5h' });
};
exports.createToken = createToken;
const setAuthCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true,
        secure: false, // true in production with HTTPS
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
};
exports.setAuthCookie = setAuthCookie;
