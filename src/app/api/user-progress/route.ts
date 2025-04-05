import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Demo user progress data
const demoUserProgress = {
  _id: '1',
  userId: 'demo-user',
  stats: {
    totalCoursesEnrolled: 5,
    totalCoursesCompleted: 2,
    totalMentorSessions: 3,
    totalLearningTime: 1250
  },
  learningPath: {
    currentGoal: 'Complete Digital Marketing certification by the end of the quarter',
    recommendedCourses: ['2', '5', '4'],
    completedGoals: [
      {
        description: 'Launch business website',
        completedAt: new Date('2023-11-15')
      },
      {
        description: 'Develop basic financial literacy',
        completedAt: new Date('2023-12-20')
      }
    ]
  },
  achievements: [
    {
      title: 'Finance Fundamentals',
      description: 'Completed the Financial Management for Small Businesses course',
      earnedAt: new Date('2023-12-20'),
      type: 'course_completion',
      icon: '🏆'
    },
    {
      title: 'Legal Eagle',
      description: 'Completed Business Law Essentials for Entrepreneurs course',
      earnedAt: new Date('2024-02-10'),
      type: 'course_completion',
      icon: '⚖️'
    },
    {
      title: 'Mentor Connection',
      description: 'Completed 3 mentor sessions',
      earnedAt: new Date('2024-03-05'),
      type: 'mentor_session',
      icon: '🤝'
    }
  ],
  courses: [
    {
      courseId: '1',
      enrolledAt: new Date('2023-11-01'),
      completed: true,
      completedAt: new Date('2023-12-20'),
      certificateIssued: true,
      certificateUrl: 'https://example.com/certificates/financial-management'
    },
    {
      courseId: '6',
      enrolledAt: new Date('2024-01-05'),
      completed: true,
      completedAt: new Date('2024-02-10'),
      certificateIssued: true,
      certificateUrl: 'https://example.com/certificates/business-law'
    },
    {
      courseId: '2',
      enrolledAt: new Date('2024-02-15'),
      lastAccessed: new Date('2024-04-01'),
      completed: false
    },
    {
      courseId: '4',
      enrolledAt: new Date('2024-03-10'),
      lastAccessed: new Date('2024-03-30'),
      completed: false
    },
    {
      courseId: '5',
      enrolledAt: new Date('2024-03-20'),
      lastAccessed: new Date('2024-03-25'),
      completed: false
    }
  ],
  mentorSessions: [
    {
      mentorId: '1',
      scheduledAt: new Date('2024-01-15T10:00:00'),
      duration: 60,
      status: 'completed',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      feedback: {
        rating: 5,
        comment: 'Deepa provided excellent guidance on my financial strategy. Highly recommended!',
        givenAt: new Date('2024-01-15T11:15:00')
      },
      topics: ['Business financing', 'Cash flow management']
    },
    {
      mentorId: '2',
      scheduledAt: new Date('2024-02-20T14:30:00'),
      duration: 45,
      status: 'completed',
      meetingLink: 'https://meet.google.com/klm-nopq-rst',
      feedback: {
        rating: 4,
        comment: 'Ravi shared very practical digital marketing strategies that fit my budget.',
        givenAt: new Date('2024-02-20T15:30:00')
      },
      topics: ['Social media strategy', 'Content marketing']
    },
    {
      mentorId: '5',
      scheduledAt: new Date('2024-03-05T11:00:00'),
      duration: 60,
      status: 'completed',
      meetingLink: 'https://meet.google.com/uvw-xyz-123',
      feedback: {
        rating: 5,
        comment: 'Lata helped me overcome my challenges in managing my growing team.',
        givenAt: new Date('2024-03-05T12:15:00')
      },
      topics: ['Team management', 'Conflict resolution']
    },
    {
      mentorId: '4',
      scheduledAt: new Date('2024-04-10T15:00:00'),
      duration: 60,
      status: 'scheduled',
      meetingLink: 'https://meet.google.com/456-789-abc',
      topics: ['Technology infrastructure', 'SaaS tools for small business']
    }
  ]
};

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(demoUserProgress);
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user progress' },
      { status: 500 }
    );
  }
} 