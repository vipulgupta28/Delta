import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.CAPTCHA_SECRET_KEY;

export const verifyCaptcha = async (token: string): Promise<boolean> => {
  if (!secretKey) {
    console.error('CAPTCHA_SECRET_KEY not configured');
    return false;
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (error) {
    console.error('Error verifying captcha:', error);
    return false;
  }
};
