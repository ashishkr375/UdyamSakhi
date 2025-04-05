import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

// GET route to fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await connectDB();
    
    const user = await User.findOne({ email: session.user.email })
      .select('-password -resetToken -resetTokenExpiry')
      .lean();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
  }
}

// PATCH route to update user profile
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    const { name, phone, address } = data;
    
    await connectDB();
    
    // Find user and update only allowed fields
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          name: name,
          phone: phone || undefined,
          address: address || undefined
        }
      },
      { new: true, runValidators: true }
    ).select('-password -resetToken -resetTokenExpiry');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof Error && 'errors' in (error as any)) {
      // Mongoose validation error
      const validationErrors = Object.values((error as any).errors).map((err: any) => err.message);
      return NextResponse.json({ error: 'Validation failed', details: validationErrors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
  }
} 