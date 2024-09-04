import * as mongoose from 'mongoose';

export const EventSchema = new mongoose.Schema({
    id: {type: Number, required: true, unique: true},   
    name: {type: String, required: true},
    description: {type: String, required: true},
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'EventType', required: true },
    priority: {type: String, required: true},
    country: {type: String, required: true}
}, {strict: false});

EventSchema.index({ id: 1 }, { unique: true });

EventSchema.on('index', error => {
    if (error) {
        console.error('Index creation error:', error);
    }
});