import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({
    required: true,
    index: true,
  })
  userId: string;

  @Prop({
    required: true,
    min: 0,
  })
  amount: number;

  @Prop({
    type: String,
    enum: ['income', 'expense'],
    required: true,
  })
  type: string;

  @Prop({
    required: true,
  })
  category: string;

  @Prop({
    default: '',
  })
  note: string;

  @Prop({
    required: true,
    default: new Date(),
  })
  date: Date;

  @Prop({
    default: 'cash',
  })
  account: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Add index for efficient querying
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1 });
TransactionSchema.index({ userId: 1, category: 1 });
