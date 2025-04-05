import mongoose from 'mongoose';

const availabilitySlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const mentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Professional title is required'],
    trim: true,
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    minlength: [100, 'Bio must be at least 100 characters long'],
  },
  avatar: {
    type: String,
  },
  expertise: [{
    type: String,
    enum: ['Finance', 'Marketing', 'Operations', 'Technology', 'Leadership', 'Legal', 'Industry Specific'],
  }],
  industries: [{
    type: String,
  }],
  languages: [{
    type: String,
  }],
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0,
    },
    currentRole: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
  },
  education: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number,
  }],
  availability: [availabilitySlotSchema],
  menteeCapacity: {
    current: {
      type: Number,
      default: 0,
    },
    maximum: {
      type: Number,
      required: true,
    },
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  sessionsDone: {
    type: Number,
    default: 0,
  },
  testimonials: [{
    menteeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    rating: Number,
    date: Date,
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'pending',
  },
  preferences: {
    sessionDuration: {
      type: Number, // in minutes
      default: 60,
    },
    menteeIndustries: [{
      type: String,
    }],
    menteeLevels: [{
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    }],
  },
}, {
  timestamps: true,
});

// Add indexes for common queries
mentorSchema.index({ expertise: 1, status: 1 });
mentorSchema.index({ industries: 1 });
mentorSchema.index({ languages: 1 });
mentorSchema.index({ 'rating.average': -1 });

export interface IAvailabilitySlot extends mongoose.Document {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface IMentor extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  expertise: Array<'Finance' | 'Marketing' | 'Operations' | 'Technology' | 'Leadership' | 'Legal' | 'Industry Specific'>;
  industries: string[];
  languages: string[];
  experience: {
    years: number;
    currentRole: string;
    company: string;
  };
  education: Array<{
    degree: string;
    institution: string;
    year: number;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
  }>;
  availability: IAvailabilitySlot[];
  menteeCapacity: {
    current: number;
    maximum: number;
  };
  rating: {
    average: number;
    count: number;
  };
  sessionsDone: number;
  testimonials: Array<{
    menteeId: mongoose.Types.ObjectId;
    content: string;
    rating: number;
    date: Date;
  }>;
  status: 'active' | 'inactive' | 'pending';
  preferences: {
    sessionDuration: number;
    menteeIndustries: string[];
    menteeLevels: Array<'Beginner' | 'Intermediate' | 'Advanced'>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const Mentor = mongoose.models.Mentor || mongoose.model<IMentor>('Mentor', mentorSchema); 