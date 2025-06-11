import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  create(createCartDto: CreateCartDto) {
    // Call the product service to check the availability of cart

    return 'This action adds a new cart';
  }

  findOne(userId: number) {
    return `This action returns a #${userId} cart`;
  }

  update(userId: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${userId} cart`;
  }

  remove(userId: number) {
    return `This action removes a #${userId} cart`;
  }
}
