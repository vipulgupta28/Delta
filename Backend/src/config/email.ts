import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const gmailUser = process.env.GMAIL_USER!;
const gmailPass = process.env.GMAIL_PASS!;

if (!gmailUser || !gmailPass) {
  throw new Error('Missing Gmail environment variables');
}

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailUser,
    pass: gmailPass,
  },
});

export const sendOtpToEmail = async (userEmail: string, otp: number) => {
  const mailOption = {
    from: gmailUser,
    to: userEmail,
    subject: 'Delta OTP Code',
    text: `Your OTP is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOption);
    console.log('Email sent to', info.response);
    return true;
  } catch (error) {
    console.log('Error sending mail', error);
    return false;
  }
};
