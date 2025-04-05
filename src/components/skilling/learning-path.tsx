'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trophy, Target, BookOpen, Award } from 'lucide-react';
import { IUserProgress } from '@/models/UserProgress';
import { ICourse } from '@/models/Course';

export function LearningPath() {
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery<IUserProgress>({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const response = await fetch('/api/user-progress');
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return response.json();
    },
  });

  const { data: recommendedCourses, isLoading: isLoadingCourses } = useQuery<ICourse[]>({
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
      <Card>
        <CardHeader>
          <CardTitle>Your Learning Journey</CardTitle>
          <CardDescription>Track your progress and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-4">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '-' : userProgress?.stats.totalCoursesEnrolled}
                </div>
                <div className="text-sm text-muted-foreground">Courses Enrolled</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '-' : userProgress?.stats.totalCoursesCompleted}
                </div>
                <div className="text-sm text-muted-foreground">Courses Completed</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '-' : userProgress?.stats.totalMentorSessions}
                </div>
                <div className="text-sm text-muted-foreground">Mentor Sessions</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {isLoading ? '-' : userProgress?.achievements.length}
                </div>
                <div className="text-sm text-muted-foreground">Achievements</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Goal */}
      <Card>
        <CardHeader>
          <CardTitle>Current Goal</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-20 animate-pulse bg-muted rounded" />
          ) : userProgress?.learningPath.currentGoal ? (
            <div className="space-y-4">
              <p className="text-lg">{userProgress.learningPath.currentGoal}</p>
              <Progress value={75} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>In Progress</span>
                <span>75% Complete</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No current goal set</p>
              <Button className="mt-4">Set a Learning Goal</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
          <CardDescription>Courses tailored to your goals and progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 animate-pulse bg-muted rounded" />
                ))}
              </div>
            ) : recommendedCourses?.length ? (
              recommendedCourses.map((course) => (
                <div key={course._id} className="flex items-start gap-4 p-4 border rounded-lg">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-20 w-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{course.title}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </div>
                  <Button>Start Course</Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No recommendations available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : userProgress?.achievements.length ? (
            <div className="space-y-4">
              {userProgress.achievements.slice(0, 3).map((achievement, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No achievements yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Complete courses and attend mentor sessions to earn achievements
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 