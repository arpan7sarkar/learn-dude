"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import {
  BookOpen,
  Clock,
  Trophy,
  Zap,
  Flame,
  Star,
  Play,
  TrendingUp,
  Target,
  Brain,
  Plus,
  ArrowRight,
  Award,
  Users,
  Gift,
} from "lucide-react"
import Link from "next/link"
import { calculateLevel } from "@/lib/xp-system"

// Mock data for the dashboard
const mockUser = {
  name: "Alex Johnson",
  avatar: "/diverse-user-avatars.png",
  level: 12,
  xp: 2450,
  xpToNext: 3000,
  streak: 7,
  totalCourses: 15,
  completedCourses: 8,
  hoursLearned: 47,
}

const mockCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    category: "Programming",
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    estimatedTime: "2h 30m remaining",
    difficulty: "Intermediate",
    lastAccessed: "2 hours ago",
    thumbnail: "/machine-learning-course-banner.png",
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    category: "Web Development",
    progress: 45,
    totalLessons: 16,
    completedLessons: 7,
    estimatedTime: "4h 15m remaining",
    difficulty: "Advanced",
    lastAccessed: "1 day ago",
    thumbnail: "/react-patterns-course.png",
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    category: "Computer Science",
    progress: 90,
    totalLessons: 32,
    completedLessons: 29,
    estimatedTime: "45m remaining",
    difficulty: "Intermediate",
    lastAccessed: "3 days ago",
    thumbnail: "/algorithms-data-structures.jpg",
  },
]

const mockNewCourses = [
  {
    id: "4",
    title: "Python for Data Science",
    category: "Data Science",
    lessons: 20,
    duration: "8-12 hours",
    difficulty: "Beginner",
    createdAt: "Just created",
    thumbnail: "/python-data-science-course.png",
  },
  {
    id: "5",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    lessons: 15,
    duration: "6-8 hours",
    difficulty: "Beginner",
    createdAt: "2 hours ago",
    thumbnail: "/ui-ux-design-course.png",
  },
]

const weeklyProgressData = [
  { day: "Mon", hours: 2.5, xp: 150 },
  { day: "Tue", hours: 1.8, xp: 120 },
  { day: "Wed", hours: 3.2, xp: 200 },
  { day: "Thu", hours: 2.1, xp: 140 },
  { day: "Fri", hours: 4.0, xp: 280 },
  { day: "Sat", hours: 1.5, xp: 100 },
  { day: "Sun", hours: 2.8, xp: 180 },
]

