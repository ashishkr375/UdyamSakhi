import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";

export const guides = [
  {
    id: "reg-1",
    title: "Business Registration Guide",
    description: "Step-by-step guide for registering your business in India",
    content: `# Business Registration Process

## 1. Choose Your Business Structure
- Sole Proprietorship
- Partnership
- Limited Liability Partnership (LLP)
- Private Limited Company
- One Person Company (OPC)

## 2. Required Documents
1. Identity Proof (Aadhaar/PAN)
2. Address Proof
3. Business Address Proof
4. Photographs
5. Bank Account Details

## 3. Registration Steps
1. Select business structure
2. Apply for PAN/TAN
3. Register with MCA (for companies)
4. Apply for GST (if applicable)
5. Obtain local licenses

## 4. Estimated Costs
- Company Registration: ₹3,000 - ₹15,000
- GST Registration: Free
- Professional Fees: Varies

## 5. Timeline
- Sole Proprietorship: 1-3 days
- Partnership: 3-7 days
- LLP/Company: 15-30 days`,
    lastUpdated: "2024-02-20",
    category: "registration"
  },
  {
    id: "reg-2",
    title: "GST Registration",
    description: "Complete guide to GST registration and compliance",
    content: `# GST Registration Guide

## 1. Eligibility Check
- Turnover exceeds ₹20 lakhs (₹40 lakhs for goods)
- Interstate supplies
- E-commerce operators

## 2. Required Documents
1. PAN of Business/Promoters
2. Aadhaar of Promoters
3. Business Registration Proof
4. Bank Account Statement
5. Property Documents

## 3. Registration Process
1. Visit GST Portal
2. Fill Form GST REG-01
3. Upload Documents
4. Verify through OTP
5. Receive GSTIN

## 4. Post Registration
- File Returns Monthly/Quarterly
- Maintain Digital Records
- Issue GST Invoices

## 5. Important Deadlines
- GSTR-1: 10th of next month
- GSTR-3B: 20th of next month`,
    lastUpdated: "2024-02-18",
    category: "registration"
  },
  {
    id: "tax-1",
    title: "Income Tax Filing for Businesses",
    description: "Guide to filing income tax returns for your business",
    content: `# Business Income Tax Filing

## 1. Record Keeping
- Maintain Books of Accounts
- Keep All Invoices/Bills
- Track Expenses & Income
- Document Asset Purchases

## 2. Important Forms
1. ITR-3: For Proprietorship
2. ITR-5: For Partnership/LLP
3. ITR-6: For Companies

## 3. Key Dates
- Financial Year: April 1 - March 31
- Due Date: July 31 (non-audit)
- Due Date: October 31 (audit cases)

## 4. Deductions Available
- Section 80C investments
- Business Expenses
- Depreciation
- Employee Benefits

## 5. Common Mistakes to Avoid
1. Missing Deadlines
2. Incorrect Form Selection
3. Incomplete Documentation`,
    lastUpdated: "2024-02-15",
    category: "taxation"
  },
  {
    id: "tax-2",
    title: "GST Filing Guide",
    description: "Monthly and annual GST filing procedures",
    content: `# GST Filing Process

## 1. Monthly Requirements
- Track All Sales/Purchases
- Maintain Digital Records
- Reconcile with Bank Statements
- Calculate Tax Liability

## 2. Return Types
1. GSTR-1: Outward Supplies
2. GSTR-3B: Summary Return
3. GSTR-9: Annual Return

## 3. Filing Process
1. Prepare Invoice Data
2. Upload to GST Portal
3. Pay Tax Liability
4. File Returns

## 4. Common Errors
- Mismatch in GSTR-1 & 3B
- Wrong Tax Calculation
- Late Filing
- Input Credit Issues

## 5. Penalties
- Late Filing: ₹50-100/day
- Tax Short Payment: 18% p.a.`,
    lastUpdated: "2024-02-10",
    category: "taxation"
  }
];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const businessType = searchParams.get("businessType");
    const state = searchParams.get("state");
    const guideId = searchParams.get("id");

    await connectDB();

    if (guideId) {
      const guide = guides.find(g => g.id === guideId);
      if (!guide) {
        return NextResponse.json(
          { error: "Guide not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ guide });
    }

    // Filter guides based on business type and state if needed
    // For now, return all guides
    return NextResponse.json({ guides });
  } catch (error) {
    console.error("Error fetching guides:", error);
    return NextResponse.json(
      { error: "Failed to fetch guides" },
      { status: 500 }
    );
  }
} 