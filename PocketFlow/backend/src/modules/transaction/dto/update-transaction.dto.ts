import { IsOptional, IsNumber, IsEnum, IsString, IsDateString } from 'class-validator';

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(TransactionType)
  type?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  account?: string;
}
