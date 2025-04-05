"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Send, Bot, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";

interface LegalAiAssistantProps {
  businessType: string;
  state: string;
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

export function LegalAiAssistant({ businessType, state }: LegalAiAssistantProps) {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Legal Assistant. I can help you understand legal and compliance requirements for your ${businessType} business in ${state}. Please note that my responses are for informational purposes only and should not be considered as legal advice. For specific legal matters, please consult with a qualified legal professional.

How can I assist you today?`,
    },
  ]);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/legal/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          businessType,
          state,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble processing your request. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="border-pink-100 dark:border-pink-900 bg-pink-50 dark:bg-pink-900/20">
        <AlertCircle className="h-4 w-4 text-pink-500 dark:text-pink-400" />
        <AlertDescription className="text-pink-700 dark:text-pink-300">
          This AI assistant provides general information about legal and compliance
          matters. For specific legal advice, please consult with a qualified legal
          professional.
        </AlertDescription>
      </Alert>

      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            AI Legal Assistant
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Ask questions about legal requirements and compliance for your business
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea
            ref={scrollAreaRef}
            className="h-[400px] pr-4 border border-gray-100 dark:border-gray-700 rounded-md p-4"
          >
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "assistant" ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.role === "assistant"
                        ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "assistant"
                        ? "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200"
                        : "bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    }`}
                  >
                    <div className={`prose max-w-none ${message.role === "user" ? "prose-invert" : ""}`}>
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-gray-400 dark:bg-gray-600 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="min-h-[80px] border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
            />
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white self-end h-[40px] w-[40px]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 