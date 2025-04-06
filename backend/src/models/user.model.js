import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true, unique: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        contact: { type: String },
        otp: { type: String},
        otpExpiry: { type: String},
        password: { type: String, required: true },
        friend: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
        notification: [
            { 
                _id: mongoose.Schema.Types.ObjectId, 
                type: {type: String, Enum: ["eventInvite", "vendorCollabInvite", "eventCollabInvite"]},
                sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                receiver: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
                event: {type: mongoose.Schema.Types.ObjectId, ref: "Event"},
                vendor: {type: mongoose.Schema.Types.ObjectId, ref: "Vendor"},
                message: {type: String},
                seen: {type: Boolean, default: false},
                createdAt: { type: Date, default: Date.now },
                respondLink: {type: String}
            }
        ],
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
        ],
        gender: { type: String, required: true },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;