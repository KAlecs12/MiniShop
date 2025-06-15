import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3000';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private readonly httpService: HttpService,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
    });

    if (!cart) {
      return this.cartRepository.save({ userId, items: [], totalPrice: 0 });
    }

    return cart;
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<Cart> {
    const cart = await this.getCart(userId);
    
    // Vérifier le produit via le Product Service
    const product = await firstValueFrom(
      this.httpService.get(`${PRODUCT_SERVICE_URL}/products/${productId}`)
    );

    if (!product.data) {
      throw new NotFoundException('Product not found');
    }

    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.data.price;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.data.price,
        cart,
      } as CartItem);
    }

    cart.totalPrice = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    cart.totalPrice = this.calculateTotal(cart.items);
    return this.cartRepository.save(cart);
  }

  async clearCart(userId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = [];
    cart.totalPrice = 0;
    return this.cartRepository.save(cart);
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}
