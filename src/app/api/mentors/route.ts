import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { Mentor } from '@/models/Mentor';
import connectDB from '@/lib/mongodb';

// Demo mentor data
const demoMentors = [
  {
    _id: '1',
    name: 'Diya Agrawal',
    title: 'Financial Consultant & Business Advisor',
    bio: 'With over 15 years of experience in the financial sector, I specialize in helping women entrepreneurs optimize their business finances and secure funding. My background includes working with major banks and venture capital firms, giving me insight into what investors look for in startups. I am passionate about empowering women-led businesses through financial literacy and strategic planning.',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFZ0URJSOvkjA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709913066396?e=1749081600&v=beta&t=iW1TiqOnqwl0JftTso46urmx9rvuio_76NJaNuKYKHQ',
    expertise: ['Finance', 'Leadership'],
    industries: ['Retail', 'Technology', 'Services'],
    languages: ['English', 'Hindi', 'Punjabi'],
    experience: {
      years: 15,
      currentRole: 'Financial Consultant',
      company: 'Malhotra Consulting Group'
    },
    menteeCapacity: {
      current: 3,
      maximum: 5
    },
    rating: {
      average: 4.9,
      count: 78
    },
    sessionsDone: 134,
    status: 'active'
  },
  {
    _id: '2',
    name: 'Ashish Kumar',
    title: 'Digital Marketing Strategist',
    bio: 'I help small businesses and startups build their digital presence from the ground up. With experience managing marketing campaigns for over 200 businesses across India, I bring practical knowledge about what works specifically in the Indian market. My focus is on cost-effective strategies that deliver real results for entrepreneurs with limited budgets.',
    avatar: 'https://media.licdn.com/dms/image/v2/D4D03AQFLnwHnaHzviQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1710009633578?e=1749081600&v=beta&t=1gkNRSuQIPd0vb9plZK-d4pNF61CvDZgqoz0zGEtnlQ',
    expertise: ['Marketing', 'Technology'],
    industries: ['E-commerce', 'Food & Beverage', 'Healthcare'],
    languages: ['English', 'Hindi', 'Marathi'],
    experience: {
      years: 10,
      currentRole: 'Founder',
      company: 'DigitalBoost Marketing'
    },
    menteeCapacity: {
      current: 4,
      maximum: 6
    },
    rating: {
      average: 4.7,
      count: 56
    },
    sessionsDone: 98,
    status: 'active'
  },
  {
    _id: '3',
    name: 'Anita Desai',
    title: 'Operations & Supply Chain Expert',
    bio: 'Former Operations Director for a major Indian retail chain, I now consult with small and medium businesses to streamline their operations. My expertise lies in identifying operational inefficiencies and implementing practical solutions that reduce costs while improving customer satisfaction. I am particularly interested in helping women entrepreneurs in the manufacturing and retail sectors.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=1974&auto=format&fit=crop',
    expertise: ['Operations', 'Leadership'],
    industries: ['Manufacturing', 'Retail', 'Logistics'],
    languages: ['English', 'Hindi', 'Gujarati'],
    experience: {
      years: 18,
      currentRole: 'Operations Consultant',
      company: 'Efficient Enterprise Solutions'
    },
    menteeCapacity: {
      current: 2,
      maximum: 4
    },
    rating: {
      average: 4.8,
      count: 42
    },
    sessionsDone: 75,
    status: 'active'
  },
  {
    _id: '4',
    name: 'Vikram Joshi',
    title: 'Technology & Product Development Specialist',
    bio: 'As a startup founder and former CTO, I help non-technical entrepreneurs navigate the world of technology. From choosing the right platforms to hiring tech talent, I provide guidance on all aspects of building technology products. My approach focuses on appropriate technology solutions that align with your business stage and goals, rather than just following trends.',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=2070&auto=format&fit=crop',
    expertise: ['Technology', 'Operations'],
    industries: ['SaaS', 'Mobile Apps', 'E-commerce'],
    languages: ['English', 'Hindi'],
    experience: {
      years: 12,
      currentRole: 'Founder & CTO',
      company: 'TechFoundry'
    },
    menteeCapacity: {
      current: 5,
      maximum: 5
    },
    rating: {
      average: 4.9,
      count: 89
    },
    sessionsDone: 127,
    status: 'active'
  },
  {
    _id: '5',
    name: 'Lata Venkatesh',
    title: 'Leadership Coach & HR Specialist',
    bio: 'I combine my background in human resources with leadership coaching to help entrepreneurs build effective teams. My expertise includes talent acquisition, team development, conflict resolution, and creating healthy work cultures. I specialize in addressing the unique challenges women entrepreneurs face in leadership positions, particularly in male-dominated industries.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    expertise: ['Leadership', 'Industry Specific'],
    industries: ['IT', 'Professional Services', 'Education'],
    languages: ['English', 'Tamil', 'Hindi'],
    experience: {
      years: 14,
      currentRole: 'Leadership Coach',
      company: 'Evolve Leadership Institute'
    },
    menteeCapacity: {
      current: 3,
      maximum: 7
    },
    rating: {
      average: 4.7,
      count: 63
    },
    sessionsDone: 110,
    status: 'active'
  },
  {
    _id: '6',
    name: 'Arjun Reddy',
    title: 'Legal Advisor for Startups',
    bio: 'As a business lawyer with a focus on entrepreneurship, I help startups navigate the legal landscape. From company registration and compliance to contracts and intellectual property protection, I provide practical legal guidance tailored to early-stage businesses. My goal is to help you build your business on a solid legal foundation while avoiding common legal pitfalls.',
    avatar: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=2076&auto=format&fit=crop',
    expertise: ['Legal', 'Industry Specific'],
    industries: ['Technology', 'E-commerce', 'Creative Industries'],
    languages: ['English', 'Hindi', 'Telugu'],
    experience: {
      years: 11,
      currentRole: 'Founder',
      company: 'StartupLegal Advisors'
    },
    menteeCapacity: {
      current: 2,
      maximum: 4
    },
    rating: {
      average: 4.6,
      count: 37
    },
    sessionsDone: 68,
    status: 'active'
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
    const expertise = searchParams.get('expertise');
    const language = searchParams.get('language');

    // Filter demo mentors based on query parameters
    let filteredMentors = [...demoMentors];
    
    if (expertise && expertise !== 'all') {
      filteredMentors = filteredMentors.filter(mentor => mentor.expertise.includes(expertise));
    }
    
    if (language && language !== 'all') {
      filteredMentors = filteredMentors.filter(mentor => mentor.languages.includes(language));
    }

    return NextResponse.json(filteredMentors);
  } catch (error) {
    console.error('Error fetching mentors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mentors' },
      { status: 500 }
    );
  }
} 