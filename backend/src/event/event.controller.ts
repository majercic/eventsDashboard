import { EventService } from './event.service';
import { Request, Response } from 'express';
import { Controller, Get, Res, Req, HttpStatus, Param, Body, Post, Put, Delete } from '@nestjs/common';
import { CreateEventDTO } from './dtos/create-event.dto';

@Controller('events')
export class EventController {
    constructor(private readonly appService: EventService) { }

    @Get()
    async getEvents(@Req() req: Request, @Res() res: Response) {
        const ip = req.ip === '::1' ? req.headers['x-forwarded-for'] : req.ip;
        const events = await this.appService.getEvents(ip.toString());
        return res.status(HttpStatus.OK).json(events);
    }

    @Get('/:id')
    async getEvent(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {    
        const event = await this.appService.getEvent(id);
        return res.status(HttpStatus.OK).json(event);
    }

    @Post('/create') 
    async createEvent(@Req() req: Request, @Res() res: Response, @Body() createEventData: CreateEventDTO) {
        const ip = req.ip === '::1' ? req.headers['x-forwarded-for'] : req.ip;
        const event = await this.appService.createEvent(createEventData, ip.toString());
        return res.status(HttpStatus.OK).json(event);
    }  

    @Put('/update/:id')
    async updateEvent(@Req() req: Request, @Res() res: Response, @Param('id') id: string, @Body() updateEventData: CreateEventDTO) {
        const event = await this.appService.updateEvent(id, updateEventData);
        return res.status(HttpStatus.OK).json(event);
    }

    @Delete('/delete/:id')
    async deleteEvent(@Req() req: Request, @Res() res: Response, @Param('id') id: string) {
        const event = await this.appService.deleteEvent(id);
        return res.status(HttpStatus.OK).json(event);
    }
}