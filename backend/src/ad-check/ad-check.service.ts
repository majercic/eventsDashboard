import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdCheckService {
    constructor(private configService: ConfigService) { }

    async isCountryAllowed(countryCode: string): Promise<boolean> {
        try {
            const response = await axios.get(this.configService.get<string>('API_URI'), {
                auth: {
                    username: this.configService.get<string>('API_USERNAME'),
                    password: this.configService.get<string>('API_PASSWORD')
                },
                params: {
                    countryCode: countryCode
                }
            });

            const res = response.data;

            if (res.ads === "sure, why not!") {
                return true;
            } else if (res.ads === "you shall not pass!") {
                return false;
            } else {
                throw new HttpException('Unexpected response body', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        throw new HttpException('Bad Request - missing mandatory parameters', HttpStatus.BAD_REQUEST);
                    case 401:
                        throw new HttpException('Unauthorized - invalid credentials', HttpStatus.UNAUTHORIZED);
                    case 500:
                        throw new HttpException('Server Error - server is temporarily not available', HttpStatus.INTERNAL_SERVER_ERROR);
                    default:
                        throw new HttpException('Unexpected error occurred', error.response.status);
                }
            } else {
                console.log('Data could not be retrieved');
                throw new HttpException('Data could not be retrieved', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
}