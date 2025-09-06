"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token' });
    }
    try {
        const data = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = data;
        next();
    }
    catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        try {
            const data = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            req.user = data;
        }
        catch (err) {
            // Token is invalid, but we continue without authentication
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
