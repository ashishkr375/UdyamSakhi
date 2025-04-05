'use client';

import { useState } from 'react';
import { Search, Star, Calendar, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMentor } from '@/models/Mentor';
import { useQuery } from '@tanstack/react-query';

// Define the Mentor interface with proper typing
interface Mentor {
  _id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
  expertise: string[];
  languages: string[];
  rating: {
    average: number;
    count: number;
  };
  sessionsDone: number;
  menteeCapacity: {
    current: number;
    maximum: number;
  };
}

export function MentorBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expertise, setExpertise] = useState('all');
  const [language, setLanguage] = useState('all');

  const { data: mentors, isLoading } = useQuery<Mentor[]>({
    queryKey: ['mentors', expertise, language],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (expertise !== 'all') params.append('expertise', expertise);
      if (language !== 'all') params.append('language', language);
      const response = await fetch(`/api/mentors?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch mentors');
      return response.json();
    },
  });

  const filteredMentors = mentors?.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
            />
          </div>
          <Select value={expertise} onValueChange={setExpertise}>
            <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
              <SelectValue placeholder="Expertise" />
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-900">
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-900">
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Hindi">Hindi</SelectItem>
              <SelectItem value="Gujarati">Gujarati</SelectItem>
              <SelectItem value="Marathi">Marathi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-600" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mt-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors?.map((mentor) => (
            <Card key={mentor._id} className="flex flex-col border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="text-center">
                <Avatar className="h-16 w-16 mx-auto">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                    {mentor.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-gray-900 dark:text-gray-100 mt-2">{mentor.name}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{mentor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((exp) => (
                    <Badge key={exp} className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30">
                      {exp}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {mentor.bio}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {mentor.rating.average.toFixed(1)}
                    </span>
                    <span>
                      ({mentor.rating.count} ratings)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                    <span>{mentor.sessionsDone} sessions completed</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  <span>{mentor.menteeCapacity.current}/{mentor.menteeCapacity.maximum} mentees</span>
                </div>
                <Button
                  variant="default"
                  disabled={mentor.menteeCapacity.current >= mentor.menteeCapacity.maximum}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white disabled:opacity-50"
                >
                  Book Session
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 