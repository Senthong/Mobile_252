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
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Request() req: any, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(req.user.id, createBudgetDto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('month') month?: number,
    @Query('year') year?: number,
  ) {
    return this.budgetService.findAll(req.user.id, month, year);
  }

  @Get('health')
  getBudgetHealth(
    @Request() req: any,
    @Query('month') month: number,
    @Query('year') year: number,
  ) {
    return this.budgetService.getBudgetHealth(req.user.id, month, year);
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.budgetService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
  ) {
    return this.budgetService.update(id, req.user.id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.budgetService.remove(id, req.user.id);
  }
}
