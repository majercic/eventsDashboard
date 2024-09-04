import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventType } from './interfaces/event-type.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AdCheckService } from '../ad-check/ad-check.service';

@Injectable()
export class EventTypeService {
    constructor(
        @InjectModel('EventType') 
        private readonly eventTypeModel: Model<EventType>,
        private readonly adCheckService: AdCheckService
    ) { }

    async getEventTypes(cc: string) {
        const adAllowed = await this.adCheckService.isCountryAllowed(cc);
        console.log('Country code:', cc);
        console.log('Ad allowed:', adAllowed);
        if (adAllowed) {
            return await this.eventTypeModel.find().exec();
        } else {
            return await this.eventTypeModel.find({ restricted: false }).exec();
        }
    }
}
