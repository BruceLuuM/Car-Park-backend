import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ParkingService } from './parking.service';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { Parking } from './entities/parking.entity';
import { Card } from './entities/card.entity';
import { SerialPort } from 'serialport';
import { RegisterDto } from './dto/register-parking.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('parking')
export class ParkingController {
  private serialPort: SerialPort;

  constructor(
    private readonly parkingService: ParkingService,
    private eventEmitter: EventEmitter2,
  ) {
    // try {
    //   this.serialPort = new SerialPort({
    //     path: 'COM5', // Replace with your Arduino's serial port
    //     baudRate: 9600,
    //     dataBits: 8,
    //     parity: 'none',
    //     stopBits: 1,
    //     autoOpen: true,
    //   });
    //   this.serialPort.on('open', () => {
    //     console.log('Serial port opened successfully');
    //   });
    //   this.serialPort.on('error', (err) => {
    //     console.error('Error opening serial port: ', err.message);
    //   });
    // } catch (error) {
    //   console.error('Failed to initialize serial port: ', error.message);
    // }
  }

  @Post('register')
  async registerHuman(@Body() registerDto: RegisterDto): Promise<any> {
    const { name, code, cardId, numberPlate, type } = registerDto;

    // Create Human entity
    const card = await this.parkingService.createCard({
      cardId,
      status: 'registered',
    });

    const human = await this.parkingService.createParkRegister({
      name,
      code,
      numberPlate,
      card,
      type,
    });

    return human;
  }

  @Post('/card')
  async create(@Body() cardData: Partial<Card>): Promise<Card> {
    return this.parkingService.createCard(cardData);
  }

  @Put('/card/:id')
  async update(
    @Param('id') id: number,
    @Body() cardData: Partial<Card>,
  ): Promise<Card> {
    return this.parkingService.update(id, cardData);
  }

  @Post('create')
  createParking(
    @Body()
    createParkingDto: {
      cardId: string;
      numberPlate: string;
      timeIn: Date;
    },
  ): Promise<Parking> {
    const { cardId, numberPlate, timeIn } = createParkingDto;
    return this.parkingService.createParking(
      cardId,
      numberPlate,
      new Date(timeIn),
    );
  }

  @Patch('complete')
  completeParking(
    @Body()
    completeParkingDto: {
      cardId: string;
      numberPlate: string;
      timeOut: Date;
    },
  ): Promise<Parking> {
    const { cardId, numberPlate, timeOut } = completeParkingDto;
    return this.parkingService.completeParking(
      cardId,
      numberPlate,
      new Date(timeOut),
    );
  }

  @Get('/open-servo')
  openServo() {
    // Send the open_servo command to the Arduino
    console.log('open1');
    this.eventEmitter.emit('openServo');
    return 'Servo opened';
  }

  @Get()
  findAll(): Promise<Parking[]> {
    console.log('open');
    return this.parkingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Parking> {
    return this.parkingService.findOne(id);
  }
}
