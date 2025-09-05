import { supabase } from '../config/database';

export class ReactionService {
  static async handleCommentReaction(commentId: string, userId: string, isLike: boolean) {
    // Check if the reaction exists
    const { data: existingReaction, error: fetchError } = await supabase
      .from('comment_reactions')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingReaction) {
      if (existingReaction.is_like === isLike) {
        // Same reaction clicked again, remove it (toggle off)
        const { error: deleteError } = await supabase
          .from('comment_reactions')
          .delete()
          .eq('user_id', userId)
          .eq('comment_id', commentId);

        if (deleteError) throw deleteError;
        return { action: 'removed' };
      } else {
        // Update reaction from like to dislike or vice versa
        const { error: updateError } = await supabase
          .from('comment_reactions')
          .update({ is_like: isLike })
          .eq('user_id', userId)
          .eq('comment_id', commentId);

        if (updateError) throw updateError;
        return { action: 'updated' };
      }
    } else {
      // Create new reaction
      const { error: insertError } = await supabase
        .from('comment_reactions')
        .insert({ user_id: userId, comment_id: commentId, is_like: isLike });

      if (insertError) throw insertError;
      return { action: 'added' };
    }
  }

  static async handleShortVideoReaction(videoId: string, userId: string, isLike: boolean) {
    const { data: existingReaction, error: fetchError } = await supabase
      .from('short_videos_reaction')
      .select('*')
      .eq('short_video_id', videoId)
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingReaction) {
      if (existingReaction.is_like === isLike) {
        const { error: deleteError } = await supabase
          .from('short_videos_reaction')
          .delete()
          .eq('user_id', userId)
          .eq('short_video_id', videoId);

        if (deleteError) throw deleteError;
        return { action: 'removed' };
      } else {
        const { error: updateError } = await supabase
          .from('short_videos_reaction')
          .update({ is_like: isLike })
          .eq('user_id', userId)
          .eq('short_video_id', videoId);

        if (updateError) throw updateError;
        return { action: 'updated' };
      }
    } else {
      const { error: insertError } = await supabase
        .from('short_videos_reaction')
        .insert({ user_id: userId, short_video_id: videoId, is_like: isLike });

      if (insertError) throw insertError;
      return { action: 'added' };
    }
  }

  static async handleLongVideoReaction(videoId: string, userId: string, isLike: boolean) {
    const { data: existingReaction, error: fetchError } = await supabase
      .from('long_videos_reaction')
      .select('*')
      .eq('long_videos_id', videoId)
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingReaction) {
      if (existingReaction.is_like === isLike) {
        const { error: deleteError } = await supabase
          .from('long_videos_reaction')
          .delete()
          .eq('user_id', userId)
          .eq('long_videos_id', videoId);

        if (deleteError) throw deleteError;
        return { action: 'removed' };
      } else {
        const { error: updateError } = await supabase
          .from('long_videos_reaction')
          .update({ is_like: isLike })
          .eq('user_id', userId)
          .eq('long_videos_id', videoId);

        if (updateError) throw updateError;
        return { action: 'updated' };
      }
    } else {
      const { error: insertError } = await supabase
        .from('long_videos_reaction')
        .insert({ user_id: userId, long_videos_id: videoId, is_like: isLike });

      if (insertError) throw insertError;
      return { action: 'added' };
    }
  }

  static async getShortVideoReactionSummary(videoId: string, userId?: string) {
    const [likeRes, dislikeRes] = await Promise.all([
      supabase
        .from('short_videos_reaction')
        .select('*', { count: 'exact', head: true })
        .eq('short_video_id', videoId)
        .eq('is_like', true),

      supabase
        .from('short_videos_reaction')
        .select('*', { count: 'exact', head: true })
        .eq('short_video_id', videoId)
        .eq('is_like', false),
    ]);

    if (likeRes.error || dislikeRes.error) {
      throw likeRes.error || dislikeRes.error;
    }

    let userReaction = null;
    if (userId) {
      const { data, error } = await supabase
        .from('short_videos_reaction')
        .select('is_like')
        .eq('user_id', userId)
        .eq('short_video_id', videoId)
        .maybeSingle();
      if (error) throw error;
      userReaction = data;
    }

    return {
      video_id: videoId,
      likes: likeRes.count || 0,
      dislikes: dislikeRes.count || 0,
      user_liked: userReaction?.is_like === true,
      user_disliked: userReaction?.is_like === false,
    };
  }

  static async getLongVideoReactionSummary(videoId: string, userId?: string) {
    const [likeRes, dislikeRes] = await Promise.all([
      supabase
        .from('long_videos_reaction')
        .select('*', { count: 'exact', head: true })
        .eq('long_videos_id', videoId)
        .eq('is_like', true),

      supabase
        .from('long_videos_reaction')
        .select('*', { count: 'exact', head: true })
        .eq('long_videos_id', videoId)
        .eq('is_like', false),
    ]);

    if (likeRes.error || dislikeRes.error) {
      throw likeRes.error || dislikeRes.error;
    }

    let userReaction = null;
    if (userId) {
      const { data, error } = await supabase
        .from('long_videos_reaction')
        .select('is_like')
        .eq('user_id', userId)
        .eq('long_videos_id', videoId)
        .maybeSingle();
      if (error) throw error;
      userReaction = data;
    }

    return {
      video_id: videoId,
      likes: likeRes.count || 0,
      dislikes: dislikeRes.count || 0,
      user_liked: userReaction?.is_like === true,
      user_disliked: userReaction?.is_like === false,
    };
  }
}
