import Event from '../models/event.model.js';
import Vendor from "../models/vendor.model.js";
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import { isSameDay, parseISO } from 'date-fns';
import { sendEmail, sendInvitationEmail } from '../utils/sendEmail.js';
import orderModel from '../models/order.model.js';

// Create a new event
export const createEvent = async (req, res) => {
    try {
        const user = req.user;
        const userDoc  = await User.findById(user._id);
        const { name, description, date, startTime, endTime, location, category, status, budget } = req.body;

        const event = new Event({
            name,
            description,
            date,
            startTime,
            endTime,
            location,
            category,
            status,
            budget,
            organizer: user._id
        });
        userDoc.event.push(event._id);
        await event.save();
        await userDoc.save();
        userDoc.eventToAttend.push(event._id);
        await userDoc.save();

        res.status(201).json({ message: 'Event created successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Get all events with optional filters
export const getEvents = async (req, res) => {
    try {
        const { category, status, dateRange } = req.query;

        const filters = {};
        if (category) filters.category = category;
        if (status) filters.status = status;
        if (dateRange) {
            const [start, end] = dateRange.split(',');
            filters.date = { $gte: new Date(start), $lte: new Date(end) };
        }

        const events = await Event.find(filters).populate('organizer attendees services.vendor', 'name email');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findById(eventId).populate('organizer attendees services.vendor', 'name email');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Update an event
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only organizer or collaborator can update
        if (event.organizer.toString() !== userId.toString() && (!event.collaborator || event.collaborator.toString() !== userId.toString())) {
            return res.status(403).json({ message: 'You do not have permission to update this event' });
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, req.body, { new: true });
        res.status(200).json({ message: 'Event updated successfully', updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete an event
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Invalid event ID' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only organizer can delete
        if (event.organizer.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this event' });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

// Add a service to an event
export const addServiceToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only organizer can add services
        if (event.organizer.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'You do not have permission to add services to this event' });
        }

        const { serviceType, vendor, cost } = req.body;
        event.services.push({ serviceType, vendor, cost });
        await event.save();

        res.status(200).json({ message: 'Service added successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error adding service', error: error.message });
    }
};

// Add feedback to an event
export const addFeedbackToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.user._id;

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const existingFeedback = event.feedback.find((fb) => fb.attendee.toString() === userId.toString());
        if (existingFeedback) {
            return res.status(400).json({ message: 'You have already provided feedback for this event' });
        }

        event.feedback.push({ attendee: userId, rating, comment });
        await event.save();

        res.status(200).json({ message: 'Feedback added successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error adding feedback', error: error.message });
    }
};

// Add a to-do to an event
export const addTodoToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, status } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Only organizer or collaborator can add to-do
        if (event.organizer.toString() !== req.user._id.toString() && (!event.collaborator || event.collaborator.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'You do not have permission to add to-do to this event' });
        }
        if (!['Pending', 'Completed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be one of: Pending, Completed' });
        }

        event.todo.push({
            title,
            description,
            status: status.charAt(0).toUpperCase() + status.slice(1) // Capitalizing first letter
        });
        await event.save();

        res.status(200).json({ message: 'To-Do added successfully', event });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to-do', error: error.message });
    }
};

// Delete a to-do from an event
export const deleteTodoFromEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { index } = req.body;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (index === -1) {
            return res.status(404).json({ message: 'To-Do not found' });
        }

        event.todo.splice(index, 1);
        await event.save();
        res.status(200).json({ message: 'To-Do deleted successfully', event });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting to-do', error: error.message });
    }
}

// Update a to-do in an event
export const updateTodoInEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { index, title, description, status } = req.body;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (index === -1) {
            return res.status(404).json({ message: 'To-Do not found' });
        }

        // Only organizer or collaborator can update
        if (event.organizer.toString() !== userId.toString() && (!event.collaborator || event.collaborator.toString() !== userId.toString())) {
            return res.status(403).json({ message: 'You do not have permission to update this to-do' });
        }

        event.todo[index] = {
            title,
            description,
            status: status.charAt(0).toUpperCase() + status.slice(1) // Capitalizing first letter
        };
        await event.save();

        res.status(200).json({ message: 'To-Do updated successfully', event });

    } catch (error) {
        res.status(500).json({ message: 'Error updating to-do', error: error.message });
    }
}

