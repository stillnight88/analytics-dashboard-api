import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: [true, 'Event type is required'],
        enum: {
            values: ['login', 'signup', 'view_product', 'click_button', 'purchase'],
            message: 'Event type must be one of: login, logout, view_product, click_button, purchase'
        },
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: () => ({})
    }
}, {
    timestamps: true,
    collection: 'events'
});

EventSchema.index({ userId: 1, eventType: 1, timestamp: -1 });

EventSchema.statics.createEvent = function (eventData) {
    return this.create({
        eventType: eventData.eventType,
        userId: eventData.userId,
        metadata: eventData.metadata || {}
    });
};

EventSchema.methods.toEventLog = function() {
    return {
        id: this._id,
        eventType: this.eventType,
        userId: this.userId,
        timestamp: this.timestamp,
        metadata: this.metadata
    };
};

const Event = mongoose.model('Event', EventSchema);
export default Event;