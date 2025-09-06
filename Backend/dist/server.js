"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
// Load environment variables
dotenv_1.default.config();
const httpServer = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(httpServer, {
    cors: { origin: '*' },
});
// WebSocket room management
function roomIdForUsers(a, b) {
    return [a, b].sort().join(':');
}
// WebSocket event handlers
io.on('connection', (socket) => {
    socket.on('authenticate', ({ userId }) => {
        if (!userId)
            return socket.disconnect();
        socket.data.userId = userId;
        socket.join(`user:${userId}`);
    });
    socket.on('join:room', async ({ otherUserId }) => {
        const myId = socket.data.userId;
        if (!myId)
            return;
        const room = roomIdForUsers(myId, otherUserId);
        socket.join(room);
        const { data, error } = await database_1.supabase
            .from('messages')
            .select('*')
            .eq('room', room)
            .order('created_at', { ascending: true });
        if (!error) {
            socket.emit('messages:recent', data);
        }
    });
    socket.on('message:send', async ({ to, text }, ack) => {
        const from = socket.data.userId;
        if (!from)
            return ack?.({ ok: false, error: 'Not authenticated' });
        const room = roomIdForUsers(from, to);
        const { data, error } = await database_1.supabase
            .from('messages')
            .insert([{ from_user: from, to_user: to, text, room }])
            .select()
            .single();
        if (error) {
            return ack?.({ ok: false, error: error.message });
        }
        io.to(room).emit('message:new', data);
        io.to(`user:${to}`).emit('message:push', data);
        ack?.({ ok: true, message: data });
    });
});
// Socket.io event handlers for post sharing
// This will be handled by the route, but we can add socket notifications here if needed
// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
