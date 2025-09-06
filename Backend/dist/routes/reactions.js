"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reactionService_1 = require("../services/reactionService");
const router = (0, express_1.Router)();
//@ts-ignore
router.post('/comment/like', async (req, res) => {
    try {
        const { comment_id, user_id } = req.body;
        if (!comment_id || !user_id) {
            return res.status(400).json({ error: 'Missing comment_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleCommentReaction(comment_id, user_id, true);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Comment like error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.post('/comment/dislike', async (req, res) => {
    try {
        const { comment_id, user_id } = req.body;
        if (!comment_id || !user_id) {
            return res.status(400).json({ error: 'Missing comment_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleCommentReaction(comment_id, user_id, false);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Comment dislike error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.post('/handle-shorts-reactions/like', async (req, res) => {
    try {
        const { video_id, user_id } = req.body;
        if (!video_id || !user_id) {
            return res.status(400).json({ error: 'Missing video_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleShortVideoReaction(video_id, user_id, true);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Short video like error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.post('/handle-shorts-reactions/dislike', async (req, res) => {
    try {
        const { video_id, user_id } = req.body;
        if (!video_id || !user_id) {
            return res.status(400).json({ error: 'Missing video_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleShortVideoReaction(video_id, user_id, false);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Short video dislike error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.post('/handle-long-video-reactions/like', async (req, res) => {
    try {
        const { video_id, user_id } = req.body;
        if (!video_id || !user_id) {
            return res.status(400).json({ error: 'Missing video_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleLongVideoReaction(video_id, user_id, true);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Long video like error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.post('/handle-long-video-reactions/dislike', async (req, res) => {
    try {
        const { video_id, user_id } = req.body;
        if (!video_id || !user_id) {
            return res.status(400).json({ error: 'Missing video_id or user_id' });
        }
        const result = await reactionService_1.ReactionService.handleLongVideoReaction(video_id, user_id, false);
        res.status(200).json({ message: `Reaction ${result.action}` });
    }
    catch (error) {
        console.error('Long video dislike error:', error);
        res.status(500).json({ error: 'Server Error' });
    }
});
//@ts-ignore
router.get('/shorts-reactions/summary/:video_id', async (req, res) => {
    try {
        const { video_id } = req.params;
        const { user_id } = req.query;
        if (!video_id) {
            return res.status(400).json({ error: 'Missing video_id' });
        }
        const summary = await reactionService_1.ReactionService.getShortVideoReactionSummary(video_id, user_id);
        res.status(200).json(summary);
    }
    catch (error) {
        console.error('Get short video reaction summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
//@ts-ignore
router.get('/long-videos-reactions/summary/:video_id', async (req, res) => {
    try {
        const { video_id } = req.params;
        const { user_id } = req.query;
        if (!video_id) {
            return res.status(400).json({ error: 'Missing video_id' });
        }
        const summary = await reactionService_1.ReactionService.getLongVideoReactionSummary(video_id, user_id);
        res.status(200).json(summary);
    }
    catch (error) {
        console.error('Get long video reaction summary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
