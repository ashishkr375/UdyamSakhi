import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Course } from '@/models/Course';
import connectDB from '@/lib/mongodb';

// Demo course data
const demoCourses = [
  {
    _id: '1',
    title: 'Financial Management for Small Businesses',
    description: 'Learn the fundamentals of financial management tailored for small businesses in India. This course covers bookkeeping, cash flow management, and tax planning strategies.',
    category: 'Finance',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    duration: 240,
    instructor: {
      name: 'Diya Agrawal',
      bio: 'Chartered Accountant with 12 years of experience helping small businesses manage their finances effectively.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1988&auto=format&fit=crop'
    },
    tags: ['financial planning', 'accounting', 'tax', 'budget', 'cash flow'],
    prerequisites: ['Basic understanding of business operations'],
    learningOutcomes: [
      'Create and manage a budget for your business',
      'Understand basic accounting principles',
      'Implement effective cash flow management',
      'Prepare for tax obligations'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.7,
      count: 128
    },
    enrollmentCount: 320,
    completionRate: 76,
    certificateAvailable: true
  },
  {
    _id: '2',
    title: 'Digital Marketing for Women Entrepreneurs',
    description: 'Master digital marketing strategies to grow your business online. Learn social media marketing, content creation, SEO, and email marketing tactics specifically designed for Indian markets.',
    category: 'Marketing',
    level: 'Intermediate',
    thumbnail: 'https://www.webindiamaster.com/public/uploads/women-enterpreneurship.jpg',
    duration: 300,
    instructor: {
      name: 'Ashish Kumar',
      bio: 'Digital marketing consultant who has helped over 100 women-led businesses establish their online presence.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop'
    },
    tags: ['social media', 'SEO', 'content marketing', 'email campaigns', 'online branding'],
    prerequisites: ['Basic computer skills', 'Active social media accounts'],
    learningOutcomes: [
      'Create a comprehensive digital marketing strategy',
      'Build and manage social media presence',
      'Develop effective content marketing campaigns',
      'Understand SEO basics for better online visibility'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.9,
      count: 215
    },
    enrollmentCount: 450,
    completionRate: 82,
    certificateAvailable: true
  },
  {
    _id: '3',
    title: 'Supply Chain Management for Retail Businesses',
    description: 'Optimize your retail business operations with effective supply chain strategies. This course covers inventory management, supplier relationships, logistics, and distribution channels.',
    category: 'Operations',
    level: 'Advanced',
    thumbnail: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=2070&auto=format&fit=crop',
    duration: 280,
    instructor: {
      name: 'Vikram Mehta',
      bio: 'Operations expert with experience in leading retail chains across India.',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop'
    },
    tags: ['inventory management', 'logistics', 'supplier management', 'retail operations'],
    prerequisites: ['Basic understanding of retail business', 'Familiarity with inventory concepts'],
    learningOutcomes: [
      'Develop efficient inventory management systems',
      'Optimize logistics and distribution channels',
      'Build strong supplier relationships',
      'Implement cost-effective supply chain strategies'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.5,
      count: 98
    },
    enrollmentCount: 220,
    completionRate: 68,
    certificateAvailable: true
  },
  {
    _id: '4',
    title: 'Technology Tools for Business Efficiency',
    description: 'Discover and implement technology solutions to streamline your business operations. Learn about project management tools, automation, cloud services, and communication platforms.',
    category: 'Technology',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?q=80&w=1974&auto=format&fit=crop',
    duration: 210,
    instructor: {
      name: 'Raj Kapoor',
      bio: 'Tech consultant specializing in helping small businesses adopt digital solutions.',
      avatar: 'https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?q=80&w=1964&auto=format&fit=crop'
    },
    tags: ['automation', 'project management', 'cloud services', 'productivity tools'],
    prerequisites: ['Basic computer skills'],
    learningOutcomes: [
      'Select appropriate technology tools for your business needs',
      'Implement automated workflows',
      'Utilize cloud services for business operations',
      'Improve team communication with digital tools'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.6,
      count: 175
    },
    enrollmentCount: 380,
    completionRate: 85,
    certificateAvailable: true
  },
  {
    _id: '5',
    title: 'Leadership Skills for Women Entrepreneurs',
    description: 'Develop essential leadership skills to grow your business and inspire your team. This course covers effective communication, decision-making, team building, and conflict resolution.',
    category: 'Soft Skills',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070&auto=format&fit=crop',
    duration: 250,
    instructor: {
      name: 'Meera Desai',
      bio: 'Leadership coach with expertise in women entrepreneurship development.',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1974&auto=format&fit=crop'
    },
    tags: ['leadership', 'communication', 'team management', 'conflict resolution'],
    prerequisites: ['Experience managing a team or business'],
    learningOutcomes: [
      'Develop effective leadership communication',
      'Build and manage high-performing teams',
      'Make strategic business decisions',
      'Handle workplace conflicts professionally'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.8,
      count: 165
    },
    enrollmentCount: 340,
    completionRate: 79,
    certificateAvailable: true
  },
  {
    _id: '6',
    title: 'Business Law Essentials for Entrepreneurs',
    description: 'Understand the legal aspects of running a business in India. This course covers business registration, contracts, intellectual property, employment law, and compliance requirements.',
    category: 'Legal',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2012&auto=format&fit=crop',
    duration: 270,
    instructor: {
      name: 'Anand Krishnan',
      bio: 'Corporate lawyer specializing in small business law and compliance.',
      avatar: 'https://images.unsplash.com/photo-1584999734482-0361aecad844?q=80&w=1980&auto=format&fit=crop'
    },
    tags: ['business law', 'contracts', 'intellectual property', 'compliance'],
    prerequisites: ['None'],
    learningOutcomes: [
      'Understand different business structures and registration processes',
      'Create legally sound business contracts',
      'Protect your intellectual property',
      'Comply with relevant business regulations'
    ],
    status: 'published',
    language: 'en',
    rating: {
      average: 4.4,
      count: 110
    },
    enrollmentCount: 290,
    completionRate: 72,
    certificateAvailable: true
  }
];

export async function GET(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const level = searchParams.get('level');

    // Filter demo courses based on query parameters
    let filteredCourses = [...demoCourses];
    
    if (category && category !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.category === category);
    }
    
    if (level && level !== 'all') {
      filteredCourses = filteredCourses.filter(course => course.level === level);
    }

    return NextResponse.json(filteredCourses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
} 