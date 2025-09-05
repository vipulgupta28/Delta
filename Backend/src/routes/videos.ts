import { Router, Request, Response } from 'express';
import { VideoService } from '../services/videoService';
import { upload } from '../config/upload';

const router = Router();

//@ts-ignore
router.post('/store-content', upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: 'Title, description, and userId are required.' });
    }

    const publicUrl = await VideoService.uploadVideo(req.file, {
      title,
      description,
      userId,
    });

    res.status(200).json({ publicUrl });
  } catch (error) {
    console.error('Upload Failed:', error);
    res.status(500).json({ error: 'File upload failed.' });
  }
});

//@ts-ignore
router.post('/store-short-content', upload.single('video'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const { title, description, userId } = req.body;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: 'Title, description, and userId are required.' });
    }

    const publicUrl = await VideoService.uploadShortVideo(req.file, {
      title,
      description,
      userId,
    });

    res.status(200).json({ publicUrl });
  } catch (error) {
    console.error('Upload Failed:', error);
    res.status(500).json({ error: 'File upload failed.' });
  }
});

// Get user videos
router.get('/get-videos/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const videos = await VideoService.getUserVideos(userId);
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get all videos
router.get('/get-videos', async (req: Request, res: Response) => {
  try {
    const videos = await VideoService.getAllVideos();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get all short videos
router.get('/get-short-videos', async (req: Request, res: Response) => {
  try {
    const videos = await VideoService.getAllShortVideos();
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

export default router;
