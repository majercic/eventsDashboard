import { Test, TestingModule } from '@nestjs/testing';
import { EventTypeService } from './event-type.service';
import { AdCheckService } from '../ad-check/ad-check.service';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType } from './interfaces/event-type.interface';

describe('EventTypeService', () => {
  let service: EventTypeService;
  let adCheckService: AdCheckService;
  let eventTypeModel: Model<EventType>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventTypeService,
        {
          provide: AdCheckService,
          useValue: {
            isCountryAllowed: jest.fn(),
          },
        },
        {
          provide: getModelToken('EventType'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventTypeService>(EventTypeService);
    adCheckService = module.get<AdCheckService>(AdCheckService);
    eventTypeModel = module.get<Model<EventType>>(getModelToken('EventType'));
  });

  it('should return all event types', async () => {
    (adCheckService.isCountryAllowed as jest.Mock).mockResolvedValue(true);
    (eventTypeModel.find().exec as jest.Mock).mockResolvedValue([{ name: 'Type 1', restricted: false }, { name: 'Type 2', restricted: true }]);

    const result = await service.getEventTypes('89.142.63.220');
    expect(result).toEqual([{ name: 'Type 1', restricted: false }, { name: 'Type 2', restricted: true }]);
    expect(adCheckService.isCountryAllowed).toHaveBeenCalledWith('SI');
    expect(eventTypeModel.find).toHaveBeenCalled();
  });

  it('should return non-restricted event types ', async () => {
    (adCheckService.isCountryAllowed as jest.Mock).mockResolvedValue(false);
    (eventTypeModel.find().exec as jest.Mock).mockResolvedValue([{ name: 'Event1', restricted: false }]);

    const result = await service.getEventTypes('101.53.160.0');
    expect(result).toEqual([{ name: 'Event1', restricted: false }]);
    expect(adCheckService.isCountryAllowed).toHaveBeenCalledWith('US');
    expect(eventTypeModel.find).toHaveBeenCalledWith({ restricted: false });
  });
});