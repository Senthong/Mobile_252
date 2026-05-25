import { IsOptional, IsNumber, IsString, IsInt, Min, Max } from 'class-validator';

export class UpdateBudgetDto {
  @IsOptional()
  @IsString()
  categoryName?: string;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsNumber()
  spent?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @IsOptional()
  @IsInt()
  year?: number;
}
