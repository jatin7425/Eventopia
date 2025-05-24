import mongoose from 'mongoose';
const ResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true },
    hash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, expires: '15m', required: true },
});

const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

export default ResetToken;