import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Order, OrderStatus } from './entities/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new order from cart' })
  @ApiResponse({ status: 201, description: 'Order created', type: Order })
  async createOrder(@Param('userId') userId: string): Promise<Order> {
    return this.orderService.createOrder(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all orders for a user' })
  @ApiResponse({ status: 200, description: 'Returns all orders', type: [Order] })
  async getUserOrders(@Param('userId') userId: string): Promise<Order[]> {
    return this.orderService.getUserOrders(userId);
  }

  @Get(':userId/:orderId')
  @ApiOperation({ summary: 'Get a specific order' })
  @ApiResponse({ status: 200, description: 'Returns the order', type: Order })
  async getOrder(
    @Param('userId') userId: string,
    @Param('orderId') orderId: string,
  ): Promise<Order> {
    return this.orderService.getOrder(userId, orderId);
  }

  @Post(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated', type: Order })
  async updateOrderStatus(
    @Param('orderId') orderId: string,
    @Body('status') status: OrderStatus,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
