import { Document } from 'mongoose';

export interface Event extends Document {
  readonly id: number;
  readonly name: string;  
  readonly description: string;
  readonly type: string;
  readonly priority: number; 
  readonly country: string;
}