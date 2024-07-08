import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class Parking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  numberPlate: string;

  @Column({ nullable: true })
  timeIn: Date;

  @Column({ nullable: true })
  timeOut: Date;

  @Column({ type: 'decimal', nullable: true })
  money: number;

  @OneToOne(() => Card, (card) => card.parking)
  @JoinColumn()
  card: Card;
}
