"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpToEmail = exports.transporter = void 0;
const nodemailer = __importStar(require("nodemailer"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const gmailUser = process.env.GMAIL_USER;
const gmailPass = process.env.GMAIL_PASS;
if (!gmailUser || !gmailPass) {
    throw new Error('Missing Gmail environment variables');
}
exports.transporter = nodemailer.createTransport({
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
