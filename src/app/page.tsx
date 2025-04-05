import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b">
        <div className="container flex items-center justify-between">
          <h1 className="text-2xl font-bold">UdyamSakhi</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 space-y-10">
          <div className="container text-center space-y-6 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Empowering Women Entrepreneurs in India
            </h1>
            <p className="text-xl text-muted-foreground">
              Your AI-powered companion for business planning, financial guidance, and skill development
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2">
                  Start Your Journey <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How UdyamSakhi Helps You</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 bg-background rounded-lg border space-y-3"
                >
                  <feature.icon className="w-10 h-10 text-primary" />
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2024 UdyamSakhi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "AI Business Planning",
    description: "Get personalized business plans and market analysis powered by AI",
    icon: ArrowRight,
  },
  {
    title: "Financial Guidance",
    description: "Access funding schemes and financial planning tools",
    icon: ArrowRight,
  },
  {
    title: "Legal Support",
    description: "Navigate compliance and registration with AI assistance",
    icon: ArrowRight,
  },
  {
    title: "Skill Development",
    description: "Learn from courses and connect with mentors",
    icon: ArrowRight,
  },
];
