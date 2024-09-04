import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { EventTypeController } from './event-type.controller';
import { EventTypeService } from './event-type.service';



describe('EventTypeController', () => {
    let app: INestApplication;
    let eventTypeService = { getEventTypes: jest.fn() };

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [EventTypeController],
            providers: [
                {
                    provide: EventTypeService,
                    useValue: eventTypeService,
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it(`/GET event-types should return event types`, async () => {
        const mockEventTypes = [{ name: 'Event1', restricted: false }, { name: 'Event2', restricted: true, }];
        eventTypeService.getEventTypes.mockResolvedValue(mockEventTypes);

        const response = await request(app.getHttpServer())
            .get('/event-types')
            .set('x-forwarded-for', '::ffff:127.0.0.1') 
            .expect(200);
            
        expect(response.body).toEqual(mockEventTypes);
        expect(eventTypeService.getEventTypes).toHaveBeenCalledWith('::ffff:127.0.0.1');
    });
});