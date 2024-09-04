import { Document } from 'mongoose';

export interface EventType extends Document {
    readonly name: string;
    readonly restricted: boolean;
}