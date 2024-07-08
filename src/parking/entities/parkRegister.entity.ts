import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Parking } from './parking.entity';
import { Card } from './card.entity';

@Entity()
export class ParkRegister {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  numberPlate: string;

  @Column({ default: false })
  type: string;

  @OneToOne(() => Card, (card) => card.human)
  @JoinColumn()
  card: Card;
}
