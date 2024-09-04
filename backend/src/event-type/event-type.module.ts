import { Module } from '@nestjs/common';
import { EventTypeService } from './event-type.service';
import { EventTypeController } from './event-type.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventTypeSchema } from './schemas/event-type.schema';
import { IpService } from '../ip/ip.service';
import { AdCheckService } from '../ad-check/ad-check.service';
import { DbseedService } from '../dbseed/dbseed.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'EventType', schema: EventTypeSchema }])
  ],
  controllers: [EventTypeController],
  providers: [EventTypeService, IpService, AdCheckService, DbseedService]
})
export class EventTypeModule {}
