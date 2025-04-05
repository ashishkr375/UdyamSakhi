import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// Demo recommended courses data - using the IDs of courses from the main courses endpoint
export async function GET() {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all courses from the main endpoint
    const allCoursesResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/courses`);
    
    if (!allCoursesResponse.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const allCourses = await allCoursesResponse.json();
    
    // Get courses with IDs from the recommended list in user progress
    const recommendedCourseIds = ['2', '5', '4']; // These match the IDs in the user-progress
    const recommendedCourses = allCourses.filter(course => recommendedCourseIds.includes(course._id));
    
    return NextResponse.json(recommendedCourses);
  } catch (error) {
    console.error('Error fetching recommended courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recommended courses' },
      { status: 500 }
    );
  }
} 