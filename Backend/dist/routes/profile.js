"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const upload_1 = require("../config/upload");
const router = (0, express_1.Router)();
//@ts-ignore
router.post('/handleProfileChanges', upload_1.upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'profile', maxCount: 1 }
    //@ts-ignore
]), async (req, res) => {
    const { userId, bio, location } = req.body;
    if (!userId || !bio) {
        return res.status(400).json({ error: 'User ID and bio are required.' });
    }
    const files = req.files;
    const bannerFile = files?.banner?.[0];
    const profileFile = files?.profile?.[0];
    let bannerUrl = null;
    let profileUrl = null;
    try {
        // Handle Banner Upload
        if (bannerFile) {
            const bannerFileName = `${userId}/banner-${Date.now()}-${bannerFile.originalname}`;
            const { error: bannerError } = await database_1.supabase.storage
                .from('user-assets') // your Supabase storage bucket
                .upload(bannerFileName, bannerFile.buffer, {
                contentType: bannerFile.mimetype,
                upsert: true,
            });
            if (bannerError)
                throw bannerError;
            const { data: bannerPublicUrl } = database_1.supabase
                .storage
                .from('user-assets')
                .getPublicUrl(bannerFileName);
            bannerUrl = bannerPublicUrl.publicUrl;
        }
        if (profileFile) {
            const profileFileName = `${userId}/profile-${Date.now()}-${profileFile.originalname}`;
            const { error: profileError } = await database_1.supabase.storage
                .from('user-assets')
                .upload(profileFileName, profileFile.buffer, {
                contentType: profileFile.mimetype,
                upsert: true,
            });
            if (profileError)
                throw profileError;
            const { data: profilePublicUrl } = database_1.supabase
                .storage
                .from('user-assets')
                .getPublicUrl(profileFileName);
            profileUrl = profilePublicUrl.publicUrl;
        }
        // Now update Supabase DB
        const { data, error } = await database_1.supabase
            .from('profiles')
            .upsert([{
                user_id: userId,
                bio,
                location,
                banner_img: bannerUrl,
                profile_img: profileUrl,
            }], { onConflict: 'user_id' })
            .select();
        if (error) {
            console.error('Supabase Error:', error);
            return res.status(500).json({ error: 'Failed to update profile.' });
        }
        res.status(200).json({ message: 'Profile updated successfully', data });
    }
    catch (err) {
        console.error('Server Error:');
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});
//@ts-ignore
router.get('/getProfileChanges/:userId', async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }
    try {
        const { data, error } = await database_1.supabase
            .from('profiles')
            .select(`
      user_id,
      bio,
      location,
      banner_img,
      profile_img,
      users!profiles_user_id_fkey (
        username
      )
    `)
            .eq('user_id', userId)
            .single();
        if (error || !data) {
            console.error('Error fetching profile:', error || 'No data found');
            return res.status(404).json({ error: 'Profile not found.' });
        }
        res.status(200).json({ profile: data });
    }
    catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).json({ error: 'Unexpected server error.' });
    }
});
//@ts-ignore
router.post('/handleFollow', async (req, res) => {
    const { follower_id, following_id } = req.body;
    try {
        // Check if the follow relationship already exists
        const { data: existingFollow, error: checkError } = await database_1.supabase
            .from('follows')
            .select('*')
            .eq('follower_id', follower_id)
            .eq('following_id', following_id)
            .single();
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        if (existingFollow) {
            // Unfollow
            const { error: deleteError } = await database_1.supabase
                .from('follows')
                .delete()
                .eq('follower_id', follower_id)
                .eq('following_id', following_id);
            if (deleteError)
                throw deleteError;
            return res.status(200).json({ message: 'Unfollowed user', isFollowing: false });
        }
        else {
            // Follow
            const { error: insertError } = await database_1.supabase
                .from('follows')
                .insert([{ follower_id, following_id }]);
            if (insertError)
                throw insertError;
            return res.status(200).json({ message: 'Followed user', isFollowing: true });
        }
    }
    catch (err) {
        console.error('Error handling follow:', err);
        return res.status(500).json({ error: 'Error handling follow/unfollow' });
    }
});
//@ts-ignore
router.get('/getMutuals/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Get users that the current user is following
        const { data: following, error: err1 } = await database_1.supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', userId);
        // Get users who follow the current user
        const { data: followers, error: err2 } = await database_1.supabase
            .from('follows')
            .select('follower_id')
            .eq('following_id', userId);
        if (err1 || err2) {
            return res.status(500).json({ error: err1 || err2 });
        }
        const followingIds = following.map(f => f.following_id);
        const followerIds = followers.map(f => f.follower_id);
        // Get mutual IDs
        const mutualIds = followingIds.filter(id => followerIds.includes(id));
        if (!mutualIds.length) {
            return res.json({ mutuals: [] });
        }
        // Fetch user info for mutuals
        const { data: mutualUsers, error: userError } = await database_1.supabase
            .from('users')
            .select('user_id, username, email')
            .in('user_id', mutualIds);
        if (userError) {
            return res.status(500).json({ error: userError });
        }
        // Fetch profile images for those mutuals
        const { data: profileData, error: profileError } = await database_1.supabase
            .from('profiles')
            .select('user_id, profile_img')
            .in('user_id', mutualIds);
        if (profileError) {
            return res.status(500).json({ error: profileError });
        }
        // Merge profile image into mutualUsers array
        const mutualsWithProfile = mutualUsers.map(user => {
            const profile = profileData.find(p => p.user_id === user.user_id);
            return {
                ...user,
                profile_img: profile?.profile_img || null
            };
        });
        res.json({ mutuals: mutualsWithProfile });
    }
    catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/update-username', async (req, res) => {
    const { email, newUsername } = req.body;
    try {
        const { data, error } = await database_1.supabase
            .from('users')
            .update({ username: newUsername })
            .eq('email', email);
        if (error)
            throw error;
        res.status(200).json({ message: 'Username updated successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating username' });
    }
});
router.post('/update-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        const { data, error } = await database_1.supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('email', email);
        if (error)
            throw error;
        res.status(200).json({ message: 'Password updated successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating password' });
    }
});
router.post('/update-email', async (req, res) => {
    const { oldEmail, newEmail } = req.body;
    try {
        const { data, error } = await database_1.supabase
            .from('users')
            .update({ email: newEmail })
            .eq('email', oldEmail);
        if (error)
            throw error;
        res.status(200).json({ message: 'Email updated successfully' });
    }
    catch (err) {
        res.status(500).json({ message: 'Error updating email' });
    }
});
exports.default = router;
