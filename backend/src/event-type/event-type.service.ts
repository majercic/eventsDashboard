import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { EventType } from './interfaces/event-type.interface';
import { InjectModel } from '@nestjs/mongoose';
import { IpService } from '../ip/ip.service';
import { AdCheckService } from '../ad-check/ad-check.service';

@Injectable()
export class EventTypeService {
    constructor(
        @InjectModel('EventType') 
        private readonly eventTypeModel: Model<EventType>,
        private readonly ipService: IpService,
        private readonly adCheckService: AdCheckService
    ) { }

    async getEventTypes(ip: string) {
        const countryCode = await this.ipService.getCountryCodeFromIp(ip);
        const adAllowed = await this.adCheckService.isCountryAllowed(countryCode);
        console.log('Country code:', countryCode);
        console.log('Ad allowed:', adAllowed);
        if (adAllowed) {
            return await this.eventTypeModel.find().exec();
        } else {
            return await this.eventTypeModel.find({ restricted: false }).exec();
        }
    }
}
