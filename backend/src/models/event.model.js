import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Event name
    description: { type: String, required: true }, // Detailed description
    date: { type: Date, required: true }, // Event date
    startTime: { type: String, required: true }, // Event start time
    endTime: { type: String }, // Event end time
    location: { type: String, required: true }, // Event location
    category: {
        type: String,
        enum: ['Family Function', 'Conference', 'Business Meeting', 'Travels'],
        required: true,
    }, // Event category
    attendees: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            name: { type: String, required: true },
            email: { type: String, required: true },
            status: {
                type: String,
                enum: ['Accepted', 'Pending', 'Declined'],
                default: 'Pending',
            },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        }
    ], // List of attendees
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Event organizer
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
        default: 'Upcoming',
    }, // Event status
    budget: {
        type: Number,
    }, // Event budget
    services: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            serviceType: { type: String }, // Type of service, e.g., catering, decoration
            vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }, // Vendor associated
            cost: { type: Number }, // Cost of the service
        },
    ], // List of services for the event
    media: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            type: String,
            required: false,
        },
    ], // List of media (images, videos)
    feedback: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            attendee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Attendee who gave feedback
            rating: { type: Number, min: 1, max: 5 }, // Rating (1-5)
            comment: { type: String }, // Feedback comment
        },
    ], // Feedback and ratings for the event
    cart: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
            product: { type: mongoose.Schema.Types.ObjectId },
            quantity: { type: Number, default: 1 },
        },
    ],
    todo: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            title: { type: String }, // Title of the todo
            description: { type: String }, // Description of the todo
            status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' }, // Status of the todo
            createdAt: { type: Date, default: Date.now }, // Creation date
            updatedAt: { type: Date, default: Date.now }, // Last update date
        },
    ],
    calender: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
            title: { type: String },
            date: { type: Date },
            description: { type: String },
            startTime: { type: Date, required: true },
            endTime: { type: Date, required: true }
        }
    ],
    createdAt: { type: Date, default: Date.now }, // Creation date
    updatedAt: { type: Date, default: Date.now }, // Last update date
}, { timestamps: true });



const Event = mongoose.model('Event', eventSchema);
export default Event;