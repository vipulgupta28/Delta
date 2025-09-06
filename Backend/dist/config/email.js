"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpToEmail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
if (!gmailUser || !gmailPass) {
    throw new Error('Missing Gmail environment variables');
}
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: gmailUser,
        pass: gmailPass,
    },
});
const sendOtpToEmail = async (userEmail, otp) => {
    const mailOption = {
        from: gmailUser,
        to: userEmail,
        subject: 'Delta OTP Code',
        text: `Your OTP is: ${otp}`,
    };
    try {
        const info = await exports.transporter.sendMail(mailOption);
        console.log('Email sent to', info.response);
        return true;
    }
    catch (error) {
        console.log('Error sending mail', error);
        return false;
    }
};
exports.sendOtpToEmail = sendOtpToEmail;
