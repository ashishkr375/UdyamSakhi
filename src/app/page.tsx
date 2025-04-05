"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, FileText, CreditCard, BookOpen, Heart, Users, Calendar, Award, Lightbulb, Sun, Moon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Home() {
  // Theme state and toggle function
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();
  
  // After mounting, we can access the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
      <header className="px-2 md:px-6 py-4 border-b bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between mx-auto px-4">
          <img src="/logo.png" alt="UdyamSakhi Logo" className="h-8 w-auto md:h-10" />
          <div className="flex items-center space-x-4">
            {mounted && (
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                aria-label="Toggle theme"
              >
                {theme === "light" ? 
                  <Moon className="w-5 h-5" /> : 
                  <Sun className="w-5 h-5" />
                }
              </button>
            )}
            <Link href="/login" className="hidden md:block">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 space-y-10 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30">
          <div className="container px-4 mx-auto text-center space-y-8 max-w-3xl">
            <div className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Launching nationwide to support women entrepreneurs
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Empowering Women Entrepreneurs in India
            </h1>
            <p className="text-xl text-muted-foreground dark:text-gray-300">
              Your AI-powered companion for business planning, financial guidance, and skill development
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                  Start Your Journey <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/50">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Banner Image Section */}
        <section className="py-16 relative overflow-hidden">
          <div className="container px-4 mx-auto flex justify-center">
            <div className="relative w-full max-w-4xl rounded-lg overflow-hidden shadow-xl">
              <img 
                src="/banner.png" 
                width={1200} 
                height={600} 
                alt="UdyamSakhi Platform" 
                className="w-full h-auto object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/40 to-purple-600/20 mix-blend-overlay"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">How UdyamSakhi Helps You</h2>
              <p className="text-muted-foreground dark:text-gray-400">Our comprehensive platform provides everything you need to start, grow, and sustain your business successfully with AI-powered tools and personalized guidance.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-purple-100 dark:border-purple-900 space-y-4 shadow-sm hover:shadow-md transition-shadow duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800 dark:text-gray-100">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{feature.description}</p>
                  <ul className="space-y-2 pl-4">
                    {feature.subFeatures.map((subFeature, index) => (
                      <li key={index} className="text-xs text-gray-600 dark:text-gray-400 list-disc">
                        {subFeature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Info Tabs Section */}
        <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950 dark:to-purple-950">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">Explore Our Services</h2>
              <p className="text-muted-foreground dark:text-gray-400">Discover how UdyamSakhi's comprehensive suite of tools and resources can transform your entrepreneurial journey at every stage</p>
            </div>
            
            <Tabs defaultValue="business-plan" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg overflow-x-auto h-auto">
                <TabsTrigger 
                  value="business-plan" 
                  className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4 flex-shrink-0 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm font-medium">Business Plan</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="funding" 
                  className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
                >
                  <CreditCard className="h-4 w-4 flex-shrink-0 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm font-medium">Funding</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="legal" 
                  className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
                >
                  <BookOpen className="h-4 w-4 flex-shrink-0 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm font-medium">Legal</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="skilling" 
                  className="flex flex-col sm:flex-row items-center justify-center sm:gap-2 px-1 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-400 data-[state=active]:to-purple-400 data-[state=active]:text-white dark:data-[state=active]:text-white"
                >
                  <Award className="h-4 w-4 flex-shrink-0 mb-1 sm:mb-0" />
                  <span className="text-xs sm:text-sm font-medium">Skilling</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="business-plan" className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-md">
                <div className="md:grid md:grid-cols-5 gap-6">
                  <div className="col-span-2 hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      width={300}
                      height={400}
                      alt="Business Planning"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">AI Business Idea Analyzer & Planner</h3>
                    <p className="dark:text-gray-300">Our advanced AI-powered system helps you transform your business idea into a comprehensive, actionable plan with all the strategic elements you need to succeed in today's competitive market.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Generate detailed executive summaries, market analysis reports, operations plans, and marketing strategies tailored to your specific business idea</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Automatically create realistic financial projections including startup costs, revenue forecasts, and break-even analysis based on your inputs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Edit and refine your plan as your business evolves with version tracking and easy comparison between iterations</span>
                      </li>
                    </ul>
                    <Button className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800 mt-4">Create Your Plan</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="funding" className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-md">
                <div className="md:grid md:grid-cols-5 gap-6">
                  <div className="col-span-2 hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      width={300}
                      height={400}
                      alt="Funding Options"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">AI Financial Empowerment Suite</h3>
                    <p className="dark:text-gray-300">Navigate the complex world of business financing with our AI-powered funding tools and resources designed specifically for women entrepreneurs in India.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Discover government schemes, grants, and subsidies specifically designed for women entrepreneurs across different states and industries in India</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Receive personalized AI-powered recommendations for funding options based on your business type, stage, location, and specific needs</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CreditCard className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Track your application progress, manage documentation, and get guidance through every step of the funding process</span>
                      </li>
                    </ul>
                    <Button className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 mt-4">Explore Funding</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="legal" className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-md">
                <div className="md:grid md:grid-cols-5 gap-6">
                  <div className="col-span-2 hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      width={300}
                      height={400}
                      alt="Legal Support"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-2xl font-bold text-pink-600 dark:text-pink-400">AI Legal & Compliance Assistant</h3>
                    <p className="dark:text-gray-300">Navigate India's legal and regulatory requirements with ease using our AI-powered legal assistant designed to simplify compliance for women entrepreneurs.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Get customized compliance checklists based on your specific business type, industry, size, and location to ensure you meet all legal requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Access simple, step-by-step guides for GST registration, Udyam registration, business incorporation, and other essential processes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <BookOpen className="w-5 h-5 text-pink-500 dark:text-pink-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Use our AI chatbot to get instant answers to your legal questions with references to relevant laws and regulations</span>
                      </li>
                    </ul>
                    <Button className="bg-pink-500 hover:bg-pink-600 dark:bg-pink-700 dark:hover:bg-pink-800 mt-4">Legal Guidance</Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="skilling" className="p-6 bg-white dark:bg-gray-800 rounded-lg border shadow-md">
                <div className="md:grid md:grid-cols-5 gap-6">
                  <div className="col-span-2 hidden md:block">
                    <img
                      src="https://images.unsplash.com/photo-1573164574472-797cdf4a583a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                      width={300}
                      height={400}
                      alt="Skill Development"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="col-span-3 space-y-4">
                    <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Skilling & Mentorship Hub</h3>
                    <p className="dark:text-gray-300">Enhance your business skills and connect with experienced mentors through our comprehensive learning platform tailored to women entrepreneurs in India.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Access a rich library of courses on financial management, digital marketing, operations, leadership, and other critical business skills with content in multiple Indian languages</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Connect with experienced mentors from your industry who understand the unique challenges faced by women entrepreneurs in India</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="w-5 h-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                        <span className="dark:text-gray-300">Join a vibrant community of like-minded women entrepreneurs for peer learning, networking, and collaborative opportunities across India</span>
                      </li>
                    </ul>
                    <Button className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800 mt-4">Explore Courses</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* Success Stories */}
        <section className="py-20 bg-white dark:bg-gray-900" id="success-stories">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">Success Stories</h2>
              <p className="text-muted-foreground dark:text-gray-400">Be inspired by these remarkable women entrepreneurs who transformed their dreams into thriving businesses with UdyamSakhi's support</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
                <div key={index} className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-6 shadow-sm border border-purple-100 dark:border-purple-900">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <img 
                        src={story.image} 
                        width={100} 
                        height={100} 
                        alt={story.name} 
                        className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-pink-300 dark:border-pink-700"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200 mb-2">{story.name}</h3>
                      <p className="text-sm text-center text-purple-600 dark:text-purple-400 mb-4">{story.business}</p>
                      <p className="text-muted-foreground dark:text-gray-400 text-sm italic">"{story.quote}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-pink-500 to-purple-600 text-white">
          <div className="container px-4 mx-auto text-center max-w-3xl space-y-8">
            <h2 className="text-3xl font-bold">Ready to Start Your Entrepreneurial Journey?</h2>
            <p className="text-white/80 text-lg">Join thousands of women entrepreneurs across India who are building successful businesses with UdyamSakhi</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="gap-2 bg-white text-purple-600 hover:bg-gray-100">
                  Create Your Account <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-white text-purple-600 hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
            <img src="/logo.png" alt="UdyamSakhi Logo" className="h-7 w-auto md:h-10" />              <p className="text-gray-400 text-sm">Empowering women entrepreneurs across India with AI-powered tools and resources to start, grow, and scale successful businesses.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#features" className="hover:text-pink-300">Business Planning</Link></li>
                <li><Link href="#features" className="hover:text-pink-300">Funding Navigator</Link></li>
                <li><Link href="#features" className="hover:text-pink-300">Legal & Tax Hub</Link></li>
                <li><Link href="#features" className="hover:text-pink-300">Market Access</Link></li>
                <li><Link href="#features" className="hover:text-pink-300">Skilling Center</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/help" className="hover:text-pink-300">Help Center</Link></li>
                <li><Link href="#" className="hover:text-pink-300">Blog</Link></li>
                <li><Link href="#success-stories" className="hover:text-pink-300">Success Stories</Link></li>
                <li><Link href="/help" className="hover:text-pink-300">FAQ</Link></li>
                <li><Link href="/help" className="hover:text-pink-300">Tutorials</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-200">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>contact@udyamsakhi.org</li>
                <li>+91 8083285661</li>
                <li>New Delhi, India</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2024 UdyamSakhi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "AI Business Planning",
    description: "Get personalized business plans and market analysis powered by AI to start your business with confidence and strategic clarity.",
    icon: Lightbulb,
    subFeatures: [
      "Executive summaries tailored to your specific business",
      "Comprehensive market analysis identifying key opportunities",
      "Detailed operations planning and resource requirements",
      "Strategic marketing and sales approaches for your target audience",
      "Financial projections with break-even analysis"
    ]
  },
  {
    title: "Financial Guidance",
    description: "Access funding schemes, financial planning tools, and comprehensive resources to effectively manage and grow your business finances.",
    icon: CreditCard,
    subFeatures: [
      "Government schemes and grants specifically for women entrepreneurs",
      "Financial planning tools for budgeting and forecasting",
      "Loan application guidance and documentation support",
      "Investment opportunity assessment and planning",
      "Tax planning and financial compliance assistance"
    ]
  },
  {
    title: "Legal Support",
    description: "Navigate compliance requirements and business registration processes with personalized AI guidance tailored to Indian regulations.",
    icon: BookOpen,
    subFeatures: [
      "Personalized compliance checklists based on your business type",
      "Step-by-step registration guides for different business structures",
      "Tax filing assistance and GST compliance support",
      "Basic contract templates and document preparation",
      "AI-powered legal Q&A for common business questions"
    ]
  },
  {
    title: "Skill Development",
    description: "Learn essential business skills through curated courses and connect with experienced mentors to accelerate your entrepreneurial growth.",
    icon: Award,
    subFeatures: [
      "Industry-specific courses developed for women entrepreneurs",
      "Personalized learning paths based on your business needs",
      "Connection with mentors who understand your specific challenges",
      "Networking opportunities with other women entrepreneurs",
      "Practical workshops and webinars on critical business skills"
    ]
  },
];

const successStories = [
  {
    name: "Diya Agrawal",
    business: "Handcrafted Textiles",
    quote: "UdyamSakhi helped me transform my textile hobby into a thriving business reaching customers nationwide. The business plan generator and funding guidance were game-changers for my venture.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Ashish Kumar",
    business: "Organic Foods",
    quote: "The business plan generator and funding guidance helped me secure a loan to expand my organic food business. The legal compliance support made navigating regulations so much easier for me.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Ananya Reddy",
    business: "Tech Education",
    quote: "The legal support and mentorship connections were invaluable in navigating the early stages of my startup. Within a year, I've been able to reach over 500 students with my tech education platform.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
  }
];
