import express from 'express';
import nodemailer from "nodemailer";
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(express.json()); 
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
});

const upload = multer({ storage: multer.memoryStorage() });
const otpStorage: Record<string, number> = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER!,
        pass: process.env.GMAIL_PASS!,
    }
});

const sendOtpToEmail = async (userEmail: string, otp: number) => {
    const mailOption = {
        from: process.env.GMAIL_USER!,
        to: userEmail,
        subject: "Delta OTP Code",
        text: `Your OTP is : ${otp}`,
    };

    try {
        let info = await transporter.sendMail(mailOption);
        console.log("Email Sent to", info.response);
    } catch (error) {
        console.log("Error sending mail", error);
    }
};

app.post("/api/v1/get-otp", async (req, res) => {
    const email = req.body.data;
    const otp = Math.floor(1000 + Math.random() * 9000);

    console.log(`Generating OTP for ${email}: ${otp}`);

    otpStorage[email] = otp;
    try {
        await sendOtpToEmail(email, otp);
        res.status(200).json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to send OTP" });
    }
});

app.post("/api/v1/verify-otp", (req, res) => {
    const { otp, userEmail } = req.body;

    const storedOTP = otpStorage[userEmail];

    console.log(`Stored: ${storedOTP}, Received: ${otp}`);

    if (storedOTP && storedOTP.toString() === otp) {
        res.status(200).json({ message: "OTP verified successfully" });
    } else {
        res.status(400).json({ message: "Invalid OTP" });
    }
});

app.post("/api/v1/insert-into-users-table", async (req, res) => {
    const { enteredUsername, enteredPassword, enteredEmail } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(enteredPassword, saltRounds);

        const { data, error } = await supabase
            .from("users")
            .insert([{ username: enteredUsername, email: enteredEmail, password: hashedPassword }]);

        if (error) throw error;

        res.status(201).json({ message: "User registered successfully", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error inserting user" });
    }
});

//@ts-ignore
app.post("/api/v1/login-into", async (req, res) => {
    const { enteredUsername, enteredPassword } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('username', enteredUsername)
            .single();

        if (error || !user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        const isPasswordValid = await bcrypt.compare(enteredPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

//@ts-ignore
app.post("/api/v1/store-content", upload.single("video"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded." });
        }

        const { title, description } = req.body;  // Extract title & description
        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;

        // Upload video to Supabase storage
        const { data, error } = await supabase
            .storage
            .from("videos")  
            .upload(`public/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false
            });

        if (error) {
            throw error;
        }

        // Get the public URL of the uploaded video
        const { data: publicUrlData } = supabase.storage
            .from("videos")
            .getPublicUrl(`public/${fileName}`);

        console.log("Uploaded File Public URL:", publicUrlData.publicUrl);

        // Store metadata (title, description, file URL) in Supabase database
        await supabase
            .from("videos_metadata")  // Change to your actual table name
            .insert([
                {
                    file_name: fileName,
                    file_url: publicUrlData.publicUrl, 
                    title: title,  // Store title
                    description: description,  // Store description
                    uploaded_at: new Date(),
                },
            ]);

        res.status(200).json({ publicUrl: publicUrlData.publicUrl });

    } catch (error) {
        console.error("Upload Failed:", error);
        res.status(500).json({ error: "File upload failed." });
    }
});



app.get("/api/v1/get-videos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("videos_metadata")
            .select("file_url, file_name, title, description, uploaded_at");

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching videos:", error);
        res.status(500).json({ error: "Failed to fetch videos" });
    }
});








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
