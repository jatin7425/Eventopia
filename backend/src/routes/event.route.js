import express from 'express';
import { protectRoute } from "../middleware/auth.middleware.js"; // Assuming protectRoute middleware is used
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    addServiceToEvent,
    addFeedbackToEvent,
    addTodoToEvent,
    updateTodoInEvent,
    deleteTodoFromEvent,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    getEventCart,
    clearCart,
    cartCheckout,
    addAttendee,
    getEventStats,
    addCalendarToEvent,
    updateCalendarInEvent,
    deleteCalendarFromEvent,
    getCalendarEntries,
    respondToEventInvite,
} from '../controllers/event.controller.js';

const router = express.Router();

// Event Routes
router.post('/createEvent', protectRoute, createEvent);
router.get('/getEvents', getEvents);
router.get('/getEventById/:id', getEventById);
router.put('/updateEvent/:id', protectRoute, updateEvent);
router.delete('/deleteEvent/:id', protectRoute, deleteEvent);
router.post('/addServiceToEvent/:id/service', protectRoute, addServiceToEvent);
router.post('/addFeedbackToEvent/:id/feedback', protectRoute, addFeedbackToEvent);
router.post('/:eventId/todos', protectRoute, addTodoToEvent);
router.put('/UpdateStatus/:eventId/todos/', protectRoute, updateTodoInEvent)
router.delete('/delete/:eventId/todos/:index', protectRoute, deleteTodoFromEvent)
router.post("/:eventId/cart/:vendorId", protectRoute, addToCart);
router.delete("/:eventId/cart/:cartId", protectRoute, removeFromCart);
router.put("/:eventId/cart/:cartId", protectRoute, updateCartQuantity);
router.get("/:eventId/cart/", protectRoute, getEventCart);
router.delete("/:eventId/cart/clear", protectRoute, clearCart);
router.patch("/:eventId/cartCheckout", protectRoute, cartCheckout);
router.delete("/:eventId/cart/clear", protectRoute, clearCart);
router.post('/:eventId/attendees', protectRoute, addAttendee);
router.patch('/:eventId/attendees/respond', protectRoute, respondToEventInvite);
router.get('/:eventId/stats', protectRoute, getEventStats);
router.post('/:eventId/calendar', protectRoute, addCalendarToEvent);
router.put('/:eventId/calendar/:calendarId', protectRoute, updateCalendarInEvent);
router.delete('/:eventId/calendar/:calendarId', protectRoute, deleteCalendarFromEvent);
router.get('/:eventId/calendar', protectRoute, getCalendarEntries);

export default router;
