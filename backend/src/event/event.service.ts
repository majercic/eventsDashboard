import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'; 
import { Event } from './interfaces/event.interface';
import { IpService } from '../ip/ip.service';
import { CreateEventDTO } from './dtos/create-event.dto';

@Injectable()
export class EventService {
    constructor(@InjectModel('Event') 
    private readonly eventModel: Model<Event>,
    private readonly ipService: IpService
) { }
    
    async getEvents(ip: string): Promise<Event[]> {
        const countryCode = await this.ipService.getCountryCodeFromIp(ip);
        return this.eventModel
        .find({ country: countryCode })
        .populate('type')
        .exec();
    }

    async getEvent(id: string): Promise<Event> {
        return this.eventModel.findById(id).exec();
    }

    async createEvent(createEventDTO: CreateEventDTO, ip: string): Promise<Event> {
        const countryCode = await this.ipService.getCountryCodeFromIp(ip);
        const content = { ...createEventDTO, country: countryCode }; 
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
