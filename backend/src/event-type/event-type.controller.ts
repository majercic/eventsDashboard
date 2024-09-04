import { EventTypeService } from './event-type.service';
import { Controller, Get, Res, Req, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('event-types')
export class EventTypeController {
    constructor(private readonly eventTypeService: EventTypeService) { }

    @Get()
    async getEventTypes( @Req() req: Request, @Res() res: Response) {
        const ip = req.ip === '::1' ? req.headers['x-forwarded-for'] : req.ip;

        const eventTypes = await this.eventTypeService.getEventTypes(ip.toString());
        return res.status(HttpStatus.OK).json(eventTypes);
    }
}