import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { AdCheckService } from '../ad-check/ad-check.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }])
  ],
  controllers: [EventController],
  providers: [EventService, AdCheckService]
})
export class EventModule {}