// Create or Update Cart
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { eventId, vendorId } = req.params;
        const { productId, quantity = 1 } = req.body; // Default quantity is 1

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Check if product already exists in cart
        const existingItem = event.cart.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity
        } else {
            event.cart.push({ user: userId, vendor: vendorId, product: productId, quantity });
        }

        await event.save();

        res.status(200).json({
            message: "Cart updated successfully",
            cart: event.cart
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating cart", error: error.message });
    }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
    try {
        const { eventId, cartId } = req.params;

        // Find the event by its ID
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Filter out the item from the cart array
        event.cart = event.cart.filter(item => item._id.toString() !== cartId);

        // Save the updated event document
        await event.save();

        // Respond with a success message and the updated cart
        res.status(200).json({
            message: "Item removed from cart successfully",
            cart: event.cart
        });
    } catch (error) {
        res.status(500).json({ message: "Error removing item from cart", error: error.message });
    }
};

// Update Cart Quantity
export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;
        const { eventId, cartId } = req.params;
        const { quantity } = req.body;

        if (quantity < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        const newCartId = new mongoose.Types.ObjectId(cartId);

        const event = await Event.findOneAndUpdate(
            { _id: eventId, "cart": { $elemMatch: { _id: newCartId } } },
            { $set: { "cart.$.quantity": quantity } }, // Update quantity
            { new: true }
        );

        if (!event) {
            return res.status(404).json({ message: "Event or product not found in cart" });
        }

        res.status(200).json({
            message: "Cart quantity updated successfully",
            cart: event.cart
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating cart quantity", error: error });
    }
};

// Get User's Cart
export const getEventCart = async (req, res) => {
    try {
        const { eventId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        // Validate Event ID
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid Event ID" });
        }

        // Fetch the event with cart populated (user only)
        const event = await Event.findById(eventId)
            .populate({ path: "cart.user", select: "userName fullName email" });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Fetch all vendors from cart items
        const vendorIds = event.cart.map(cart => cart.vendor);
        const vendors = await Vendor.find({ _id: { $in: vendorIds } });

        const TotalCartItems = event.cart.length
        let TotalBilling = 0

        // Map cart items with vendor and product details
        const cartWithProducts = await Promise.all(event.cart.map(async (cart) => {
            const vendor = vendors.find(v => v._id.equals(cart.vendor));
            if (!vendor) return null;

            const product = vendor.Products.find(p => p._id.equals(cart.product));
            if (!product) return null;

            TotalBilling += (product.productPrice * cart.quantity)

            return {
                _id: cart._id,
                user: cart.user,
                vendor: {
                    _id: vendor._id,
                    ShopName: vendor.ShopName,
                    ShopLogo: vendor.ShopLogo,
                },
                product: {
                    _id: product._id,
                    productName: product.productName,
                    productDescription: product.productDescription,
                    productPrice: product.productPrice,
                    productImage: product.productImage,
                    available: product.available,
                    averageRating: product.averageRating,
                },
                quantity: cart.quantity,
            };
        }));


        // Remove null values (carts with missing products/vendors)
        const validCart = cartWithProducts.filter(item => item !== null);

        if (validCart.length === 0) {
            return res.status(404).json({ message: "No vendors or products found in the cart" });
        }

        // Implement Pagination
        const paginatedCart = validCart.slice(skip, skip + limit);

        res.status(200).json({
            success: true,
            eventDetails: {
                _id: event._id,
                name: event.name,
                organizer: event.organizer,
            },
            cart: paginatedCart,
            TotalCartItems: TotalCartItems,
            TotalBilling: TotalBilling,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(validCart.length / limit),
                totalItems: validCart.length,
                limit,
                nextPage: skip + limit < validCart.length ? page + 1 : null,
                prevPage: page > 1 ? page - 1 : null,
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error retrieving cart", error: error.message });
    }
};


// Clear the entire cart for a specific event
export const clearCart = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Check if organizer
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized to clear the cart" });
        }

        // Clear the cart
        event.cart = [];
        await event.save();

        res.status(200).json({ success: true, message: "Cart cleared successfully", cart: event.cart });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error clearing cart", error: error.message });
    }
};

