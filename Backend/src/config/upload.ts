import multer from 'multer';

export const upload = multer({ storage: multer.memoryStorage() });

export const uploadFields = upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'profile', maxCount: 1 },
]);

export const uploadArray = upload.array('media');
