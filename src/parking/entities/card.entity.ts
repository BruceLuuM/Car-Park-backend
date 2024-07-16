import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
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

  @OneToMany(() => Parking, (parking) => parking.card, { nullable: true })
  @JoinColumn()
  parking: Parking;

  @OneToOne(() => ParkRegister, (human) => human.card)
  @JoinColumn()
  human: ParkRegister;
}
