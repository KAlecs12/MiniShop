import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class GetProductDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the product' })
  id: number;

  @ApiProperty({ example: 'Product Name', description: 'Name of the product' })
  name: string;

  @ApiProperty({
    example: 'A short description',
    description: 'Description of the product',
  })
  description: string;

  @ApiProperty({ example: 99.99, description: 'Price of the product' })
  price: number;

  @ApiProperty({ example: true, description: 'Availability status' })
  isAvailable: boolean;

  constructor(partial: Partial<Product>) {
    Object.assign(this, partial);

    this.isAvailable = partial?.stock ? partial.stock > 0 : false;
  }
}
