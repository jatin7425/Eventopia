import User from "../models/user.model.js";

export const getNotification = async (req, res) => {
    try {
        const user = req.user;

        // Fetch user document with only the notifications field
        const userData = await User.findById(user._id)
            .select('notification')
            .lean();

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Extract notifications and send response
        const notifications = userData.notification || [];
        res.status(200).json(notifications);

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ 
            message: "Internal server error",
            error: error.message 
        });
    }
};