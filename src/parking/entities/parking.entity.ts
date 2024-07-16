import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
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

  @ManyToOne(() => Card, (card) => card.parking)
  @JoinColumn()
  card: Card;
}
