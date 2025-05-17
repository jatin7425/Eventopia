import mongoose from 'mongoose';

const contactUs = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }, // Creation date
    updatedAt: { type: Date, default: Date.now }, // Last update date
}, { timestamps: true });



const ContactUs = mongoose.model('ContactUs', contactUs);
export default ContactUs;