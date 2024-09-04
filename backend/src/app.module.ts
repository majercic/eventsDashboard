import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventTypeModule } from './event-type/event-type.module';
import { ConfigModule } from '@nestjs/config';
import { EventService } from './event/event.service';
import { EventController } from './event/event.controller';
import { EventModule } from './event/event.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRoot('mongodb://localhost/dashboard'),
    EventTypeModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