export const cartCheckout = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        // Validate event
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });
        if (event.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // Create orders
        const orders = await Promise.all(event.cart.map(async (item) => {
            const vendor = await Vendor.findById(item.vendor);
            const product = vendor.Products.id(item.product);

            if (!product) {
                throw new Error(`Product ${item.product} not found`);
            }

            return new orderModel({
                user: userId,
                vendor: item.vendor,
                event: eventId,
                product: item.product,
                quantity: item.quantity,
                price: product.productPrice,
                total: product.productPrice * item.quantity
            }).save();
        }));

        // Clear cart
        event.cart = [];
        await event.save();

        res.status(200).json({
            success: true,
            message: "Checkout completed",
            orderCount: orders.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Checkout failed",
            error: error.message
        });
    }
};

// Helper function for category-based colors
function getCategoryColors(category) {
    const colorSchemes = {
        "Conference": { primary: '#2563eb', secondary: '#1d4ed8', accent: '#60a5fa' },
        "Concert": { primary: '#dc2626', secondary: '#b91c1c', accent: '#f87171' },
        "Family Function": { primary: '#059669', secondary: '#047857', accent: '#34d399' },
        "Business Meeting": { primary: '#4f46e5', secondary: '#4338ca', accent: '#818cf8' }
    };
    return colorSchemes[category] || {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#60a5fa'
    };
}

// Add new attendee with validation
export const addAttendee = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { name, email } = req.body;
        const userId = req.user._id;

        if (!name || !email) {
            return res.status(400).json({
                message: 'Name and email are required fields'
            });
        }

        const currentUser = await User.findById(userId);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const existingUser = await User.findOne({ email }).select('+notification');
        const event = await Event.findById(eventId)
            .populate('organizer', 'fullName email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if attendee already exists
        const attendeeExists = event.attendees.some(attendee =>
            attendee.email === email ||
            (existingUser && attendee.user?.equals(existingUser._id))
        );

        if (attendeeExists) {
            return res.status(400).json({ error: 'Attendee already exists' });
        }

        // Add new attendee
        const newAttendee = {
            name: existingUser?.fullName || name,
            email,
            status: 'Pending',
            user: existingUser?._id
        };

        event.attendees.push(newAttendee);
        await event.save();

        // Notification logic
        let notificationSent = false;
        if (existingUser) {
            try {
                const notificationPayload = {
                    type: 'eventInvite',
                    sender: userId,
                    event: event._id,
                    message: `You've been invited to ${event.name} by ${req.user.fullName}`,
                    respondLink: `${process.env.BASE_FRONTEND_HOST_URL}/api/event/${eventId}/attendees/respond`,
                    seen: false,
                    createdAt: new Date()
                };

                // Check for existing notification
                const existingNotification = existingUser.notification.find(n =>
                    // Compare all relevant fields (excluding seen/createdAt)
                    n.type === notificationPayload.type &&
                    n.sender.equals(notificationPayload.sender) &&
                    n.event.equals(notificationPayload.event) &&
                    n.message === notificationPayload.message &&
                    n.respondLink === notificationPayload.respondLink
                );

                const updateOperation = existingNotification ?
                    {
                        $set: {
                            'notification.$[elem].seen': false,
                            'notification.$[elem].createdAt': new Date(),
                            'notification.$[elem].respondLink': notificationPayload.respondLink
                        }
                    } : {
                        $push: { notification: notificationPayload },
                        $inc: { notificationCount: 1 }
                    };

                const updateOptions = {
                    new: true,
                    runValidators: true,
                    arrayFilters: existingNotification ?
                        [{ 'elem.event': event._id, 'elem.type': 'eventInvite' }] :
                        undefined
                };

                await User.findByIdAndUpdate(
                    existingUser._id,
                    updateOperation,
                    updateOptions
                );

                notificationSent = true;
            } catch (error) {
                // When rolling back attendee addition, use atomic update
                await Event.findByIdAndUpdate(
                    event._id,
                    {
                        $pull: {
                            attendees: {
                                email: email
                            }
                        },
                    },
                    { new: true }
                );
            }
        } else {
            // Send invitation email to new (non-registered) user
            try {
                // Format dates and times
                const eventDate = event.date.toLocaleDateString('en-IN', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                });

                const eventTime = `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ''}`;

                // Default dress code based on category
                const dressCodes = {
                    "Conference": "Business Formal",
                    "Concert": "Casual",
                    "Family Function": "Traditional Wear",
                    "Business Meeting": "Business Casual"
                };

                const responseDeadlineDate = new Date(event.date);
                responseDeadlineDate.setDate(responseDeadlineDate.getDate() - 3);
                const responseDeadline = responseDeadlineDate.toLocaleDateString('en-IN', {
                    month: 'long',
                    day: 'numeric'
                });

                const nextUrl = encodeURIComponent(
                    `/event/${eventId}/attendees/decline?response=false&email=${encodeURIComponent(email)}&directReject=true`
                );

                await sendInvitationEmail({
                    to: email,
                    subject: `You're Invited to ${event.name}`,
                    eventTitle: `Hi ${name}, You're Invited!`,
                    eventSubtitle: `${currentUser?.fullName} has invited you to attend`,
                    eventName: event.name,
                    eventDescription: `
                        <p style="margin: 10px 0; color: #4a5568;">${event.description}</p>
                        <p style="margin: 10px 0; color: #4a5568;">
                            <strong>Event Type:</strong> ${event.category}
                        </p>
                    `,
                    eventDate: eventDate,
                    eventTime: eventTime,
                    eventLocation: event.location,
                    dressCode: dressCodes[event.category] || 'Smart Casual',
                    acceptButtonUrl: `${process.env.BASE_FRONTEND_HOST_URL}/auth?next=/event/${eventId}/attendees/respond`,
                    declineButtonUrl: `${process.env.BASE_FRONTEND_HOST_URL}/processpage?next=${nextUrl}`,
                    responseDeadline: responseDeadline,
                    footerEmail: event.organizer.email,
                    brandColors: getCategoryColors(event.category)
                });
            } catch (emailError) {
                console.error("Email sending failed:", emailError.message);
                // When rolling back attendee addition, use atomic update
                await Event.findByIdAndUpdate(
                    event._id,
                    {
                        $pull: {
                            attendees: {
                                email: email
                            }
                        },
                    },
                    { new: true }
                );
            }
        }

        res.status(201).json({
            message: 'Attendee added successfully',
            attendee: newAttendee,
            notificationSent
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding attendee',
            error: error.message
        });
    }
};

