import { supabase } from "../config/database";

export class LikeService {
  static async toggleLike(user_id: string, post_id: string) {
    // Check if like exists
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("user_id", user_id)
      .eq("post_id", post_id)
      .maybeSingle();

    if (error) throw error;

    if (data) {
      const { error: delError } = await supabase
        .from("likes")
        .delete()
        .eq("user_id", user_id)
        .eq("post_id", post_id);

      if (delError) throw delError;
      return { liked: false };
    } else {
      // Like
      const { error: insertError } = await supabase
        .from("likes")
        .insert([{ user_id, post_id }]);

      if (insertError) throw insertError;
      return { liked: true };
    }
  }

  static async isLiked(user_id: string, post_id: string) {
    const { data, error } = await supabase
      .from("likes")
      .select("like_id")
      .eq("user_id", user_id)
      .eq("post_id", post_id)
      .maybeSingle();

    if (error) throw error;
    return { liked: !!data };
  }

  static async countLikes(post_id: string) {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true })
      .eq("post_id", post_id);

    if (error) throw error;
    return { count };
  }
}
