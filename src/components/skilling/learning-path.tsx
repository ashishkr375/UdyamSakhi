'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, BookOpen, Award, Flame, Zap } from 'lucide-react';
import { IUserProgress } from '@/models/UserProgress';
import { ICourse } from '@/models/Course';

// Define interfaces with proper typing
interface UserProgress {
  stats: {
    totalCoursesEnrolled: number;
    totalCoursesCompleted: number;
    totalMentorSessions: number;
  };
  achievements: Array<{
    title: string;
    description: string;
    earnedAt: string;
  }>;
  learningPath: {
    currentGoal: string | null;
  };
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  thumbnail?: string;
}

export function LearningPath() {
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery<UserProgress>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const response = await fetch('/api/user-progress');
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return response.json();
    },
  });

  const { data: recommendedCourses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['recommendedCourses'],
    queryFn: async () => {
      const response = await fetch('/api/courses/recommended');
      if (!response.ok) throw new Error('Failed to fetch recommended courses');
      return response.json();
    },
  });

  const isLoading = isLoadingProgress || isLoadingCourses;

  return (
    <div className="space-y-6">
      {/* Current Progress Overview */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100">Your Learning Journey</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Track your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '-' : userProgress?.stats.totalCoursesEnrolled}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Enrolled</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '-' : userProgress?.stats.totalCoursesCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Courses Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '-' : userProgress?.stats.totalMentorSessions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Mentor Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Award className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {isLoading ? '-' : userProgress?.achievements.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Achievements</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Goal */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Flame className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            Current Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-20 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
          ) : userProgress?.learningPath.currentGoal ? (
            <div className="space-y-4">
              <p className="text-lg text-gray-800 dark:text-gray-200">{userProgress.learningPath.currentGoal}</p>
              <Progress value={75} className="h-2" />
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>In Progress</span>
                <span>75% Complete</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No current goal set</p>
              <Button className="mt-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">Set a Learning Goal</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            Recommended Next Steps
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">Courses tailored to your goals and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            ) : recommendedCourses?.length ? (
              recommendedCourses.map((course) => (
                <div key={course._id} className="flex items-start gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100">{course.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30">
                        {course.category}
                      </Badge>
                      <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                        {course.level}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    Start Course
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No recommendations available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card className="border-purple-100 dark:border-purple-900 bg-white dark:bg-gray-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Award className="h-5 w-5 text-pink-500 dark:text-pink-400" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
          ) : userProgress?.achievements.length ? (
            <div className="space-y-4">
              {userProgress.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4 bg-gray-100 dark:bg-gray-700" />}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 flex items-center justify-center">
                      <Award className="h-6 w-6 text-pink-500 dark:text-pink-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No achievements yet</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Complete courses and attend mentor sessions to earn achievements
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 