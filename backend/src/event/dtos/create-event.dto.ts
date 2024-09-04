import { Min, Max, Length } from 'class-validator';
import { EventType }  from '../../event-type/interfaces/event-type.interface';

export class CreateEventDTO {
    readonly id: number;
    @Length(3, 50)
    readonly name: string;
    @Length(3, 200)
    readonly description: string;
    readonly type: EventType;
    @Min(0)
    @Max(10)
    readonly priority: number;
}