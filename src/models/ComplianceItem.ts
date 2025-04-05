import { Schema, model, models } from 'mongoose';

export interface IComplianceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  applicableBusinessTypes: string[];
  applicableStates: string[];
  dueDate?: string;
  link?: string;
  status: 'active' | 'inactive';
  steps: Array<{
    order: number;
    description: string;
    estimatedTime?: string;
    requiredDocuments?: string[];
  }>;
  fees?: {
    amount: number;
    description?: string;
  };
  helpfulLinks: Array<{
    title: string;
    url: string;
  }>;
  templateUrl?: string;
}

const complianceItemSchema = new Schema<IComplianceItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  applicableBusinessTypes: { type: [String], required: true },
  applicableStates: { type: [String], required: true },
  dueDate: String,
  link: String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  steps: [{
    order: { type: Number, required: true },
    description: { type: String, required: true },
    estimatedTime: String,
    requiredDocuments: [String]
  }],
  fees: {
    amount: Number,
    description: String
  },
  helpfulLinks: [{
    title: { type: String, required: true },
    url: { type: String, required: true }
  }],
  templateUrl: String
});

export const ComplianceItem = models.ComplianceItem || model<IComplianceItem>('ComplianceItem', complianceItemSchema); 