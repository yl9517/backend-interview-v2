import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductSort } from './enum/product-sort.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  //상품 생성
  async createProduct(dto: CreateProductDto): Promise<Product> {
    const { name, description, brand, price, size, color } = dto;

    const quote = this.productRepository.create({
      name,
      description,
      brand,
      price,
      size,
      color,
    });
    return await this.productRepository.save(quote);
  }

  // 상품 전체 조회
  async getProductList(filters?: any, sort?: ProductSort): Promise<Product[]> {
    let query = this.productRepository.createQueryBuilder('product');

    if (filters.brand) {
      query.andWhere('product.brand = :brand', { brand: filters.brand });
    }
    if (filters.color) {
      query.andWhere('product.color = :color', { color: filters.color });
    }
    if (filters.minPrice && filters.maxPrice) {
      query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', {
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
      });
    }

    switch (sort) {
      case ProductSort.PRICE:
        query.orderBy('product.price', 'ASC');
        break;
      case ProductSort.NAME:
        query.orderBy('product.name', 'ASC');
        break;
      case ProductSort.CREATED_AT:
        query.orderBy('product.createdAt', 'DESC');
        break;
    }

    return await query.getMany();
  }

  // 단일 상품 조회
  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Not found ${id}Product`);
    }
    return product;
  }

  // 상품 수정
  async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.getProduct(id);
    const updatedProduct = Object.assign(product, dto);
    return await this.productRepository.save(updatedProduct);
  }

  // 상품 삭제
  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Not found ${id}Product`);
    }
  }
}
