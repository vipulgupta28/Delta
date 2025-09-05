import { Router, Request, Response } from 'express';
import { supabase } from '../config/database';
import { upload } from '../config/upload';

const router = Router();

//@ts-ignore
router.post('/store-posts', upload.array('media'), async (req: Request, res: Response) => {
  const { headline, content, user_id, selectedCategory, username } = req.body;
  const files = req.files as Express.Multer.File[];

  const mediaUrls = [];

  try {
    // 1. Upload each file to Supabase Storage
    for (const file of files) {
      const ext = file.originalname.split('.').pop();
      const filePath = `${user_id}/${Date.now()}_${Math.random().toString(36).substring(2)}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return res.status(500).json({ error: 'Media upload failed' });
      }

      // 2. Get public URL of uploaded file
      const { data: urlData } = supabase
        .storage
        .from('post-media')
        .getPublicUrl(filePath);

      mediaUrls.push(urlData.publicUrl);
    }

    // 3. Insert post with uploaded media URLs
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title: headline,
          content,
          user_id,
          username,
          category: selectedCategory,
          media: mediaUrls, // ✅ array of image/video URLs
        },
      ])
      .select();

      console.log("✅ postsRoutes loaded");


    if (error) {
      console.error('DB insert error:', error);
      return res.status(500).json({ error: 'Failed to store post' });
    }

    res.status(200).json({ data });

  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get posts
router.get('/get-posts', async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    let query = supabase
      .from('posts')
      .select(
        `
        *,
        profiles (
          profile_img
        )
        `
      )
      .order('created_at', { ascending: false });

    // ✅ Add category filter if category is provided
    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get user posts
router.get('/get-userposts/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId) // assuming the column name is user_id
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Handle likes
//@ts-ignore
router.post('/likes', async (req: Request, res: Response) => {
  const { user_id, post_id } = req.body;

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user_id)
    .eq('post_id', post_id)
    .single();

  if (data) {
    // Unlike
    await supabase
      .from('likes')
      .delete()
      .eq('user_id', user_id)
      .eq('post_id', post_id);

    return res.status(200).json({ liked: false });
  } else {
    // Like
    await supabase
      .from('likes')
      .insert([{ user_id, post_id }]);

    return res.status(200).json({ liked: true });
  }
});

// Get like status
router.get('/likes/:postId', async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { user_id } = req.query;

  try {
    const { data, error } = await supabase
      .from('likes')
      .select('like_id')
      .eq('user_id', user_id)
      .eq('post_id', postId)
      .maybeSingle();

    if (error) throw error;

    res.status(200).json({ liked: !!data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch like status' });
  }
});

// Get like count
//@ts-ignore
router.get('/likes/count/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params;

  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', post_id);

  if (error) {
    return res.status(500).json({ error: 'Failed to fetch like count' });
  }

  res.status(200).json({ count });
});

// Add comment to post
//@ts-ignore
router.post('/comment/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const { user_id, commentContent, username, parent_comment_id } = req.body;

  if (!user_id || !commentContent || !post_id) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        post_id,
        user_id,
        content: commentContent,
        username,
        parent_comment_id: parent_comment_id || null
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      message: 'Comment inserted successfully',
      comment: data,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get comments for post
//@ts-ignore
router.get('/comments/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        comment_id,
        content,
        created_at,
        user_id,
        post_id,
        username,
        parent_comment_id,
        profiles (
          profile_img
        )
      `)
      .eq('post_id', post_id)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching comments' });
  }
});

export default router;
