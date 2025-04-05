import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema({
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  lastAccessed: {
    type: Date,
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0,
  },
  notes: {
    type: String,
  },
});

const moduleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  lessons: [lessonProgressSchema],
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const courseProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  modules: [moduleProgressSchema],
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessed: {
    type: Date,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  certificateIssued: {
    type: Boolean,
    default: false,
  },
  certificateUrl: {
    type: String,
  },
});

const mentorSessionSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  duration: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
    default: 'scheduled',
  },
  meetingLink: {
    type: String,
  },
  notes: {
    type: String,
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    givenAt: Date,
  },
  topics: [{
    type: String,
  }],
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  courses: [courseProgressSchema],
  mentorSessions: [mentorSessionSchema],
  learningPath: {
    currentGoal: {
      type: String,
    },
    recommendedCourses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    }],
    completedGoals: [{
      description: String,
      completedAt: Date,
    }],
  },
  achievements: [{
    title: {
      type: String,
      required: true,
    },
    description: String,
    earnedAt: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['course_completion', 'mentor_session', 'skill_mastery', 'engagement'],
    },
    icon: String,
  }],
  stats: {
    totalCoursesEnrolled: {
      type: Number,
      default: 0,
    },
    totalCoursesCompleted: {
      type: Number,
      default: 0,
    },
    totalMentorSessions: {
      type: Number,
      default: 0,
    },
    totalLearningTime: {
      type: Number, // in minutes
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Add indexes for common queries
userProgressSchema.index({ userId: 1 });
userProgressSchema.index({ 'courses.courseId': 1 });
userProgressSchema.index({ 'mentorSessions.mentorId': 1 });

export interface ILessonProgress extends mongoose.Document {
  lessonId: mongoose.Types.ObjectId;
  completed: boolean;
  lastAccessed?: Date;
  timeSpent: number;
  notes?: string;
}

export interface IModuleProgress extends mongoose.Document {
  moduleId: mongoose.Types.ObjectId;
  lessons: ILessonProgress[];
  completed: boolean;
  completedAt?: Date;
}

export interface ICourseProgress extends mongoose.Document {
  courseId: mongoose.Types.ObjectId;
  modules: IModuleProgress[];
  enrolledAt: Date;
  lastAccessed?: Date;
  completed: boolean;
  completedAt?: Date;
  certificateIssued: boolean;
  certificateUrl?: string;
}

export interface IMentorSession extends mongoose.Document {
  mentorId: mongoose.Types.ObjectId;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  meetingLink?: string;
  notes?: string;
  feedback?: {
    rating: number;
    comment: string;
    givenAt: Date;
  };
  topics: string[];
}

export interface IUserProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  courses: ICourseProgress[];
  mentorSessions: IMentorSession[];
  learningPath: {
    currentGoal?: string;
    recommendedCourses: mongoose.Types.ObjectId[];
    completedGoals: Array<{
      description: string;
      completedAt: Date;
    }>;
  };
  achievements: Array<{
    title: string;
    description?: string;
    earnedAt: Date;
    type: 'course_completion' | 'mentor_session' | 'skill_mastery' | 'engagement';
    icon?: string;
  }>;
  stats: {
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalMentorSessions: number;
    totalLearningTime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const UserProgress = mongoose.models.UserProgress || mongoose.model<IUserProgress>('UserProgress', userProgressSchema); 