"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        const { username, email, password } = userData;
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcryptjs_1.default.hash(password, saltRounds);
        // First check if username OR email already exists
        const { data: existingUser, error: lookupError } = await database_1.supabase
            .from('users')
            .select('user_id')
            .or(`username.eq.${username},email.eq.${email}`)
            .maybeSingle();
        if (lookupError)
            throw lookupError;
        if (existingUser) {
            throw new Error('Username or email already exists');
        }
        // Insert new user
        const { data: user, error } = await database_1.supabase
            .from('users')
            .insert([{ username, email, password: hashedPassword }])
            .select('user_id, username, email')
            .single();
        if (error)
            throw error;
        // Create profile for new user
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
    static async login(username, email, password) {
        const { data: user, error } = await database_1.supabase
            .from('users')
            .select('password, username, email, user_id')
            .eq('username', username)
            .single();
        if (error || !user) {
            throw new Error('Invalid username or password');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
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
