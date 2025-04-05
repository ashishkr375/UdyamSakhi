import mongoose from 'mongoose';

const eligibilityCriteriaSchema = new mongoose.Schema({
  industryTypes: {
    type: [String],
    enum: ['Manufacturing', 'Services', 'Retail', 'Technology', 'Agriculture', 'Other'],
  },
  businessStages: {
    type: [String],
    enum: ['Ideation', 'Startup', 'Growth', 'Mature'],
  },
  minBusinessAge: {
    type: Number,
    min: 0,
  },
  maxBusinessAge: {
    type: Number,
    min: 0,
  },
  minRevenue: {
    type: Number,
    min: 0,
  },
  maxRevenue: {
    type: Number,
    min: 0,
  },
  requiredDocuments: [{
    type: String,
  }],
  additionalCriteria: [{
    type: String,
  }],
});

const fundingSchemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scheme name is required'],
    unique: true,
    trim: true,
  },
  provider: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Grant', 'Loan', 'Equity', 'Subsidy', 'Other'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  minAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  maxAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  interestRate: {
    type: Number,
    min: 0,
  },
  tenure: {
    min: {
      type: Number,
      min: 0,
    },
    max: {
      type: Number,
      min: 0,
    },
    unit: {
      type: String,
      enum: ['months', 'years'],
    },
  },
  eligibilityCriteria: eligibilityCriteriaSchema,
  applicationProcess: [{
    step: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  }],
  benefits: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming_soon'],
    default: 'active',
  },
  applicationLink: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Application link must be a valid URL',
    },
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Add indexes for common queries
fundingSchemeSchema.index({ type: 1, status: 1 });
fundingSchemeSchema.index({ 'eligibilityCriteria.industryTypes': 1 });
fundingSchemeSchema.index({ 'eligibilityCriteria.businessStages': 1 });
fundingSchemeSchema.index({ minAmount: 1, maxAmount: 1 });

export interface IFundingScheme extends mongoose.Document {
  name: string;
  provider: string;
  type: 'Grant' | 'Loan' | 'Equity' | 'Subsidy' | 'Other';
  description: string;
  minAmount: number;
  maxAmount: number;
  interestRate?: number;
  tenure?: {
    min: number;
    max: number;
    unit: 'months' | 'years';
  };
  eligibilityCriteria: {
    industryTypes: string[];
    businessStages: string[];
    minBusinessAge?: number;
    maxBusinessAge?: number;
    minRevenue?: number;
    maxRevenue?: number;
    requiredDocuments: string[];
    additionalCriteria: string[];
  };
  applicationProcess: Array<{
    step: number;
    description: string;
  }>;
  benefits: string[];
  status: 'active' | 'inactive' | 'coming_soon';
  applicationLink?: string;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const FundingScheme = mongoose.models.FundingScheme || mongoose.model<IFundingScheme>('FundingScheme', fundingSchemeSchema); 