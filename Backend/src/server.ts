import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { supabase } from './config/database';


// Load environment variables
dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

// WebSocket room management
function roomIdForUsers(a: string, b: string) {
  return [a, b].sort().join(':');
}

// WebSocket event handlers
io.on('connection', (socket) => {
  socket.on('authenticate', ({ userId }: { userId: string }) => {
    if (!userId) return socket.disconnect();
    socket.data.userId = userId;
    socket.join(`user:${userId}`);
  });

  socket.on('join:room', async ({ otherUserId }: { otherUserId: string }) => {
    const myId = socket.data.userId;
    if (!myId) return;
    const room = roomIdForUsers(myId, otherUserId);
    socket.join(room);

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room', room)
      .order('created_at', { ascending: true });

    if (!error) {
      socket.emit('messages:recent', data);
    }
  });

  socket.on(
    'message:send',
    async (
      { to, text }: { to: string; text: string },
      ack?: (res: any) => void
    ) => {
      const from = socket.data.userId;
      if (!from) return ack?.({ ok: false, error: 'Not authenticated' });

      const room = roomIdForUsers(from, to);

      const { data, error } = await supabase
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
    }
  );
});

// Socket.io event handlers for post sharing
// This will be handled by the route, but we can add socket notifications here if needed

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
