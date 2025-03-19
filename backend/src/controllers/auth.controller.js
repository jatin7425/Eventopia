import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from 'mongoose';
import nodemailer from "nodemailer";
import twilio from "twilio";
import crypto from "crypto";
import Event from "../models/event.model.js";

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Configure Twilio
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generate OTP
const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    return { otp, otpExpiry };
};

export const signup = async (req, res) => {
    const { userName, fullName, email, password, gender } = req.body;

    try {
        // Validate required fields
        if (!userName || !fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

        if (!passwordPattern.test(password)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and include a letter and a number." });
        }

        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let pfp;
        if (gender === 'female' || gender === 'others') {
            pfp = Math.floor(Math.random() * 50) + 51; // Generates a random number between 51 and 100
        } else {
            pfp = Math.floor(Math.random() * 50) + 1;  // Generates a random number between 1 and 50
        };

        // Create new user
        const newUser = new User({
            userName,
            fullName,
            email,
            gender,
            password: hashedPassword,
            profilePicture: `https://avatar.iran.liara.run/public/${pfp}`,
        });

        await newUser.save();

        // Generate token and respond
        generateToken(newUser._id, res);
        res.status(201).json({
            _id: newUser._id,
            userName: newUser.userName,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePicture: newUser.profilePicture,
        });
    } catch (error) {
        console.error("Error in signup Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Verify password
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate token and respond
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
        });
    } catch (error) {
        console.error("Error in login Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("taskflowToken", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
        console.error("Error in logout Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        // Adjust the destructuring so that phone maps to contact
        const { fullName, phone, email, address } = req.body.data;
        const { city, state, postcode, country } = address || {};

        console.log("Data received:", req.body.data);

        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Generate a random profile picture index based on gender
        let pfp;
        if (user.gender === 'female' || user.gender === 'others') {
            pfp = Math.floor(Math.random() * 50) + 51; // Random number between 51 and 100
        } else {
            pfp = Math.floor(Math.random() * 50) + 1;  // Random number between 1 and 50
        }

        // Prepare the updated fields for the user (excluding address for now)
        const updatedFields = {
            fullName: fullName || user.fullName,
            email: email || user.email,
            profilePicture: user.profilePicture || `https://avatar.iran.liara.run/public/${pfp}`,
            contact: phone || user.contact, // mapping phone to contact
        };

        // Validate email format if provided
        if (email && !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ message: "Invalid email format." });
        }

        // Build the update query object.
        // Start with the updatedFields.
        let updateQuery = { $set: updatedFields };

        // Update the address fields using the positional operator if address exists.
        if (user.address && user.address.length > 0) {
            // Use the provided values or fallback to existing values.
            updateQuery.$set["address.0.city"] = city || user.address[0].city;
            updateQuery.$set["address.0.state"] = state || user.address[0].state;
            updateQuery.$set["address.0.pincode"] = postcode || user.address[0].pincode;
            updateQuery.$set["address.0.country"] = country || user.address[0].country;
        } else {
            // If no address exists, set the entire address field with a new array
            updateQuery.$set.address = [{
                city: city || "",
                state: state || "",
                pincode: postcode || "",
                country: country || "",
            }];
        }

        console.log("Update Query:", updateQuery);

        // Update the user in the database with new: true to get the updated document.
        const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true, runValidators: true });

        res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Error in updateProfile:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const events = await Event.find({ _id: { $in: user.event } });

        const UserWithEvents = {
            _id: user._id,
            userName: user.userName,
            fullName: user.fullName,
            email: user.email,
            profilePicture: user.profilePicture,
            vendorOwnerShip: user.vendorOwnerShip,
            
            event: events.map(event => ({
                _id: event._id,
                name: event.name,
                category: event.category
            }))
        };

        res.status(200).json(UserWithEvents); // Send the structured user object
    } catch (error) {
        console.error('Error in /api/auth/check:', error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

        console.log(passwordPattern);

        // Validate input
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Fields cannot be empty." });
        }

        if (!passwordPattern.test(newPassword)) {
            return res.status(400).json({ message: "Password must be at least 8 characters long and contain at least one letter and one number." });
        }

        const userId = req.user._id;

        // Find the user in the database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Check if the old password is correct
        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Your old password is incorrect." });
        }

        console.log("isPasswordCorrect: ", isPasswordCorrect);

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Error in resetPassword:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export const userById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Check if userId is not null or undefined and is a valid ObjectId
        if (userId !== null && userId !== undefined && mongoose.Types.ObjectId.isValid(userId)) {

            const user = await User.findById(userId)
                .select('-password')
                .select('-createdAt')
                .select('-project')
                .select('-task');

            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            res.status(200).json(user);
        } else {
            return res.status(400).json({ message: "Invalid or missing user ID." });
        }

    } catch (error) {
        console.error("Error in userById:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').select('-createdAt');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
}

// Request password reset
export const requestPasswordReset = async (req, res) => {
    const { email, contact } = req.body;

    try {
        // Find user by email or contact
        const user = await User.findOne({
            $or: [{ email }, { contact }],
        });

        if (!user) {
            return res.status(404).json({
                message: `No user exists with this ${email ? 'email' : 'contact'}`,
            });
        }

        // Generate and save OTP
        const { otp, otpExpiry } = generateOTP();
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email
        if (email) {
            await transporter.sendMail({
                from: `"YourApp" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Password Reset OTP',
                text: `Your OTP code is ${otp}`,
                html: `<p>Your OTP code is <strong>${otp}</strong></p>`,
            });
        }

        // Send OTP via SMS
        if (contact) {
            await twilioClient.messages.create({
                body: `Your OTP code is ${otp}`,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: contact,
            });
        }

        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error.message);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};

// Reset password
export const forgetPassword = async (req, res) => {
    const { email, contact, otp, newPassword } = req.body;

    try {
        // Find user by email or contact
        const user = await User.findOne({
            $or: [{ email }, { contact }],
        });

        if (!user) {
            return res.status(404).json({
                message: `No user exists with this ${email ? 'email' : 'contact'}`,
            });
        }

        // Check if OTP is valid
        if (user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        // Update password
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful!' });
    } catch (error) {
        console.error('Error in resetPassword:', error.message);
        res.status(500).json({ message: 'Internal Server Error.' });
    }
};