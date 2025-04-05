'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IMentor } from '@/models/Mentor';
import { useQuery } from '@tanstack/react-query';

export function MentorBrowser() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expertise, setExpertise] = useState('all');
  const [language, setLanguage] = useState('all');

  const { data: mentors, isLoading } = useQuery<IMentor[]>({
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
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={expertise} onValueChange={setExpertise}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Expertise" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
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
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-muted" />
                <div className="h-4 w-3/4 bg-muted rounded mt-4" />
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-1/2 bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMentors?.map((mentor) => (
            <Card key={mentor._id} className="flex flex-col">
              <CardHeader className="text-center">
                <Avatar className="h-16 w-16 mx-auto">
                  <AvatarImage src={mentor.avatar} alt={mentor.name} />
                  <AvatarFallback>{mentor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <CardTitle>{mentor.name}</CardTitle>
                <CardDescription>{mentor.title}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.expertise.map((exp) => (
                    <Badge key={exp} variant="secondary">{exp}</Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {mentor.bio}
                </p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">⭐ {mentor.rating.average.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({mentor.rating.count} ratings)
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mentor.sessionsDone} sessions completed
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm">
                  {mentor.menteeCapacity.current}/{mentor.menteeCapacity.maximum} mentees
                </div>
                <Button
                  variant="default"
                  disabled={mentor.menteeCapacity.current >= mentor.menteeCapacity.maximum}
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