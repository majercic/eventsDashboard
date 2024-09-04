import { EventTypeService } from './event-type.service';
import { Controller, Get, Res, Req, HttpStatus } from '@nestjs/common';
import { createCipher } from 'crypto';
import { Request, Response } from 'express';

@Controller('event-types')
export class EventTypeController {
    constructor(private readonly eventTypeService: EventTypeService) { }

    @Get()
    async getEventTypes( @Req() req: Request, @Res() res: Response) {
        const cc = req.headers['x-country-code']
        const eventTypes = await this.eventTypeService.getEventTypes(cc.toString());
        return res.status(HttpStatus.OK).json(eventTypes);
    }
}