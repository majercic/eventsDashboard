import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { Model } from 'mongoose';
import { Event } from './interfaces/event.interface';
import { EventType } from '../event-type/interfaces/event-type.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('EventService', () => {
    let service: EventService;
    let eventModel: Model<Event>;
    let eventTypeModel: Model<EventType>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getModelToken('Event'),
                    useValue: {
                        findById: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<EventService>(EventService);
        eventModel = module.get<Model<Event>>(getModelToken('Event'));
    });

    it('should return the event if the country code matches', async () => {
        const mockEvent = { id: 1, name: 'Event1', country: 'US' };
        (eventModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEvent),
        });

        const result = await service.getEvent('1', 'US');
        expect(result).toEqual(mockEvent);
    });
    it('should throw an error if the country code does not match', async () => {
        const mockEvent = { id: 1, name: 'Event1', country: 'US' };
        (eventModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEvent),
        });

        await expect(service.getEvent('1', 'SI')).rejects.toThrow(
            new HttpException('You are not allowed to view this event', HttpStatus.FORBIDDEN)
        );
    });
    it('it should not delete the event if the country code does not match', async () => {
        const mockEvent = { id: 1, name: 'Event1', country: 'US' };
        (eventModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEvent),
        });

        await expect(service.deleteEvent('1', 'SI')).rejects.toThrow(
            new HttpException('You are not allowed to delete this event', HttpStatus.FORBIDDEN)
        );
    });
    it('it should not update the event if the country code does not match', async () => {
        const mockEvent = { id: 1, name: 'Event1', country: 'US' };
        (eventModel.findById as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEvent),
        });

        await expect(service.updateEvent('1', {
            name: 'Event2',
            description: '',
            type: undefined,
            priority: 0
        }, 'SI')).rejects.toThrow(
            new HttpException('You are not allowed to update this event', HttpStatus.FORBIDDEN)
        );
    });
    it('should not create the event if the id already exists', async () => {
        const mockEvent = { id: 123, name: 'Event1', country: 'US' };
        (eventModel.findOne as jest.Mock).mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockEvent),
        });

        await expect(service.createEvent({
            id: 123,
            name: 'Event2',
            description: '',
            type: undefined,
            priority: 0
        }, 'SI')).rejects.toThrow(
            new HttpException('Event with this ID already exists', HttpStatus.CONFLICT)
        );
    });
});