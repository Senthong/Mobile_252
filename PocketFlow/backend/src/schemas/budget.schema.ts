import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BudgetDocument = HydratedDocument<Budget>;

@Schema({ timestamps: true })
export class Budget {
  @Prop({
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  categoryId: string;

  @Prop({
    required: true,
  })
  categoryName: string;

  @Prop({
    required: true,
    min: 0,
  })
  limit: number;

  @Prop({
    default: 0,
    min: 0,
  })
  spent: number;

  @Prop({
    required: true,
    min: 1,
    max: 12,
  })
  month: number;

  @Prop({
    required: true,
  })
  year: number;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);

// Add index for efficient querying
BudgetSchema.index({ userId: 1, year: 1, month: 1 });