const categoryData = [
  { name: "Programming", value: 40, color: "hsl(var(--chart-1))" },
  { name: "Data Science", value: 25, color: "hsl(var(--chart-2))" },
  { name: "Design", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Business", value: 15, color: "hsl(var(--chart-4))" },
]

const chartConfig = {
  hours: {
    label: "Hours",
    color: "hsl(var(--chart-1))",
  },
  xp: {
    label: "XP",
    color: "hsl(var(--chart-2))",
  },
}

export function LearningDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const levelInfo = calculateLevel(mockUser.xp)
  const nextLevel = levelInfo.xpToNext
  const xpProgress = levelInfo.progress

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">Welcome back, {mockUser.name}!</h1>
              <p className="text-muted-foreground mt-1">Continue your learning journey</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4 text-destructive" />
                  <span className="font-medium">{mockUser.streak} day streak</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-chart-5" />
                  <span className="font-medium">
                    Level {levelInfo.level} - {levelInfo.title}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/gamification">
                    <Trophy className="h-4 w-4 mr-2" />
                    Challenges
                  </Link>
                </Button>
              </div>
              <Button asChild>
                <Link href="/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">XP Points</p>
                      <p className="text-2xl font-bold">{mockUser.xp.toLocaleString()}</p>
                    </div>
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-4">
                    <Progress value={xpProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                      {nextLevel - mockUser.xp} XP to Level {levelInfo.level + 1}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Courses</p>
                      <p className="text-2xl font-bold">{mockUser.totalCourses}</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-accent" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">{mockUser.completedCourses} completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Hours Learned</p>
                      <p className="text-2xl font-bold">{mockUser.hoursLearned}</p>
                    </div>
                    <Clock className="h-8 w-8 text-chart-3" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Streak</p>
                      <p className="text-2xl font-bold">{mockUser.streak}</p>
                    </div>
                    <Flame className="h-8 w-8 text-destructive" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">Days in a row</p>
                </CardContent>
              </Card>
            </div>

            {/* Continue Learning */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockCourses.slice(0, 2).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{course.title}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{course.category}</span>
                          <Badge variant="outline">{course.difficulty}</Badge>
                          <span>{course.lastAccessed}</span>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>
                              {course.completedLessons}/{course.totalLessons} lessons
                            </span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      </div>
                      <Button size="sm">
                        Continue
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newly Generated Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Newly Generated Courses
                </CardTitle>
                <CardDescription>Fresh AI-generated courses ready to explore</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {mockNewCourses.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-full h-32 rounded-lg object-cover mb-3"
                      />
                      <h3 className="font-medium mb-2">{course.title}</h3>
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <Badge variant="secondary">{course.category}</Badge>
                        <span>•</span>
                        <span>{course.lessons} lessons</span>
                        <span>•</span>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{course.createdAt}</span>
                        <Button size="sm" variant="outline">
                          Start Learning
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    Daily Challenges
                  </CardTitle>
                  <CardDescription>Complete today's learning goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Complete 3 lessons</span>
                      <Badge variant="outline">1/3</Badge>
                    </div>
                    <Progress value={33} className="h-2" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">+150 XP reward</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/gamification">View All</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-amber-500" />
                    Leaderboard
                  </CardTitle>
                  <CardDescription>Your ranking this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">#2</span>
                      <Trophy className="h-6 w-6 text-amber-500" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>1,100 XP this week</p>
                      <p>150 XP behind #1</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/gamification?tab=leaderboard">View Leaderboard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="h-5 w-5 text-green-500" />
                    Recent Achievement
                  </CardTitle>
                  <CardDescription>Latest milestone unlocked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🔥</div>
                      <div>
                        <p className="font-medium text-sm">Week Streak</p>
                        <p className="text-xs text-muted-foreground">7-day learning streak</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        +200 XP
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/profile?tab=achievements">View All</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Courses</CardTitle>
                <CardDescription>Manage your enrolled and created courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{course.category}</span>
                          <Badge variant="outline">{course.difficulty}</Badge>
                          <span>{course.estimatedTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Progress value={course.progress} className="h-2 w-32" />
                            <span className="text-sm">{course.progress}%</span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            <Button size="sm">Continue</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                  <CardDescription>Your learning activity this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyProgressData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Learning Categories
                  </CardTitle>
                  <CardDescription>Distribution of your learning focus</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {categoryData.map((category) => (
                      <div key={category.name} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                        <span className="text-muted-foreground">({category.value}%)</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Achievement Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievement Progress
                </CardTitle>
                <CardDescription>Track your learning milestones and unlock rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Course Completionist</h4>
                        <p className="text-sm text-muted-foreground">Complete 10 courses</p>
                      </div>
                    </div>
                    <Progress value={80} className="h-2" />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">8/10 courses completed</p>
                      <Badge variant="outline" className="text-xs">
                        +500 XP
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gradient-to-br from-destructive/5 to-red-500/5 border-destructive/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                        <Flame className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <h4 className="font-medium">Streak Master</h4>
                        <p className="text-sm text-muted-foreground">30-day learning streak</p>
                      </div>
                    </div>
                    <Progress value={23} className="h-2" />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">7/30 days</p>
                      <Badge variant="outline" className="text-xs">
                        +1000 XP
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg bg-gradient-to-br from-chart-3/5 to-blue-500/5 border-chart-3/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-chart-3/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-chart-3" />
                      </div>
                      <div>
                        <h4 className="font-medium">Time Scholar</h4>
                        <p className="text-sm text-muted-foreground">100 hours of learning</p>
                      </div>
                    </div>
                    <Progress value={47} className="h-2" />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">47/100 hours</p>
                      <Badge variant="outline" className="text-xs">
                        +750 XP
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Button variant="outline" asChild>
                    <Link href="/profile?tab=achievements">
                      <Award className="h-4 w-4 mr-2" />
                      View All Achievements
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>XP Growth</CardTitle>
                  <CardDescription>Your experience points over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={weeklyProgressData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="xp"
                          stroke="var(--color-xp)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-xp)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Insights</CardTitle>
                  <CardDescription>Key metrics about your learning journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Average Session</span>
                      <span className="text-sm">2.3 hours</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Completion Rate</span>
                      <span className="text-sm">87%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Favorite Category</span>
                      <span className="text-sm">Programming</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Best Learning Day</span>
                      <span className="text-sm">Friday</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Gamification Stats
                </CardTitle>
                <CardDescription>Your engagement and reward metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="text-sm font-medium">Total XP Earned</span>
                    <span className="text-sm font-bold">{mockUser.xp.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <span className="text-sm font-medium">Achievements Unlocked</span>
                    <span className="text-sm font-bold">12/20</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg border border-destructive/20">
                    <span className="text-sm font-medium">Longest Streak</span>
                    <span className="text-sm font-bold">15 days</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <span className="text-sm font-medium">Challenges Completed</span>
                    <span className="text-sm font-bold">28</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
