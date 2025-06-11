import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ type: 'int' })
  quantity: number;
}
