import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseUtil } from 'src/common/util/response.util';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSort } from './enum/product-sort.enum';
import { ProductService } from './product.service';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('product')
  async createProduct(@Body() creatProductDto: CreateProductDto) {
    const product = await this.productService.createProduct(creatProductDto);

    return ResponseUtil.success({ product });
  }
  @Get('product')
  async getProdcutList(
    @Query('brand') brand?: string,
    @Query('color') color?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('sort') sort?: ProductSort,
  ) {
    const filters = {
      brand,
      color,
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
    };
    const product = await this.productService.getProductList(filters, sort);
    return ResponseUtil.success({ product });
  }
  @Get('product/:id')
  async getProduct(@Param('id') productId: number) {
    const product = await this.productService.getProduct(productId);

    return ResponseUtil.success({ product });
  }
  @Patch('product/:id')
  async updateProduct(
    @Param('id') productId: number,
    @Body() updateDto: UpdateProductDto,
  ) {
    const product = await this.productService.updateProduct(
      productId,
      updateDto,
    );

    return ResponseUtil.success({ product });
  }
  @Delete('product/:id')
  async deleteProduct(@Param('id') productId: number) {
    const product = await this.productService.deleteProduct(productId);

    return ResponseUtil.success({ product });
  }
}
