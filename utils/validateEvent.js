import { sendErrorResponse } from "../utils/responseHelpers.js";
export const validateEvent = (req, res, next) => {
    const { eventType, metadata = {} } = req.body;

   if (!eventType || typeof eventType !== "string") {
            return sendErrorResponse(res, 400, "eventType is required and must be a string");
        }

    if (metadata && typeof metadata !== 'object') {
        return sendErrorResponse(res, 400, "Metadata must be a JSON object");
    }
    next();
};
