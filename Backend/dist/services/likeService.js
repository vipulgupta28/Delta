"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const database_1 = require("../config/database");
class LikeService {
    static async toggleLike(user_id, post_id) {
        // Check if like exists
        const { data, error } = await database_1.supabase
            .from("likes")
            .select("*")
            .eq("user_id", user_id)
            .eq("post_id", post_id)
            .maybeSingle();
        if (error)
            throw error;
        if (data) {
            const { error: delError } = await database_1.supabase
                .from("likes")
                .delete()
                .eq("user_id", user_id)
                .eq("post_id", post_id);
            if (delError)
                throw delError;
            return { liked: false };
        }
        else {
            // Like
            const { error: insertError } = await database_1.supabase
                .from("likes")
                .insert([{ user_id, post_id }]);
            if (insertError)
                throw insertError;
            return { liked: true };
        }
    }
    static async isLiked(user_id, post_id) {
        const { data, error } = await database_1.supabase
            .from("likes")
            .select("like_id")
            .eq("user_id", user_id)
            .eq("post_id", post_id)
            .maybeSingle();
        if (error)
            throw error;
        return { liked: !!data };
    }
    static async countLikes(post_id) {
        const { count, error } = await database_1.supabase
            .from("likes")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post_id);
        if (error)
            throw error;
        return { count };
    }
}
exports.LikeService = LikeService;
