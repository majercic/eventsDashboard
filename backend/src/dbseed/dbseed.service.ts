import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventType } from '../event-type/interfaces/event-type.interface';

@Injectable()
export class DbseedService implements OnModuleInit {
    constructor(@InjectModel('EventType') private readonly eventTypeModel: Model<EventType>) {}

    async onModuleInit() {
        await this.seedDatabase();
    }

    private async seedDatabase() {
        //check if there are any event types in the database
        const eventTypes = await this.eventTypeModel.find().exec();
        if (eventTypes.length === 4) {
            console.log('Event types already seeded');
            return;
        }
        const predefinedTypes = [
            { name: 'crosspromo', restricted: false },
            { name: 'liveops', restricted: false },
            { name: 'app', restricted: false },
            { name: 'ads', restricted: true }
        ];

        try {
            // Clear existing data
            await this.eventTypeModel.deleteMany({});

            // Insert predefined data
            await this.eventTypeModel.insertMany(predefinedTypes);

            console.log('Event types seeded successfully');
        } catch (error) {
            console.error('Error seeding database:', error);
        }

    }
}

