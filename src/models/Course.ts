import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['video', 'article', 'pdf', 'quiz'],
    },
  }],
});

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Finance', 'Marketing', 'Operations', 'Technology', 'Soft Skills', 'Legal'],
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  thumbnail: {
    type: String,
    required: false,
  },
  duration: {
    type: Number, // Total duration in minutes
    required: true,
  },
  modules: [moduleSchema],
  instructor: {
    name: {
      type: String,
      required: true,
    },
    bio: String,
    avatar: String,
  },
  tags: [{
    type: String,
  }],
  prerequisites: [{
    type: String,
  }],
  learningOutcomes: [{
    type: String,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
  },
  language: {
    type: String,
    required: true,
    default: 'en',
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
  enrollmentCount: {
    type: Number,
    default: 0,
  },
  completionRate: {
    type: Number,
    default: 0,
  },
  certificateAvailable: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Add indexes for common queries
courseSchema.index({ category: 1, status: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ enrollmentCount: -1 });

export interface ILesson extends mongoose.Document {
  title: string;
  description: string;
  content: string;
  duration: number;
  order: number;
  resources: Array<{
    title: string;
    url: string;
    type: 'video' | 'article' | 'pdf' | 'quiz';
  }>;
}

export interface IModule extends mongoose.Document {
  title: string;
  description: string;
  order: number;
  lessons: ILesson[];
}

export interface ICourse extends mongoose.Document {
  title: string;
  description: string;
  category: 'Finance' | 'Marketing' | 'Operations' | 'Technology' | 'Soft Skills' | 'Legal';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  thumbnail?: string;
  duration: number;
  modules: IModule[];
  instructor: {
    name: string;
    bio?: string;
    avatar?: string;
  };
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  status: 'draft' | 'published' | 'archived';
  language: string;
  rating: {
    average: number;
    count: number;
  };
  enrollmentCount: number;
  completionRate: number;
  certificateAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const Course = mongoose.models.Course || mongoose.model<ICourse>('Course', courseSchema); 