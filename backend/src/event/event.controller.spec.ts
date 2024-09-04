import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('EventController', () => {
  let app: INestApplication;
  let eventService = {
    getEvent: jest.fn(),
    deleteEvent: jest.fn(),
    updateEvent: jest.fn(),
    createEvent: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: eventService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('should return the event if the country code matches', async () => {
    const mockEvent = { id: 1, name: 'Event1', country: 'US' };
    eventService.getEvent.mockResolvedValue(mockEvent);

    const response = await request(app.getHttpServer())
      .get('/events/1')
      .set('x-country-code', 'US')
      .expect(200);

    expect(response.body).toEqual(mockEvent);
    expect(eventService.getEvent).toHaveBeenCalledWith('1', 'US');
  });

  it('should throw an error if the country code does not match', async () => {
    eventService.getEvent.mockRejectedValue(new HttpException('You are not allowed to view this event', HttpStatus.FORBIDDEN));

    await request(app.getHttpServer())
      .get('/events/1')
      .set('x-country-code', 'SI')
      .expect(403);
  });

  it('should return a forbidden error if the country code does not match on delete', async () => {
    eventService.deleteEvent.mockImplementation(() => {
      throw new HttpException('You are not allowed to delete this event', HttpStatus.FORBIDDEN);
    });

    await request(app.getHttpServer())
      .delete('/events/delete/1')
      .set('x-country-code', 'SI')
      .expect(HttpStatus.FORBIDDEN)
      .expect((res) => {
        expect(res.body.message).toBe('You are not allowed to delete this event');
      });
  });
  it('should return a forbidden error if the country code does not match on update', async () => {
    eventService.updateEvent.mockImplementation(() => {
      throw new HttpException('You are not allowed to update this event', HttpStatus.FORBIDDEN);
    });

    await request(app.getHttpServer())
      .put('/events/update/1')
      .set('x-country-code', 'SI')
      .expect(HttpStatus.FORBIDDEN)
      .expect((res) => {
        expect(res.body.message).toBe('You are not allowed to update this event');
      });
  });

  it('should return a conflict error if the event already exists with the same id on insert', async () => {
    eventService.createEvent.mockImplementation(() => {
      throw new HttpException('Event with this ID already exists', HttpStatus.CONFLICT);
    });

    await request(app.getHttpServer())
      .post('/events/create')
      .set('x-country-code', 'SI')
      .send({ id: 1, name: 'Event1', country: 'SI' })
      .expect(HttpStatus.CONFLICT)
      .expect((res) => {
        expect(res.body.message).toBe('Event with this ID already exists');
      });
  });


  afterAll(async () => {
    await app.close();
  });

});
