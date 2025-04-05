import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";
import { uploadToCloudinary } from "@/lib/cloudinary";

const MAX_FILE_SIZE = {
  avatar: 2 * 1024 * 1024, // 2MB
  document: 5 * 1024 * 1024, // 5MB
};

const ALLOWED_FILE_TYPES = {
  avatar: ['image/jpeg', 'image/png'],
  document: ['image/jpeg', 'image/png', 'application/pdf'],
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as "avatar" | "document";

    if (!file || !type) {
      return NextResponse.json(
        { message: "Missing file or type" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES[type].includes(file.type)) {
      return NextResponse.json(
        { message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES[type].join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE[type]) {
      return NextResponse.json(
        { message: `File size should be less than ${MAX_FILE_SIZE[type] / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const result = await uploadToCloudinary(fileBase64, type === 'avatar' ? 'avatars' : 'documents');

    await connectDB();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Update user record based on upload type
    if (type === 'avatar') {
      // Delete old avatar if exists
      if (user.avatar?.public_id) {
        await cloudinary.uploader.destroy(user.avatar.public_id);
      }
      user.avatar = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } else {
      // Add new document to array
      if (!user.businessProfile) {
        user.businessProfile = {};
      }
      if (!user.businessProfile.documents) {
        user.businessProfile.documents = [];
      }
      user.businessProfile.documents.push({
        name: file.name,
        url: result.secure_url,
        public_id: result.public_id,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      });
    }

    await user.save();

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Error uploading file" },
      { status: 500 }
    );
  }
} 