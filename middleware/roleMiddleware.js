import { sendSuccessResponse, sendErrorResponse } from "../utils/responseHelpers.js";
export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return sendErrorResponse(res, 401, 'Authentication required');
        };

        if (!req.user.role) {
            return sendErrorResponse(res, 403, 'User role not defined');
        };

        if (req.user.role.toLowerCase() !== 'admin') {
            return sendErrorResponse(res, 403, 'Access denied. Admin privileges required');
        };

        next();
    } catch (error) {
        console.error("Admin middleware error:", error.message);
        return sendErrorResponse(res, 500, 'Authorization check failed');
    };
};