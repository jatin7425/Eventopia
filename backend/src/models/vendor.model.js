import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productDescription: {
        type: String,
    },
    productPrice: {
        type: Number,
        required: true,
    },
    productImage: {
        type: String,
    },
    available: {
        type: Boolean,
        required: true,
    }

});

const vendorSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        collaborators: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        ShopName: {
            type: String,
            required: true,
        },
        ShopCategory: {
            type: String,
            required: true,
            enum: ["Bakery", "Food", "Decoration", "Hotel", "Banquet Hall"],
        },
        ShopLogo: {
            type: String,
        },
        ShopImage: {
            type: String,
        },
        ShopBanner: {
            type: String,
        },

        ShopRating: {
            type: Number,
            default: 0, // Overall average rating of the vendor
        },
        ShopPhone: {
            type: String,
            required: true,
        },
        ShopEmail: {
            type: String,
            required: true,
            unique: true,
        },
        ShopAddress: {
            type: String,
            required: true,
        },
        ShopDescription: {
            type: String,
            required: true,
        },
        ShopLocation: {
            type: String,
            required: true,
        },
        Orders: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                product: { type: mongoose.Schema.Types.ObjectId },
                quantity: { type: Number, default: 1 },
                orderedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
                orderedAt : { type: Date, default: Date.now },
                status: { type: String, enum: ["confirmed", "Confirmed", "pending", "Pending", "declined", "Declined"  ], default: "Pending"}
            },
        ],
        Products: [productSchema], // Products sold by the vendor
        PlaceImages: {
            type: [String],
            required: function () {
                return ["Hotel", "Banquet Hall"].includes(this.ShopCategory);
            },
        },
    },
    { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;