// Update attendee status with better error handling
export const respondToEventInvite = async (req, res) => {
    try {
        const { eventId, email, directReject } = req.params;
        const { response } = req.query;
        const userId = null;
        if (req.user) {
            userId = req.user._id
        }

        // Validate input parameters
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: 'Invalid event ID format' });
        }

        if (!response || !['true', 'false'].includes(response.toLowerCase().trim())) {
            return res.status(400).json({
                message: 'Missing or invalid response parameter (must be "true" or "false")'
            });
        }

        const responseStatus = response.toLowerCase().trim() === 'true'
            ? 'Accepted'
            : 'Declined';

        // Find event with organizer details
        const event = await Event.findById(eventId)
            .populate('organizer', 'email notification')
            .lean();

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Get current user with email verification
        const currentUser = await User.findById(userId)
            .select('email notification')
            .lean();

        if (!currentUser) {
            if (!directReject) {
                return res.status(404).json({ message: 'User not found' });
            }
        }

        // Find attendee in event
        let attendee = event.attendees.find(a =>
            a.user && a.user.equals(userId)
        );

        // Fallback to email matching if user reference not found
        if (!attendee) {
            if (directReject) {
                attendee = event.attendees.find(a =>
                    a.email === currentUser.email
                );
            } else {
                attendee = event.attendees.find(a =>
                    a.email === email
                );
            }
        }

        if (!attendee) {
            return res.status(403).json({
                message: 'You are not invited to this event'
            });
        }

        // Check existing status
        if (attendee.status === responseStatus) {
            return res.status(409).json({
                message: `Invitation is already ${responseStatus.toLowerCase()}`
            });
        }

        // Update attendee status
        const updatedEvent = await Event.findOneAndUpdate(
            {
                _id: eventId,
                'attendees._id': attendee._id
            },
            {
                $set: { 'attendees.$.status': responseStatus },
                $currentDate: { 'attendees.$.updatedAt': true }
            },
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            throw new Error('Failed to update attendee status');
        }

        // Prepare notification updates
        const notificationMessage = `${attendee.name || 'Guest'} (${attendee.email}) has ${responseStatus.toLowerCase()} the event invitation`;

        // Update organizer's notifications
        await User.findByIdAndUpdate(
            event.organizer._id,
            {
                $push: {
                    notification: {
                        type: 'Message',
                        sender: userId,
                        event: eventId,
                        message: notificationMessage,
                        seen: false,
                        createdAt: new Date()
                    }
                },
            }
        );

        // Update user's notification status
        const notificationUpdate = await User.findOneAndUpdate(
            {
                _id: userId,
                'notification.event': eventId,
                'notification.type': 'EventInvite'
            },
            {
                $set: {
                    'notification.$[elem].seen': true,
                    'notification.$[elem].updatedAt': new Date()
                }
            },
            {
                new: true,
                arrayFilters: [
                    {
                        'elem.event': new mongoose.Types.ObjectId(eventId),
                        'elem.type': 'EventInvite'
                    }
                ]
            }
        );

        res.status(200).json({
            success: true,
            message: `Event invitation ${responseStatus.toLowerCase()} successfully`,
            data: {
                eventId,
                status: responseStatus,
                updatedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Invite response error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process invitation response',
            error: error.message
        });
    }
};

