import mongoose from 'mongoose';

const marketplaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String,
    required: true
  },
  website: {
    type: String,
    required: true
  },
  industries: {
    type: [String],
    required: true
  },
  productTypes: {
    type: [String],
    required: true
  },
  targetMarket: {
    type: [String],
    required: true
  },
  commissionRate: {
    type: Number,
    required: true
  },
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  features: [{
    title: String,
    description: String
  }],
  requirements: [{
    title: String,
    description: String
  }],
  onboardingSteps: [{
    order: Number,
    title: String,
    description: String
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  supportedRegions: {
    type: [String],
    default: ["All India"]
  },
  paymentMethods: {
    type: [String],
    default: ["Bank Transfer"]
  },
  shippingOptions: {
    type: [String],
    default: ["Standard"]
  },
  minimumOrderValue: {
    type: Number,
    default: 0
  },
  maximumOrderValue: {
    type: Number,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for common queries
marketplaceSchema.index({ status: 1 });
marketplaceSchema.index({ industries: 1 });
marketplaceSchema.index({ averageRating: -1 });

export interface IMarketPlace extends mongoose.Document {
  name: string;
  description: string;
  logo: string;
  website: string;
  industries: string[];
  productTypes: string[];
  targetMarket: string[];
  commissionRate: number;
  averageRating?: number;
  reviewCount: number;
  features: Array<{
    title: string;
    description: string;
  }>;
  requirements: Array<{
    title: string;
    description: string;
  }>;
  onboardingSteps: Array<{
    order: number;
    title: string;
    description: string;
  }>;
  status: "active" | "inactive";
  supportedRegions: string[];
  paymentMethods: string[];
  shippingOptions: string[];
  minimumOrderValue: number;
  maximumOrderValue: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export const MarketPlace = mongoose.models.MarketPlace || mongoose.model<IMarketPlace>("MarketPlace", marketplaceSchema);