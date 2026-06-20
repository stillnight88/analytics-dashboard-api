import Event from "../models/Event.js";
import { sendSuccessResponse, sendErrorResponse, validateObjectId } from "../utils/responseHelpers.js";

const logUserEvent = async (eventType, userId, additionalMetadata = {}) => {
    try {
        await Event.createEvent({
            eventType,
            userId,
            metadata: {
                timestamp: new Date().toISOString(),
                ...additionalMetadata
            }
        })
    } catch (error) {
        console.error(`Failed to log ${eventType} event:`, error.message);
    }
}

export const createEvent = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!validateObjectId(userId)) {
            return sendErrorResponse(res, 400, "Invalid user ID");
        }

        const { eventType, metadata = {}  } = req.body;

        await logUserEvent(eventType, userId, metadata);
        return sendSuccessResponse(res, 201, "Event logged successfully");


    } catch (error) {
        console.error("Log Event Error:", error);
        return sendErrorResponse(res, 500, "Internal server error");
    }
};
