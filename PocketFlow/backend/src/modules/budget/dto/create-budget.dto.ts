import { IsNotEmpty, IsNumber, IsString, IsInt, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsNumber()
  @IsNotEmpty()
  limit: number;

  @IsInt()
  @Min(1)
  @Max(12)
  @IsNotEmpty()
  month: number;

  @IsInt()
  @IsNotEmpty()
  year: number;
}
