import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { User } from '@/models/User';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

// PATCH route to update business profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { businessName, industry, stage, type, state, udyamNumber } = data;
    
    await connectDB();
    
    // Find user and update business profile
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'businessProfile.businessName': businessName || undefined,
          'businessProfile.industry': industry || undefined,
          'businessProfile.stage': stage || undefined,
          'businessProfile.type': type || undefined,
          'businessProfile.state': state || undefined,
          'businessProfile.udyamNumber': udyamNumber || undefined
        }
      },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiry');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating business profile:', error);
    
    if (error instanceof Error && 'errors' in (error as any)) {
      // Mongoose validation error
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update business profile' }, { status: 500 });
  }
} 