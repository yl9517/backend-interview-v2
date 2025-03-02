import { IsInt, IsString } from 'class-validator';
export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  brand: string;

  @IsInt()
  price: number;

  @IsString()
  size: string;

  @IsString()
  color: string;
}
