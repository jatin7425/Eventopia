import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to Vendor's Product
    quantity: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'declined'],
        default: 'pending'
    },
    price: { type: Number, required: true }, // Snapshot of price at time of order
    total: { type: Number, required: true }, // price * quantity
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);