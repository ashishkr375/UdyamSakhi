import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { message, businessType, state } = await req.json();

    await connectDB();
    const user = await User.findById(session.user.id);
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const businessContext = {
      type: businessType,
      state: state,
      registrationStatus: user.businessProfile?.registrationStatus || "unregistered",
      employeeCount: user.businessProfile?.employeeCount || 0,
      annualRevenue: user.businessProfile?.annualRevenue || "0-5L",
      sector: user.businessProfile?.sector || "Other",
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an AI Legal Assistant helping Indian business owners understand legal and compliance requirements. 
    
Business Context:
- Type: ${businessContext.type}
- State: ${businessContext.state}
- Registration Status: ${businessContext.registrationStatus}
- Employee Count: ${businessContext.employeeCount}
- Annual Revenue Range: ${businessContext.annualRevenue}
- Sector: ${businessContext.sector}

Please provide a detailed response to the following question, considering the business context above. Format your response using markdown for better readability.

User's Question: ${message}

Remember to:
1. Be specific to Indian laws and regulations
2. Consider the business size and type
3. Provide actionable steps when applicable
4. Include relevant deadlines or timelines
5. Mention any financial implications
6. Format the response with proper markdown headings, lists, and emphasis
7. Include disclaimers when necessary`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return NextResponse.json({ response: response.text() });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
} 