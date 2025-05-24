import User from "../models/user.model.js";
import mongoose from "mongoose";

export const getNotification = async (req, res) => {
    try {
        const { user } = req;
        const {
            page = 1,
            limit = 20,
            type,
            sender,
            startDate,
            endDate,
            search,
            seen
        } = req.query;

        // Validate and parse parameters
        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.min(parseInt(limit, 10) || 20, 100);
        const skip = (pageNumber - 1) * limitNumber;

        // Build filter conditions
        const matchConditions = [];

        if (type) {
            matchConditions.push({ $eq: ["$$notif.type", type] });
        }

        if (sender) {
            if (!mongoose.Types.ObjectId.isValid(sender)) {
                return res.status(400).json({ message: "Invalid sender ID" });
            }
            matchConditions.push({
                $eq: ["$$notif.sender", new mongoose.Types.ObjectId(sender)]
            });
        }

        if (startDate || endDate) {
            const dateConditions = [];
            const start = startDate && new Date(startDate);
            const end = endDate && new Date(endDate);

            if (start && !isNaN(start)) {
                dateConditions.push({
                    $gte: ["$$notif.createdAt", start]
                });
            }
            if (end && !isNaN(end)) {
                dateConditions.push({
                    $lte: ["$$notif.createdAt", end]
                });
            }

            if (dateConditions.length) {
                matchConditions.push({ $and: dateConditions });
            }
        }

        if (search) {
            matchConditions.push({
                $regexMatch: {
                    input: "$$notif.message",
                    regex: search,
                    options: "i"
                }
            });
        }

        if (seen !== undefined) {
            matchConditions.push({
                $eq: ["$$notif.seen", seen === 'true']
            });
        }

        // Aggregation pipeline
        const pipeline = [
            { $match: { _id: user._id } },
            {
                $project: {
                    filteredNotifications: {
                        $filter: {
                            input: "$notification",
                            as: "notif",
                            cond: matchConditions.length ?
                                { $and: matchConditions } :
                                { $literal: true }
                        }
                    }
                }
            },
            // Extract sender IDs from filteredNotifications
            { $unwind: "$filteredNotifications" },
            {
                $group: {
                    _id: "$_id",
                    filteredNotifications: { $push: "$filteredNotifications" },
                    senderIds: { $addToSet: "$filteredNotifications.sender" }
                }
            },
            // Fetch all sender documents in one query
            {
                $lookup: {
                    from: "users", // Replace with your User collection name
                    localField: "senderIds",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                profilePicture: 1,
                                userName: 1
                            }
                        }
                    ],
                    as: "senders"
                }
            },
            // Replace sender IDs with actual user documents
            {
                $addFields: {
                    filteredNotifications: {
                        $map: {
                            input: "$filteredNotifications",
                            as: "notif",
                            in: {
                                $mergeObjects: [
                                    "$$notif",
                                    {
                                        sender: {
                                            $arrayElemAt: [
                                                {
                                                    $filter: {
                                                        input: "$senders",
                                                        as: "s",
                                                        cond: { $eq: ["$$s._id", "$$notif.sender"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                }
            },
            // Sort and paginate
            {
                $project: {
                    sortedNotifications: {
                        $sortArray: {
                            input: "$filteredNotifications",
                            sortBy: { createdAt: -1 }
                        }
                    },
                    total: { $size: "$filteredNotifications" },
                    totalSeen: {
                        $reduce: {
                            input: "$filteredNotifications",
                            initialValue: 0,
                            in: {
                                $add: [
                                    "$$value",
                                    { $cond: { if: "$$this.seen", then: 1, else: 0 } }
                                ]
                            }
                        }
                    },
                    earliestDate: { $min: "$filteredNotifications.createdAt" },
                    latestDate: { $max: "$filteredNotifications.createdAt" }
                }
            },
            {
                $project: {
                    paginatedNotifications: {
                        $slice: ["$sortedNotifications", skip, limitNumber]
                    },
                    total: 1,
                    totalSeen: 1,
                    earliestDate: 1,
                    latestDate: 1
                }
            }
        ];

        const result = await User.aggregate(pipeline);

        if (!result.length) {
            return res.status(404).json({ message: "User not found" });
        }

        const {
            total,
            totalSeen,
            earliestDate,
            latestDate,
            paginatedNotifications = []
        } = result[0];

        // Categorize paginated results
        const categorized = paginatedNotifications.reduce((acc, notif) => {
            acc[notif.type] = acc[notif.type] || [];
            acc[notif.type].push(notif);
            return acc;
        }, {});

        // Type counts for paginated results
        const typeCounts = Object.entries(categorized)
            .reduce((acc, [type, arr]) => {
                acc[type] = arr.length;
                return acc;
            }, {});

        // Pagination metadata
        const totalPages = Math.ceil(total / limitNumber);
        const hasNext = pageNumber < totalPages;
        const hasPrev = pageNumber > 1;

        res.status(200).json({
            TotalNotification: total,
            TotalSeenNotification: totalSeen,
            TotalUnSeenNotification: total - totalSeen,
            Notifications: categorized,
            Stats: {
                notificationTypeCounts: typeCounts,
                earliestDate,
                latestDate,
                currentPageCount: paginatedNotifications.length
            },
            Pagination: {
                currentPage: pageNumber,
                totalPages,
                hasNextPage: hasNext,
                hasPreviousPage: hasPrev,
                resultsPerPage: limitNumber
            }
        });

    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getNotificationFilters = async (req, res) => {
    try {
        const { user } = req;

        const pipeline = [
            { $match: { _id: user._id } },
            {
                $project: {
                    notifications: {
                        $map: {
                            input: "$notification",
                            as: "notif",
                            in: {
                                date: {
                                    $dateToString: {
                                        format: "%Y-%m-%d",
                                        date: "$$notif.createdAt"
                                    }
                                },
                                sender: "$$notif.sender",
                                type: "$$notif.type",
                                seen: "$$notif.seen"
                            }
                        }
                    }
                }
            },
            { $unwind: "$notifications" },
            { $replaceRoot: { newRoot: "$notifications" } },
            {
                $group: {
                    _id: null,
                    dates: { $addToSet: "$date" },
                    senders: { $addToSet: "$sender" },
                    types: { $addToSet: "$type" },
                    seenStates: { $addToSet: "$seen" }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: {
                        $map: {
                            input: { $setUnion: "$dates" },
                            as: "date",
                            in: {
                                label: {
                                    $dateToString: {
                                        format: "%d %b %Y",
                                        date: { $toDate: "$$date" }
                                    }
                                },
                                value: "$$date"
                            }
                        }
                    },
                    sender: {
                        $filter: {
                            input: { $setUnion: "$senders" },
                            as: "sender",
                            cond: { $ne: ["$$sender", null] }
                        }
                    },
                    type: { $setUnion: "$types" },
                    seen: { $setUnion: "$seenStates" }
                }
            }
        ];

        const result = await User.aggregate(pipeline);
        const filters = result[0] || {};

        // Fetch sender details in parallel
        const senderDetails = filters.sender?.length > 0
            ? await User.find(
                { _id: { $in: filters.sender } },
                { _id: 1, userName: 1, profilePicture: 1 }
            ).lean()
            : [];

        // Build final response
        const response = {};

        if (filters.date?.length) {
            response.date = filters.date
                .sort((a, b) => new Date(b.value) - new Date(a.value))
                .map(d => ({
                    label: d.label,
                    value: d.value
                }));
        }

        if (senderDetails.length) {
            response.sender = senderDetails.map(s => ({
                _id: s._id,
                userName: s.userName,
                profilePicture: s.profilePicture || '/default-avatar.png'
            }));
        }

        if (filters.type?.length) {
            response.type = [...new Set(filters.type)] // Double ensure uniqueness
                .map(t => ({ label: t, value: t }));
        }

        if (filters.seen?.length) {
            response.seen = [...new Set(filters.seen)]
                .map(s => ({
                    label: s ? "Read" : "Unread",
                    value: s
                }));
        }

        res.status(200).json(response);

    } catch (error) {
        console.error("Error fetching filters:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

export const SeeNotification = async (req, res) => {
    try {
        const { user } = req;

        // CORRECTED: Use "notification" (singular) to match schema
        const result = await User.updateOne(
            { _id: user._id },
            { $set: { "notification.$[].seen": true } } // ✅ Proper path
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                message: "User not found or notifications already marked as seen."
            });
        }

        res.status(200).json({ message: "All notifications marked as seen." });
    } catch (error) {
        console.error("Error in SeeNotification Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error." });
    }
};