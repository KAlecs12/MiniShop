import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from 'cart/entities/cart-item.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @OneToMany(() => CartItem, (item) => item.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
