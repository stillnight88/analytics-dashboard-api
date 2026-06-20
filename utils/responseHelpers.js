import { Types } from "mongoose";

export const sendSuccessResponse = (response, statusCode, message, data = null) => {
    const jsonRes = {
        success: true,
        message
    };
    if (data) jsonRes.data = data;
    return response.status(statusCode).json(jsonRes);
};

export const sendErrorResponse = (response, statusCode, message) => {
    return response.status(statusCode).json({
        success: false,
        message
    });
};

export const validateObjectId = (id) => Types.ObjectId.isValid(id);