"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const videoService_1 = require("../services/videoService");
const upload_1 = require("../config/upload");
const router = (0, express_1.Router)();
//@ts-ignore
router.post('/store-content', upload_1.upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const { title, description, userId } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ error: 'Title, description, and userId are required.' });
        }
        const publicUrl = await videoService_1.VideoService.uploadVideo(req.file, {
            title,
            description,
            userId,
        });
        res.status(200).json({ publicUrl });
    }
    catch (error) {
        console.error('Upload Failed:', error);
        res.status(500).json({ error: 'File upload failed.' });
    }
});
//@ts-ignore
router.post('/store-short-content', upload_1.upload.single('video'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        const { title, description, userId } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ error: 'Title, description, and userId are required.' });
        }
        const publicUrl = await videoService_1.VideoService.uploadShortVideo(req.file, {
            title,
            description,
            userId,
        });
        res.status(200).json({ publicUrl });
    }
    catch (error) {
        console.error('Upload Failed:', error);
        res.status(500).json({ error: 'File upload failed.' });
    }
});
// Get user videos
router.get('/get-videos/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const videos = await videoService_1.VideoService.getUserVideos(userId);
        res.status(200).json(videos);
    }
    catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
// Get all videos
router.get('/get-videos', async (req, res) => {
    try {
        const videos = await videoService_1.VideoService.getAllVideos();
        res.status(200).json(videos);
    }
    catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
// Get all short videos
router.get('/get-short-videos', async (req, res) => {
    try {
        const videos = await videoService_1.VideoService.getAllShortVideos();
        res.status(200).json(videos);
    }
    catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
});
exports.default = router;
