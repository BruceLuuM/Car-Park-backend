import { Module } from '@nestjs/common';
import { ParkingService } from './parking.service';
import { ParkingController } from './parking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Card } from './entities/card.entity';
import { ParkRegister } from './entities/parkRegister.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parking, Card, ParkRegister])],

  controllers: [ParkingController],
  providers: [ParkingService],
})
export class ParkingModule {}