// Optimized stats endpoint with ObjectId fix
export const getEventStats = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check event existence first
        const eventExists = await Event.exists({ _id: eventId });
        if (!eventExists) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const aggregation = await Event.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(eventId) } },
            { $unwind: '$attendees' },
            {
                $facet: {
                    // Statistics pipeline
                    stats: [
                        {
                            $group: {
                                _id: '$attendees.status',
                                count: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                status: '$_id',
                                count: 1
                            }
                        }
                    ],
                    // All attendees pipeline
                    attendees: [
                        { $sort: { 'attendees.name': 1 } },
                        {
                            $group: {
                                _id: null,
                                allAttendees: { $push: "$attendees" }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                attendees: "$allAttendees"
                            }
                        }
                    ]
                }
            }
        ]);

        // Process statistics
        const statsResult = aggregation[0].stats.reduce((acc, { status, count }) => {
            acc[status.toLowerCase()] = count;
            return acc;
        }, { accepted: 0, pending: 0, declined: 0 });

        // Process attendees
        const attendeesData = aggregation[0].attendees[0]?.attendees || [];

        res.json({
            stats: statsResult,
            attendees: attendeesData.map(attendee => ({
                _id: attendee._id,
                name: attendee.name,
                email: attendee.email,
                status: attendee.status
            }))
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching stats',
            error: error.message
        });
    }
};

// Add Calendar Entry
export const addCalendarToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, date, description, startTime, endTime, priority } = req.body;
        const userId = req.user._id;

        // Validation remains the same
        if (!['high', 'medium', 'low'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }
        if (!title || !date || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Time validation remains the same
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        if (endHours < startHours || (endHours === startHours && endMinutes <= startMinutes)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Direct database update with permissions check
        const result = await Event.updateOne(
            {
                _id: eventId,
                $or: [
                    { organizer: userId },
                    { collaborator: userId }
                ]
            },
            {
                $push: {
                    calendar: {
                        title,
                        date: new Date(date),
                        startTime,
                        endTime,
                        description,
                        priority
                    }
                }
            }
        );


        // Check if any document was matched/modified
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Event not found or unauthorized' });
        }

        res.status(201).json({
            message: 'Calendar entry added successfully',
            entry: {
                title,
                date,
                startTime,
                endTime,
                description,
                priority
            }
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error adding entry',
            error: error.message
        });
    }
};

export const updateCalendarInEvent = async (req, res) => {
    try {
        const { eventId, calendarId } = req.params;
        const updates = req.body;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check permissions
        if (event.organizer.toString() !== userId.toString() &&
            (!event.collaborator || event.collaborator.toString() !== userId.toString())) {
            return res.status(403).json({ message: 'Unauthorized to modify calendar' });
        }

        // Find calendar entry
        const entry = event.calender.id(calendarId);
        if (!entry) {
            return res.status(404).json({ message: 'Calendar entry not found' });
        }

        // Apply updates
        if (updates.title) entry.title = updates.title;
        if (updates.description) entry.description = updates.description;
        if (updates.date) entry.date = new Date(updates.date);
        if (updates.startTime) entry.startTime = new Date(updates.startTime);
        if (updates.endTime) entry.endTime = new Date(updates.endTime);
        if (updates.priority) {
            if (!['high', 'medium', 'low'].includes(updates.priority)) {
                return res.status(400).json({ message: 'Invalid priority value' });
            }
            entry.priority = updates.priority;
        }

        entry.updatedAt = new Date();
        await event.save();

        res.status(200).json({
            message: 'Calendar entry updated successfully',
            entry
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error updating calendar entry',
            error: error.message
        });
    }
};

