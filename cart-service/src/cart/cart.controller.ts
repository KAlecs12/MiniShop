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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cart } from './entities/cart.entity';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  @ApiOperation({ summary: 'Get user cart' })
  @ApiResponse({ status: 200, description: 'Returns the cart', type: Cart })
  async getCart(@Param('userId') userId: string): Promise<Cart> {
    return this.cartService.getCart(userId);
  }

  @Post(':userId/items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiResponse({ status: 200, description: 'Item added to cart', type: Cart })
  async addItem(
    @Param('userId') userId: string,
    @Body() body: { productId: string; quantity: number },
  ): Promise<Cart> {
    return this.cartService.addItem(userId, body.productId, body.quantity);
  }

  @Delete(':userId/items/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiResponse({ status: 200, description: 'Item removed from cart', type: Cart })
  async removeItem(
    @Param('userId') userId: string,
    @Param('productId') productId: string,
  ): Promise<Cart> {
    return this.cartService.removeItem(userId, productId);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiResponse({ status: 200, description: 'Cart cleared', type: Cart })
  async clearCart(@Param('userId') userId: string): Promise<Cart> {
    return this.cartService.clearCart(userId);
  }
}
