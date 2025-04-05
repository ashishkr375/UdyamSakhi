import { NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      // Return success even if user not found for security
      return NextResponse.json(
        { message: "If an account exists, a password reset link will be sent" },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save hashed token to user
    user.resetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real application, send email with reset link
    // For development, we'll just return the token
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // TODO: Implement email sending here
    console.log("Reset URL:", resetUrl);

    return NextResponse.json(
      { message: "If an account exists, a password reset link will be sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Error processing request" },
      { status: 500 }
    );
  }
} 