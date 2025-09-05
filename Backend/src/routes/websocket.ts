import { Router, Request, Response } from 'express';
import { supabase } from '../config/database';
import { createToken } from '../createToken';

const router = Router();


//@ts-ignore
router.get('/messages', async (req: Request, res: Response) => {
  const { me, other } = req.query;
  if (!me || !other) {
    return res.status(400).json({ error: 'Missing user IDs' });
  }

  const room = [me as string, other as string].sort().join(':');

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('room', room)
    .order('created_at', { ascending: true });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Share post endpoint
//@ts-ignore
router.post('/sharePost', async (req: Request, res: Response) => {
  const { sender_id, receiver_ids, post_id } = req.body;

  if (!sender_id || !receiver_ids?.length || !post_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert share records
    const shares = receiver_ids.map((rid: string) => ({
      sender_id,
      receiver_id: rid,
      post_id,
    }));

    const { data, error } = await supabase
      .from('shared_posts')
      .insert(shares)
      .select();

    if (error) throw error;

    // Note: Socket.io notifications will be handled in server.ts
    // since we need access to the io instance

    const postData = await supabase
      .from('posts')
      .select('*')
      .eq('post_id', post_id)
      .single();

    res.json({ ok: true, shared: data, post_data: postData.data });
  } catch (err: any) {
    console.error('Error sharing post:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
