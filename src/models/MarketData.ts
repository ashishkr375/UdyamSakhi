import mongoose, { Schema, Document } from "mongoose";

export interface IMarketData extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  planId: mongoose.Schema.Types.ObjectId;
  tabType: "analysis" | "recommendations" | "strategies";
  data: any; // Store the JSON response from the API
  createdAt: Date;
  updatedAt: Date;
}

const MarketDataSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessPlan",
      required: true,
    },
    tabType: {
      type: String,
      required: true,
      enum: ["analysis", "recommendations", "strategies"],
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for efficient querying
MarketDataSchema.index({ userId: 1, planId: 1, tabType: 1 }, { unique: true });

export const MarketData =
  mongoose.models.MarketData ||
  mongoose.model<IMarketData>("MarketData", MarketDataSchema); 