import mongoose from 'mongoose';

const businessPlanSectionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  version: {
    type: Number,
    default: 1,
  },
});

const businessPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  industry: {
    type: String,
    required: [true, 'Industry is required'],
    enum: ['Manufacturing', 'Services', 'Retail', 'Technology', 'Agriculture', 'Other'],
  },
  businessIdea: {
    type: String,
    required: [true, 'Business idea description is required'],
    minlength: [50, 'Business idea must be at least 50 characters long'],
  },
  targetMarket: {
    type: String,
    required: [true, 'Target market description is required'],
  },
  sections: {
    executiveSummary: businessPlanSectionSchema,
    marketAnalysis: businessPlanSectionSchema,
    operations: businessPlanSectionSchema,
    marketing: businessPlanSectionSchema,
    financialProjections: businessPlanSectionSchema,
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'reviewed', 'final'],
    default: 'draft',
  },
  versionHistory: [{
    version: Number,
    updatedAt: Date,
    changes: String,
  }],
}, {
  timestamps: true,
});

// Add indexes for common queries
businessPlanSchema.index({ userId: 1 });
businessPlanSchema.index({ status: 1 });

export interface IBusinessPlan extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  industry: string;
  businessIdea: string;
  targetMarket: string;
  sections: {
    executiveSummary: {
      content: string;
      lastUpdated: Date;
      version: number;
    };
    marketAnalysis: {
      content: string;
      lastUpdated: Date;
      version: number;
    };
    operations: {
      content: string;
      lastUpdated: Date;
      version: number;
    };
    marketing: {
      content: string;
      lastUpdated: Date;
      version: number;
    };
    financialProjections: {
      content: string;
      lastUpdated: Date;
      version: number;
    };
  };
  status: 'draft' | 'generated' | 'reviewed' | 'final';
  versionHistory: Array<{
    version: number;
    updatedAt: Date;
    changes: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const BusinessPlan = mongoose.models.BusinessPlan || mongoose.model<IBusinessPlan>('BusinessPlan', businessPlanSchema); 