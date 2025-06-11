import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  /**
   *
   * @param id
   */
  async findOne(id: string): Promise<Product> {
    return this.productRepository.findOneOrFail({
      where: {
        id,
      }
    })
  }
}
