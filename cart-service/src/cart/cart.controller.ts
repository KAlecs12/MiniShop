import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Header,
  Headers,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  findOne(@Headers('x-user-id') userId: string, @Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch('')
  update(
    @Headers('x-user-id') userId: string,
    @Body() updateCartDto: UpdateCartDto,
  ) {
    return this.cartService.update(+userId, updateCartDto);
  }

  @Delete('')
  remove(@Headers('x-user-id') userId: string) {
    return this.cartService.remove(+userId);
  }
}
