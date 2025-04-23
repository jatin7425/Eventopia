import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true, unique: true },
        fullName: { type: String,},
        email: { type: String, required: true, unique: true },
        contact: { type: String },
        otp: { type: String },
        otpExpiry: { type: String },
        gender: { type: String},
        password: { type: String, required: true },
        friend: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        notification: {
            type: [
                {
                    _id: { type: mongoose.Schema.Types.ObjectId },
                    type: { type: String, enum: ["eventInvite", "vendorCollabInvite ", "WelcomeMessage", "Message"] },
                    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
                    vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
                    message: { type: String },
                    seen: { type: Boolean, default: false },
                    createdAt: { type: Date, default: Date.now },
                    respondLink: { type: String }
                }
            ],
            default: [{
                type: "WelcomeMessage",
                message: "Welcome to our platform!",
                seen: false
            }]
        },
        role: {
            type: String,
            enum: ["Admin", "Manager", "user"],
            default: "user"
        },
        profilePicture: { type: String, default: "" }, // URL to profile picture
        createdAt: { type: Date, default: Date.now },
        event: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] }],
        eventToAttend: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event", default: [] }],
        vendorOwnerShip: [{ type: mongoose.Schema.Types.Object, ref: "Vendor", default: [] }],
        address: [
            {
                country: { type: String },
                state: { type: String },
                city: { type: String },
                pincode: { type: String },
            }
        ]
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;