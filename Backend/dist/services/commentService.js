"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const database_1 = require("../config/database");
class CommentService {
    static async addShortVideoComment(data) {
        const { username, user_id, video_id, content, parent_comment_id } = data;
        if (!user_id || !content || !video_id) {
            throw new Error('Missing required fields');
        }
        const { data: comment, error } = await database_1.supabase
            .from('short_videos_comments')
            .insert([{
                short_video_id: video_id,
                user_id,
                content,
                username,
                parent_comment_id: parent_comment_id || null,
            }])
            .select()
            .single();
        if (error)
            throw error;
        return comment;
    }
    static async addLongVideoComment(data) {
        const { username, user_id, video_id, content, parent_comment_id } = data;
        if (!user_id || !content || !video_id) {
            throw new Error('Missing required fields');
        }
        const { data: comment, error } = await database_1.supabase
            .from('long_videos_comments')
            .insert([{
                long_video_id: video_id,
                user_id,
                content,
                username,
                parent_comment_id: parent_comment_id || null,
            }])
            .select()
            .single();
        if (error)
            throw error;
        return comment;
    }
    static async getShortVideoComments(videoId) {
        const { data, error } = await database_1.supabase
            .from('short_videos_comments')
            .select(`
        comment_id,
        content,
        created_at,
        user_id,
        short_video_id,
        username,
        parent_comment_id,
        profiles (
          profile_img
        )
      `)
            .eq('short_video_id', videoId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    static async getLongVideoComments(videoId) {
        const { data, error } = await database_1.supabase
            .from('long_videos_comments')
            .select(`
        comment_id,
        content,
        created_at,
        user_id,
        long_video_id,
        username,
        parent_comment_id,
        profiles (
          profile_img
        )
      `)
            .eq('long_video_id', videoId)
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data;
    }
    static async getPostsComments(post_id) {
        const { data, error } = await database_1.supabase
            .from("comments")
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
            .eq("post_id", post_id)
            .order("created_at", { ascending: true });
        if (error)
            throw error;
        return data;
    }
    static async addPostsComments({ post_id, user_id, commentContent, username, parent_comment_id = null }) {
        const { data, error } = await database_1.supabase
            .from("comments")
            .insert([{
                post_id,
                user_id,
                content: commentContent,
                username,
                parent_comment_id
            }])
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
}
exports.CommentService = CommentService;
