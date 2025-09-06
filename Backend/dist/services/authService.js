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
exports.AuthService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const database_1 = require("../config/database");
const email_1 = require("../config/email");
const firebaseAdmin_1 = require("./firebaseAdmin");
// In-memory OTP storage (in production, use Redis)
const otpStorage = {};
class AuthService {
    static async generateOTP(email) {
        const otp = Math.floor(1000 + Math.random() * 9000);
        console.log(`Generating OTP for ${email}: ${otp}`);
        otpStorage[email] = otp;
        return await (0, email_1.sendOtpToEmail)(email, otp);
    }
    static verifyOTP(email, otp) {
        const storedOTP = otpStorage[email];
        console.log(`Stored: ${storedOTP}, Received: ${otp}`);
        if (storedOTP && storedOTP.toString() === otp) {
            delete otpStorage[email]; // Clean up after successful verification
            return true;
        }
        return false;
    }
    static async signup(userData) {
        const { username, email, password, captchaToken } = userData;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const { data: user, error } = await database_1.supabase
            .from('users')
            .insert([
            { username, email, password: hashedPassword },
        ])
            .select('user_id, username, email')
            .single();
        if (error)
            throw error;
        const { error: profileError } = await database_1.supabase
            .from('profiles')
            .insert([{ user_id: user.user_id }]);
        if (profileError)
            throw profileError;
        const tokenPayload = {
            username: user.username,
            email: user.email,
            user_id: user.user_id,
        };
        return { user, tokenPayload };
    }
    static async login(username, password) {
        const { data: user, error } = await database_1.supabase
            .from('users')
            .select('password, username, email, user_id')
            .eq('username', username)
            .single();
        if (error || !user) {
            throw new Error('Invalid username or password');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        const tokenPayload = {
            username: user.username,
            email: user.email,
            user_id: user.user_id,
        };
        return { user, tokenPayload };
    }
    static async checkUsername(username) {
        const { data, error } = await database_1.supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();
        if (error && error.code !== 'PGRST116') {
            throw error;
        }
        return !!data;
    }
    static async sessionLogin(idToken, username) {
        // Verify Firebase token
        const decoded = await firebaseAdmin_1.adminAuth.verifyIdToken(idToken);
        const email = decoded.email;
        if (!email)
            throw new Error("No email from Google");
        // Check Supabase for existing user
        const { data: user, error } = await database_1.supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();
        if (error)
            throw error;
        // 🚨 If user doesn't exist
        if (!user) {
            if (!username) {
                // Frontend needs to ask user for username
                return { status: "NEW_USER", email };
            }
            // Create new user
            const { data: newUser, error: insertErr } = await database_1.supabase
                .from("users")
                .insert([{ email, username }])
                .select()
                .single();
            if (insertErr)
                throw insertErr;
            // Create Firebase session cookie
            const sessionCookie = await firebaseAdmin_1.adminAuth.createSessionCookie(idToken, {
                expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
            });
            return {
                status: "LOGGED_IN",
                user: newUser,
                sessionCookie,
            };
        }
        // 🚨 User already exists
        if (username && username !== user.username) {
            throw new Error("Wrong username");
        }
        // Create Firebase session cookie
        const sessionCookie = await firebaseAdmin_1.adminAuth.createSessionCookie(idToken, {
            expiresIn: 1000 * 60 * 60 * 24 * 7,
        });
        return {
            status: "LOGGED_IN",
            user,
            sessionCookie,
        };
    }
}
exports.AuthService = AuthService;
