import mongoose from 'mongoose';

const businessProfileSchema = new mongoose.Schema({
  businessName: {
    type: String,
    trim: true,
    minlength: [2, 'Business name must be at least 2 characters long'],
  },
  industry: {
    type: String,
    enum: ['Manufacturing', 'Services', 'Retail', 'Technology', 'Agriculture', 'Other'],
  },
  stage: {
    type: String,
    enum: ['Ideation', 'Startup', 'Growth', 'Mature'],
  },
  type: {
    type: String,
    default: 'Other',
  },
  state: {
    type: String,
    default: 'All',
  },
  udyamNumber: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/.test(v);
      },
      message: props => `${props.value} is not a valid Udyam registration number!`
    },
  },
  documents: [{
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['image/jpeg', 'image/png', 'application/pdf'],
      required: true,
    },
    size: {
      type: Number,
      max: [5242880, 'File size cannot exceed 5MB'],
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  phone: {
    type: String,
    validate: {
      validator: function(v: string) {
        return /^\+?[\d\s-]{10,}$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
  },
  address: {
    type: String,
    trim: true,
  },
  avatar: {
    url: String,
    public_id: String,
  },
  businessProfile: businessProfileSchema,
  resetToken: String,
  resetTokenExpiry: Date,
  completedComplianceItems: {
    type: [String],
    default: []
  },
}, {
  timestamps: true,
});

// Add index for email lookups
userSchema.index({ email: 1 });

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  businessProfile?: {
    businessName?: string;
    industry?: string;
    stage?: string;
    type?: string;
    state?: string;
    udyamNumber?: string;
    documents?: {
      name: string;
      url: string;
      public_id: string;
      type: string;
      size: number;
      uploadedAt: Date;
    }[];
  };
  resetToken?: string;
  resetTokenExpiry?: Date;
  completedComplianceItems: string[];
  createdAt: Date;
  updatedAt: Date;
}

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema); 