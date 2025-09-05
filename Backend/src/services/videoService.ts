import { supabase } from '../config/database';

export class VideoService {
  static async uploadVideo(file: Express.Multer.File, metadata: {
    title: string;
    description: string;
    userId: string;
  }) {
    const { title, description, userId } = metadata;
    const fileName = `${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase
      .storage
      .from('videos')
      .upload(`public/${fileName}`, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(`public/${fileName}`);

    await supabase
      .from('videos_metadata')
      .insert([
        {
          file_name: fileName,
          file_url: publicUrlData.publicUrl,
          title,
          user_id: userId,
          description,
          uploaded_at: new Date(),
        },
      ]);

    return publicUrlData.publicUrl;
  }

  static async uploadShortVideo(file: Express.Multer.File, metadata: {
    title: string;
    description: string;
    userId: string;
  }) {
    const { title, description, userId } = metadata;
    const fileName = `${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase
      .storage
      .from('shortvideos')
      .upload(`${fileName}`, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('shortvideos')
      .getPublicUrl(`${fileName}`);

    const { error: insertError } = await supabase
      .from('short_videos_metadata')
      .insert([
        {
          file_name: fileName,
          file_url: publicUrlData.publicUrl,
          uploaded_at: new Date(),
          title,
          user_id: userId,
          description,
        },
      ]);

    if (insertError) throw insertError;

    return publicUrlData.publicUrl;
  }

  static async getUserVideos(userId: string) {
    const { data, error } = await supabase
      .from('videos_metadata')
      .select('file_url, file_name, title, description, uploaded_at')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }

  static async getAllVideos() {
    const { data, error } = await supabase
      .from('videos_metadata')
      .select('file_url, file_name, title, description, uploaded_at, id');

    if (error) throw error;
    return data;
  }

  static async getAllShortVideos() {
    const { data, error } = await supabase
      .from('short_videos_metadata')
      .select('file_url, file_name, title, description, uploaded_at, id');

    if (error) throw error;
    return data;
  }
}
