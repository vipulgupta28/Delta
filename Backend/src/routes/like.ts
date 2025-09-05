import { Router } from "express";
import { LikeService } from "../services/likeService";

const router = Router();

router.post("/likes", async (req, res) => {
  const { user_id, post_id } = req.body;

  try {
    const result = await LikeService.toggleLike(user_id, post_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ error: "Failed to toggle like" });
  }
});

router.get("/likes/:postId", async (req, res) => {
  const { postId } = req.params;
  const { user_id } = req.query as { user_id: string };

  try {
    const result = await LikeService.isLiked(user_id, postId);
    res.status(200).json(result);
  } catch (err) {
    console.error("Fetch like status error:", err);
    res.status(500).json({ error: "Failed to fetch like status" });
  }
});

router.get("/likes/count/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
    const result = await LikeService.countLikes(post_id);
    res.status(200).json(result);
  } catch (err) {
    console.error("Fetch like count error:", err);
    res.status(500).json({ error: "Failed to fetch like count" });
  }
});

export default router;
