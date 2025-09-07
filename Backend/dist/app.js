"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const videos_1 = __importDefault(require("./routes/videos"));
const comments_1 = __importDefault(require("./routes/comments"));
const comments_2 = __importDefault(require("./routes/comments"));
const websocket_1 = __importDefault(require("./routes/websocket"));
const posts_1 = __importDefault(require("./routes/posts"));
const profile_1 = __importDefault(require("./routes/profile"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/v1', auth_1.default);
app.use('/api/v1', videos_1.default);
app.use('/api/v1', comments_1.default);
app.use('/api/v1', comments_2.default);
app.use('/api/v1', posts_1.default);
app.use('/api/v1', profile_1.default);
app.use('/api/v1', websocket_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ error: 'Internal server error' });
});
exports.default = app;
