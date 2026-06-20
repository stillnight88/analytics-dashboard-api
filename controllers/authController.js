import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseHelpers.js';

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createUserPayload = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
});

const logUserEvent = async (eventType, userId, additionalMetadata = {}) => {
    try {
        await Event.createEvent({
            eventType,
            userId,
            metadata: {
                timestamp: new Date().toISOString(),
                ...additionalMetadata
            }
        });
    } catch (error) {
        console.error(`Failed to log ${eventType} event:`, error.message);
    };
};

export const signUp = async (req, res) => {
    try {
          console.log('Request body:', req.body); // Add this for debugging
        console.log('Content-Type:', req.get('Content-Type')); // And this
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email })
            .select('email')
            .lean();
        if (existingUser) {
            return sendErrorResponse(res, 409, `User with this email already exists`);
        };

        const newUser = new User({ name, email, password, role });
        await newUser.save();

        await logUserEvent('signup', newUser._id, {
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip || req.connection.remoteAddress
        });

        return sendSuccessResponse(res, 201, 'User registered successfully');
    } catch (error) {
        console.error("SignUp error:", error);
        return sendErrorResponse(res, 500, 'Internal Server Error');
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password').lean();
        if (!user) {
            return sendErrorResponse(res, 401, 'Invalid credentials')
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendErrorResponse(res, 401, 'Invalid credentials');
        }

        const userPayload = createUserPayload(user);
        const token = generateToken(userPayload);
        
        await logUserEvent('login', user._id, {
            userAgent: req.get('User-Agent'),
            ipAddress: req.ip || req.connection.remoteAddress,
            loginMethod: 'email_password'
        });

        return sendSuccessResponse(res, 200, 'Login successful', {
            token,
            user: userPayload
        });

    } catch (error) {
        console.error("Login error:", error);
        return sendErrorResponse(res, 500, "Internal Server Error");
    };
};

