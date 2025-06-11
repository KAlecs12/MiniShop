import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetProductDto } from './dto/get-product.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(): Promise<GetProductDto[]> {
    const products = await this.productService.findAll();

    return products.map((p) => new GetProductDto(p));
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string
  ): Promise<GetProductDto> {
    const p = await this.productService.findOne(id);

    return new GetProductDto(p);
  }
}
