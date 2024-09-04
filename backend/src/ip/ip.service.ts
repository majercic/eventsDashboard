import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as geoip from 'geoip-lite';

@Injectable()
export class IpService {
    async getCountryCodeFromIp(ip: string): Promise<string> {
        try {
            const geo = geoip.lookup(ip);
            return geo.country;
        } catch (error) {
            throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}