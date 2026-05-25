import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Request() req: any, @Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.create(req.user.id, createTransactionDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('limit') limit: number = 50,
    @Query('skip') skip: number = 0,
  ) {
    return this.transactionService.findAll(req.user.id, limit, skip);
  }

  @Get('category/:category')
  findByCategory(
    @Request() req: any,
    @Param('category') category: string,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.transactionService.findByCategory(req.user.id, category, month, year);
  }

  @Get('stats/monthly')
  getMonthlyStats(
    @Request() req: any,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.transactionService.getMonthlyStats(req.user.id, month, year);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.transactionService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(id, req.user.id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.transactionService.remove(id, req.user.id);
  }
}