export const deleteCalendarFromEvent = async (req, res) => {
    try {
        const { eventId, calendarId } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check permissions
        if (event.organizer.toString() !== userId.toString() &&
            (!event.collaborator || event.collaborator.toString() !== userId.toString())) {
            return res.status(403).json({ message: 'Unauthorized to modify calendar' });
        }

        // Remove entry
        event.calender.pull(calendarId);
        await event.save();

        res.status(200).json({
            message: 'Calendar entry deleted successfully',
            remainingEntries: event.calender
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error deleting calendar entry',
            error: error.message
        });
    }
};


// Get Calendar Entries

// Allowed fields for calendar entries
const ALLOWED_CALENDAR_FIELDS = new Set([
    'title',
    'date',
    'startTime',
    'endTime',
    'description',
    'priority'
]);

export const getCalendarEntries = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { date, filter } = req.body;

        // Validate date format if provided
        if (date && isNaN(parseISO(date).getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Process column filters
        const requestedFields = filter ? filter.split(',') : [];
        const validFields = requestedFields.filter(f =>
            ALLOWED_CALENDAR_FIELDS.has(f)
        );

        // Use all fields if no valid filters provided
        const selectedFields = validFields.length > 0
            ? [...validFields, '_id']  // Add _id to requested fields
            : [...Array.from(ALLOWED_CALENDAR_FIELDS), '_id'];

        const event = await Event.findById(eventId)
            .select('calendar organizer')
            .populate('organizer', 'name email');

        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Get calendar entries or empty array if undefined
        const calendarEntries = event.calendar || [];

        // Filter by date if provided
        let filteredEntries = date
            ? calendarEntries.filter(entry =>
                isSameDay(entry.date, parseISO(date))
            )
            : calendarEntries;

        // Project only selected fields
        const projectedEntries = filteredEntries.map(entry => ({
            _id: entry._id,  // Always include ID
            ...selectedFields.reduce((acc, field) => {
                if (field !== '_id') acc[field] = entry[field];
                return acc;
            }, {})
        }));

        res.status(200).json({
            eventId,
            organizer: event.organizer,
            calendarEntries: projectedEntries,
            count: projectedEntries.length,
            returnedFields: selectedFields,
            dateFilter: date || 'all'
        });

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching entries',
            error: error.message
        });
    }
};

export const getOrdered = async (req, res) => {
    try {
        const { eventId } = req.params;

        // 1. Get orders with populated vendor and user data
        const orders = await orderModel.find({ event: eventId })
            .populate('vendor', 'ShopName ShopCategory ShopLogo')
            .populate('user', 'fullName email');

        // 2. Optimize vendor/product lookup
        const vendorIds = [...new Set(orders.map(o => o.vendor._id))];
        const productIds = [...new Set(orders.map(o => o.product))];

        // Get vendors with their relevant products
        const vendors = await Vendor.find({
            _id: { $in: vendorIds },
            'Products._id': { $in: productIds }
        }).select('Products');

        // Create a product map: { vendorId: { productId: product } }
        const productMap = vendors.reduce((acc, vendor) => {
            acc[vendor._id] = vendor.Products.reduce((prodAcc, product) => {
                prodAcc[product._id] = product;
                return prodAcc;
            }, {});
            return acc;
        }, {});

        // 3. Build response with proper error handling
        const populatedOrders = orders.map(order => {
            const vendorProducts = productMap[order.vendor._id] || {};
            const product = vendorProducts[order.product] || null;

            return {
                _id: order._id,
                user: order.user,
                vendor: order.vendor,
                product: product ? product : { _id: order.product },
                quantity: order.quantity,
                status: order.status,
                orderedAt: order.createdAt,
                price: order.price,
                total: order.total
            };
        });

        res.status(200).json(populatedOrders);
    } catch (error) {
        console.error('Error in getOrdered:', error);
        res.status(500).json({
            message: 'Error fetching event orders',
            error: error.message
        });
    }
};


