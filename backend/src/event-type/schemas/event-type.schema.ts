import * as mongoose from 'mongoose';

export const EventTypeSchema = new mongoose.Schema({ 
    name: {type: String, required: true},
    restricted: {type: Boolean, required: true}
}, {strict: false});
