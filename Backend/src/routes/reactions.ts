import { Router, Request, Response } from 'express';
import { ReactionService } from '../services/reactionService';

const router = Router();

//@ts-ignore
router.post('/comment/like', async (req: Request, res: Response) => {
  try {
    const { comment_id, user_id } = req.body;

    if (!comment_id || !user_id) {
      return res.status(400).json({ error: 'Missing comment_id or user_id' });
    }

    const result = await ReactionService.handleCommentReaction(comment_id, user_id, true);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Comment like error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.post('/comment/dislike', async (req: Request, res: Response) => {
  try {
    const { comment_id, user_id } = req.body;

    if (!comment_id || !user_id) {
      return res.status(400).json({ error: 'Missing comment_id or user_id' });
    }

    const result = await ReactionService.handleCommentReaction(comment_id, user_id, false);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Comment dislike error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.post('/handle-shorts-reactions/like', async (req: Request, res: Response) => {
  try {
    const { video_id, user_id } = req.body;

    if (!video_id || !user_id) {
      return res.status(400).json({ error: 'Missing video_id or user_id' });
    }

    const result = await ReactionService.handleShortVideoReaction(video_id, user_id, true);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Short video like error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.post('/handle-shorts-reactions/dislike', async (req: Request, res: Response) => {
  try {
    const { video_id, user_id } = req.body;

    if (!video_id || !user_id) {
      return res.status(400).json({ error: 'Missing video_id or user_id' });
    }

    const result = await ReactionService.handleShortVideoReaction(video_id, user_id, false);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Short video dislike error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.post('/handle-long-video-reactions/like', async (req: Request, res: Response) => {
  try {
    const { video_id, user_id } = req.body;

    if (!video_id || !user_id) {
      return res.status(400).json({ error: 'Missing video_id or user_id' });
    }

    const result = await ReactionService.handleLongVideoReaction(video_id, user_id, true);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Long video like error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.post('/handle-long-video-reactions/dislike', async (req: Request, res: Response) => {
  try {
    const { video_id, user_id } = req.body;

    if (!video_id || !user_id) {
      return res.status(400).json({ error: 'Missing video_id or user_id' });
    }

    const result = await ReactionService.handleLongVideoReaction(video_id, user_id, false);
    res.status(200).json({ message: `Reaction ${result.action}` });
  } catch (error) {
    console.error('Long video dislike error:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

//@ts-ignore
router.get('/shorts-reactions/summary/:video_id', async (req: Request, res: Response) => {
  try {
    const { video_id } = req.params;
    const { user_id } = req.query;

    if (!video_id) {
      return res.status(400).json({ error: 'Missing video_id' });
    }

    const summary = await ReactionService.getShortVideoReactionSummary(
      video_id,
      user_id as string
    );

    res.status(200).json(summary);
  } catch (error) {
    console.error('Get short video reaction summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//@ts-ignore
router.get('/long-videos-reactions/summary/:video_id', async (req: Request, res: Response) => {
  try {
    const { video_id } = req.params;
    const { user_id } = req.query;

    if (!video_id) {
      return res.status(400).json({ error: 'Missing video_id' });
    }

    const summary = await ReactionService.getLongVideoReactionSummary(
      video_id,
      user_id as string
    );

    res.status(200).json(summary);
  } catch (error) {
    console.error('Get long video reaction summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
