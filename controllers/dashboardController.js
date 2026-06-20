import Event from "../models/Event.js";
import { sendSuccessResponse, sendErrorResponse, validateObjectId } from "../utils/responseHelpers.js";
import { Parser } from "json2csv";

const buildDateFilter = (startDate, endDate) => {
    const dateFilter = {};

    if (startDate) {
        const start = new Date(startDate);
        if (isNaN(start.getTime())) return null;
        dateFilter.$gte = start;
    }

    if (endDate) {
        const end = new Date(endDate);
        if (isNaN(end.getTime())) return null;
        dateFilter.$lte = end;
    }

    return Object.keys(dateFilter).length ? dateFilter : null;
}

export const getEventSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const dateFilter = buildDateFilter(startDate, endDate);

        if ((startDate || endDate) && !dateFilter) {
            return sendErrorResponse(res, 400, "Invalid date format");
        }


         const matchStage = dateFilter && Object.keys(dateFilter).length
            ? { $match: { timestamp: dateFilter } }
            : null;

        const pipeline = [
            ...(matchStage ? [matchStage] : []),
            {
                $group: {
                    _id: "$eventType",
                    count: { $sum: 1 },
                    firstOccurrence: { $min: "$timestamp" },
                    lastOccurrence: { $max: "$timestamp" },
                    uniqueUsers: { $addToSet: "$userId" }
                }
            },
            {
                $project: {
                    _id: 0,
                    eventType: '$_id',
                    count: 1,
                    firstOccurrence: 1,
                    lastOccurrence: 1,
                    uniqueUserCount: { $size: "$uniqueUsers" }
                }
            },
            { $sort: { count: -1 } }
        ];

        const [summary, totalEvents] = await Promise.all([
            Event.aggregate(pipeline),
            Event.countDocuments(dateFilter || {})
        ]);

        return sendSuccessResponse(res, 200, "Event summary retrieved successfully", {
            summary,
            totalEvents,
            dateRange: {
                startDate: startDate || null,
                endDate: endDate || null
            }
        });
    } catch (error) {
        console.error("Event Summary Error:", error);
        sendErrorResponse(res, 500, "Server error");
    }
};

export const getUserTimeline = async (req, res) => {
    try {
        const { userId } = req.params;
        const { exportCSV } = req.query;
        if (!validateObjectId(userId)) {
            return sendErrorResponse(res, 400, "Invalid user ID");
        }

        const events = await Event.find({ userId })
            .sort({ timestamp: -1 })
            .lean();

        if (exportCSV === 'true') {
            const parser = new Parser();
            const csv = parser.parse(events);
            res.header('Content-Type', 'text/csv');
            res.attachment('user-events.csv');
            return res.send(csv)
        }

        sendSuccessResponse(res, 200, "User timeline retrieved successfully", {
            events,
            count: events.length
        });

    } catch (error) {
        console.error('getUserTimeline error:', error);
        sendErrorResponse(res, 500, "Server error");
    };
};

export const getTopUsers = async (req, res) => {
    try {
        const topUser = await Event.aggregate([
            {
                $group: {
                    _id: '$userId',
                    eventCount: { $sum: 1 }
                }
            },
            { $sort: { eventCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'users',
                   localField: '_id',  // Changed from 'userId' to '_id'
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    userId: "$user._id",
                    name: "$user.name",
                    email: "$user.email",
                    eventCount: 1
                }
            }
        ]);
        sendSuccessResponse(res, 200, "Top users fetched", { topUser })
    } catch (error) {
        console.error("Top Users Error:", error);
        sendErrorResponse(res, 500, "Server error");
    }
}