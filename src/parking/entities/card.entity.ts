import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Parking } from './parking.entity';
import { ParkRegister } from './parkRegister.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardId: string;

  @Column()
  status: string; //new, used

  @OneToOne(() => Parking, (parking) => parking.card, { nullable: true })
  @JoinColumn()
  parking: Parking;

  @OneToOne(() => ParkRegister, (human) => human.card)
  @JoinColumn()
  human: ParkRegister;
}
