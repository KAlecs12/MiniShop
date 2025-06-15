import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface Product {
  id: string;
  isAvailable: boolean;
  stock: number;
}

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3000';
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || 'http://cart-service:3000';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly httpService: HttpService,
  ) {}

  async createOrder(userId: string): Promise<Order> {
    // Récupérer le panier
    const cartResponse = await firstValueFrom(
      this.httpService.get<Cart>(`${CART_SERVICE_URL}/cart/${userId}`)
    );
    const cart = cartResponse.data;

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Vérifier la disponibilité des produits
    for (const item of cart.items) {
      const productResponse = await firstValueFrom(
        this.httpService.get<Product>(`${PRODUCT_SERVICE_URL}/products/${item.productId}`)
      );
      const product = productResponse.data;

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.isAvailable || product.stock < item.quantity) {
        throw new BadRequestException(`Product ${item.productId} is not available in sufficient quantity`);
      }
    }

    // Créer la commande
    const order = this.orderRepository.create({
      userId,
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: cart.totalPrice,
      status: OrderStatus.PENDING,
    });

    // Sauvegarder la commande
    const savedOrder = await this.orderRepository.save(order);

    // Vider le panier
    await firstValueFrom(
      this.httpService.delete(`${CART_SERVICE_URL}/cart/${userId}`)
    );

    return savedOrder;
  }

  async getOrder(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getUserOrders(userId: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = status;
    return this.orderRepository.save(order);
  }
}
