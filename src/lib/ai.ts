import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY!);

type BusinessPlanSection = 'executiveSummary' | 'marketAnalysis' | 'operations' | 'marketing' | 'financialProjections';

interface BusinessPlanInput {
  businessName: string;
  industry: string;
  businessIdea: string;
  targetMarket: string;
}

const sectionPrompts: Record<BusinessPlanSection, (input: BusinessPlanInput) => string> = {
  executiveSummary: (input) => `Create a professional executive summary for a business plan with the following details:
Business Name: ${input.businessName}
Industry: ${input.industry}
Business Idea: ${input.businessIdea}
Target Market: ${input.targetMarket}

Focus on the key highlights, value proposition, and market opportunity. Keep it concise and compelling.`,

  marketAnalysis: (input) => `Provide a detailed market analysis for the following business:
Business Name: ${input.businessName}
Industry: ${input.industry}
Business Idea: ${input.businessIdea}
Target Market: ${input.targetMarket}

Include:
1. Industry overview and trends
2. Target market size and demographics
3. Competitor analysis
4. Market opportunities and challenges
5. Competitive advantage`,

  operations: (input) => `Create a comprehensive operations plan for:
Business Name: ${input.businessName}
Industry: ${input.industry}
Business Idea: ${input.businessIdea}

Include:
1. Location and facilities
2. Equipment and technology needs
3. Production/service delivery process
4. Supply chain management
5. Quality control measures
6. Staffing requirements`,

  marketing: (input) => `Develop a marketing strategy for:
Business Name: ${input.businessName}
Industry: ${input.industry}
Target Market: ${input.targetMarket}

Include:
1. Marketing objectives
2. Brand positioning
3. Marketing channels and tactics
4. Pricing strategy
5. Sales process
6. Customer acquisition and retention strategies`,

  financialProjections: (input) => `Create financial projections for:
Business Name: ${input.businessName}
Industry: ${input.industry}

Provide a high-level overview of:
1. Startup costs
2. Revenue projections (Year 1-3)
3. Operating expenses
4. Break-even analysis
5. Funding requirements
6. Key financial metrics

Note: These are estimates for planning purposes.`,
};

export async function generateBusinessPlanSection(
  section: BusinessPlanSection,
  input: BusinessPlanInput
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = sectionPrompts[section](input);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Failed to generate content');
    }
    
    return text;
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    throw new Error(`Failed to generate ${section}. Please try again.`);
  }
}

export async function generateEntireBusinessPlan(input: BusinessPlanInput) {
  const sections: BusinessPlanSection[] = [
    'executiveSummary',
    'marketAnalysis',
    'operations',
    'marketing',
    'financialProjections'
  ];
  
  const generatedSections: Record<BusinessPlanSection, string> = {} as any;
  
  for (const section of sections) {
    generatedSections[section] = await generateBusinessPlanSection(section, input);
  }
  
  return generatedSections;
} 