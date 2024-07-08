import { Injectable } from '@nestjs/common';
import { CreateParkingDto } from './dto/create-parking.dto';
import { UpdateParkingDto } from './dto/update-parking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Parking } from './entities/parking.entity';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { ParkRegister } from './entities/parkRegister.entity';

@Injectable()
export class ParkingService {
  constructor(
    @InjectRepository(Parking)
    private parkingRepository: Repository<Parking>,

    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,

    @InjectRepository(ParkRegister)
    private readonly parkRegisterRepository: Repository<ParkRegister>,
  ) {}

  calculateParkingFee(timeIn: Date, timeOut: Date): number {
    const diffInMs = timeOut.getTime() - timeIn.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const hourlyRate = 5; // Example rate per hour
    return Math.ceil(diffInHours) * hourlyRate;
  }

  async create(cardData: Partial<Card>): Promise<Card> {
    const card = this.cardRepository.create(cardData);
    return await this.cardRepository.save(card);
  }

  async update(id: number, cardData: Partial<Card>): Promise<Card> {
    await this.cardRepository.update(id, cardData);
    return this.cardRepository.findOne({ where: { id } });
  }

  async createParkRegister(data: Partial<ParkRegister>): Promise<ParkRegister> {
    const human = this.parkRegisterRepository.create(data);
    return await this.parkRegisterRepository.save(human);
  }

  async findById(id: number): Promise<ParkRegister | undefined> {
    return this.parkRegisterRepository.findOne({ where: { id: id } });
  }

  async createParking(
    cardId: string,
    numberPlate: string,
    timeIn: Date,
  ): Promise<Parking> {
    let currentParking = await this.parkingRepository.findOne({
      where: { numberPlate, timeOut: null },
    });
    timeIn.setHours(timeIn.getHours() + 7);

    if (currentParking) {
      // Update existing parking entry
      currentParking.timeIn = timeIn;
      // currentParking.timeOut = null;
    } else {
      // Create new parking entry
      if (numberPlate && numberPlate.trim() !== '') {
        currentParking = this.parkingRepository.create({
          numberPlate,
          timeIn: timeIn,
        });
      } else {
        // Handle case where numberPlate is null or blank
        throw new Error('Number plate must be provided.');
      }
    }

    // Update card status to 'used'
    await this.cardRepository.update({ cardId }, { status: 'used' });

    // Save the parking entry (either newly created or updated)
    return this.parkingRepository.save(currentParking);

    // const parking = await this.parkingRepository.create({
    //   numberPlate,
    //   timeIn,
    // });
    // await this.cardRepository.update({ cardId }, { status: 'used' });

    // return this.parkingRepository.save(parking);
  }

  async completeParking(id: number, timeOut: Date): Promise<Parking> {
    const parking = await this.parkingRepository.findOne({ where: { id } });
    if (!parking) {
      throw new Error('Parking record not found');
    }
    timeOut.setHours(timeOut.getHours() + 7);

    parking.timeOut = timeOut;
    parking.money = this.calculateParkingFee(parking.timeIn, timeOut);
    return this.parkingRepository.save(parking);
  }

  async findAll(): Promise<Parking[]> {
    return this.parkingRepository.find();
  }

  async findOne(id: number): Promise<Parking> {
    return this.parkingRepository.findOne({ where: { id } });
  }
}
