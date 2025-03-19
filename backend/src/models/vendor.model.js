import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Ratings are between 1 and 5
    },
    comment: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

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
    },
    productRatings: [ratingSchema], // Ratings for the product
    averageRating: {
        type: Number,
        default: 0, // Average rating of the product
    },

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
        Products: [productSchema], // Products sold by the vendor
        PlaceImages: {
            type: [String],
            required: function () {
                return ["Hotel", "Banquet Hall"].includes(this.ShopCategory);
            },
        },
        VendorRatings: [ratingSchema], // Ratings for the vendor
        averageVendorRating: {
            type: Number,
            default: 0, // Overall average rating of the vendor
        },
    },
    { timestamps: true }
);

const Vendor = mongoose.model("Vendor", vendorSchema);

export default Vendor;