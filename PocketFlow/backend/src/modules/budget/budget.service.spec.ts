import { Test, TestingModule } from '@nestjs/testing';
import { BudgetService } from './budget.service';
import { getModelToken } from '@nestjs/mongoose';
import { Budget } from '../../schemas/budget.schema';

describe('BudgetService', () => {
  let service: BudgetService;
  let mockBudgetModel: any;

  beforeEach(async () => {
    mockBudgetModel = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetService,
        {
          provide: getModelToken(Budget.name),
          useValue: mockBudgetModel,
        },
      ],
    }).compile();

    service = module.get<BudgetService>(BudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
