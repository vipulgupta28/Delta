"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCaptcha = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const secretKey = process.env.CAPTCHA_SECRET_KEY;
const verifyCaptcha = async (token) => {
    if (!secretKey) {
        console.error('CAPTCHA_SECRET_KEY not configured');
        return false;
    }
    try {
        const response = await axios_1.default.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: secretKey,
                response: token,
            },
        });
        return response.data.success;
    }
    catch (error) {
        console.error('Error verifying captcha:', error);
        return false;
    }
};
exports.verifyCaptcha = verifyCaptcha;
