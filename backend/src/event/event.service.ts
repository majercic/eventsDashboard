import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { Event } from './interfaces/event.interface';
import { CreateEventDTO } from './dtos/create-event.dto';
import { UpdateEventDTO } from './dtos/update-event.dto';
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

    async getEvent(id: string, cc: string): Promise<Event> {

        const event = await this.eventModel.findById(id).exec();
        if(event.country !== cc) {
            throw new HttpException('You are not allowed to view this event', HttpStatus.FORBIDDEN);
        } else {
            return event;
        }
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

    async updateEvent(id: string, updateEventDTO: UpdateEventDTO, cc: string): Promise<Event> {
        const existingEvent = await this.eventModel.findById(id).exec();
        if (existingEvent.country !== cc) {
            throw new HttpException('You are not allowed to update this event', HttpStatus.FORBIDDEN);
        }
        const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDTO, { new: true });
        return updatedEvent;        
    }

    async deleteEvent(id: string, cc: string): Promise<Event> {
        const existingEvent = await this.eventModel.findById(id).exec();
        if (existingEvent.country !== cc) {
            throw new HttpException('You are not allowed to delete this event', HttpStatus.FORBIDDEN);
        }
        const deletedEvent = await this.eventModel.findByIdAndDelete(id);
        return deletedEvent;
    }
}
