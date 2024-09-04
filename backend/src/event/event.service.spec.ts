import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EventService } from './event.service';
import { Model } from 'mongoose';
import { Event } from './interfaces/event.interface';

describe('EventService', () => {
    let service: EventService;
    let eventModel: Model<Event>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventService,
                {
                    provide: getModelToken('Event'),
                    useValue: {
                        find: jest.fn().mockReturnThis(),
                        populate: jest.fn().mockReturnThis(),
                        exec: jest.fn(),
                    },
                }
            ],
        }).compile();

        service = module.get<EventService>(EventService);
        eventModel = module.get<Model<Event>>(getModelToken('Event'));
    });

    it('should return all events', async () => {
        (eventModel.find().exec as jest.Mock).mockResolvedValue([{ id: 1, name: 'Event 1', description: 'Description 1', type: 'Type 1', priority: 1}, { id: 2, name: 'Event 2', description: 'Description 2', type: 'Type 2', priority: 2}]);

        const result = await service.getEvents('89.142.63.220')
        expect(result).toEqual([{ id: 1, name: 'Event 1', description: 'Description 1', type: 'Type 1', priority: 1}, { id: 2, name: 'Event 2', description: 'Description 2', type: 'Type 2', priority: 2}]);
        expect(eventModel.find).toHaveBeenCalled();
    });
        
});