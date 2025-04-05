'use client';

import { useState } from 'react';
import { Search, Bookmark, Clock, Star, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ICourse } from '@/models/Course';
import { useQuery } from '@tanstack/react-query';

// Ensure ICourse has the right types
interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
  thumbnail?: string;
  instructor: {
    name: string;
  };
  rating: {
    average: number;
    count: number;
  };
}

export function CourseCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');

  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['courses', category, level],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (level !== 'all') params.append('level', level);
      const response = await fetch(`/api/courses?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const filteredCourses = courses?.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 border-gray-200 dark:border-gray-700 focus:border-pink-500 dark:focus:border-pink-400"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-900">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Soft Skills">Soft Skills</SelectItem>
              <SelectItem value="Legal">Legal</SelectItem>
            </SelectContent>
          </Select>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger className="w-[180px] border-gray-200 dark:border-gray-700 focus:ring-pink-500 dark:focus:ring-pink-400">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent className="border-purple-100 dark:border-purple-900">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
              <CardHeader className="h-[200px] bg-gray-100 dark:bg-gray-700" />
              <CardContent className="space-y-2">
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses?.map((course) => (
            <Card key={course._id} className="flex flex-col border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="pb-3">
                {course.thumbnail && (
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="aspect-video object-cover rounded-md"
                    />
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="absolute top-2 right-2 bg-white/80 dark:bg-gray-800/80 text-pink-500 dark:text-pink-400 hover:bg-white dark:hover:bg-gray-800 rounded-full h-8 w-8"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <CardTitle className="text-gray-900 dark:text-gray-100 mt-3">{course.title}</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">{course.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30">
                    {course.category}
                  </Badge>
                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs ml-auto">
                    <Clock className="h-3.5 w-3.5" /> 
                    <span>{course.duration} mins</span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <UserCircle className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                  By {course.instructor.name}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {course.rating.average.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({course.rating.count})
                  </span>
                </div>
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 