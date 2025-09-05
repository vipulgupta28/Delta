import { Router, Request, Response } from 'express';
import { CommentService } from '../services/commentService';

const router = Router();

// Short video comments
router.post('/handle-shorts-comments', async (req: Request, res: Response) => {
  try {
    const { username, user_id, video_id, content, parent_comment_id } = req.body;

    const comment = await CommentService.addShortVideoComment({
      username,
      user_id,
      video_id,
      content,
      parent_comment_id,
    });

    res.status(200).json({
      message: 'Comment inserted successfully',
      comment,
    });
  } catch (error) {
    console.error('Add short video comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//@ts-ignore
router.post("/comment/:post_id", async (req: Request, res: Response) => {
  const { post_id } = req.params;
  const { user_id, commentContent, username, parent_comment_id } = req.body;

  if (!user_id || !commentContent || !post_id) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // ✅ Option A: use CommentService wrapper
    const data = await CommentService.addPostsComments({
      post_id,
      user_id,
      commentContent,
      username,
      parent_comment_id: parent_comment_id || null,
    });

    return res.status(200).json({
      message: "Comment inserted successfully",
      comment: data,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//@ts-ignore
router.get("/comments/:post_id", async (req: Request, res: Response) => {
  const { post_id } = req.params;

  try {
    // ✅ Option A: use CommentService wrapper
    const data = await CommentService.getPostsComments(post_id);

    return res.status(200).json(data);
  } catch (err) {
    console.error("Fetch comments error:", err);
    return res.status(500).json({ message: "Error fetching comments" });
  }
});





router.get('/fetch-shorts-comments/:video_id', async (req: Request, res: Response) => {
  try {
    const { video_id } = req.params;
    const comments = await CommentService.getShortVideoComments(video_id);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get short video comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Long video comments
router.post('/handle-long-comments', async (req: Request, res: Response) => {
  try {
    const { username, user_id, video_id, content, parent_comment_id } = req.body;

    const comment = await CommentService.addLongVideoComment({
      username,
      user_id,
      video_id,
      content,
      parent_comment_id,
    });

    res.status(200).json({
      message: 'Comment inserted successfully',
      comment,
    });
  } catch (error) {
    console.error('Add long video comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/fetch-long-comments/:video_id', async (req: Request, res: Response) => {
  try {
    const { video_id } = req.params;
    const comments = await CommentService.getLongVideoComments(video_id);
    res.status(200).json(comments);
  } catch (error) {
    console.error('Get long video comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

export default router;
