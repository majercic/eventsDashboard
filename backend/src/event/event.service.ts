import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { Event } from './interfaces/event.interface';
import { CreateEventDTO } from './dtos/create-event.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class EventService {
    constructor(@InjectModel('Event') 
    private readonly eventModel: Model<Event>
) { }
    
    async getEvents(cc: string): Promise<Event[]> {
        return this.eventModel
        .find({ country: cc })
        .populate('type')
        .exec();
    }

    async getEvent(id: string): Promise<Event> {
        return this.eventModel.findById(id).exec();
    }

    async createEvent(createEventDTO: CreateEventDTO, cc: string): Promise<Event> {
        const existingEvent = await this.eventModel.findOne({ id: createEventDTO.id });
        if (existingEvent) {
            throw new HttpException('Event with this ID already exists', HttpStatus.CONFLICT);
        }
        const content = { ...createEventDTO, country: cc }; 
        const newEvent = await this.eventModel.create(content);
        return newEvent.save();
    }

    async updateEvent(id: string, createEventDTO: CreateEventDTO): Promise<Event> {
        const updatedEvent = await this.eventModel.findByIdAndUpdate(id, createEventDTO, { new: true });
        return updatedEvent;        
    }

    async deleteEvent(id: string): Promise<Event> {
        const deletedEvent = await this.eventModel.findByIdAndDelete(id);
        return deletedEvent;
    }
}
