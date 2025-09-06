"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import {
  TrendingUp,
  Clock,
  Target,
  Brain,
  BookOpen,
  Zap,
  Calendar,
  Award,
  Activity,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

// Mock analytics data
const learningTrendsData = [
  { month: "Jan", hours: 45, courses: 2, xp: 1200, completion: 85 },
  { month: "Feb", hours: 52, courses: 3, xp: 1450, completion: 78 },
  { month: "Mar", hours: 38, courses: 1, xp: 980, completion: 92 },
  { month: "Apr", hours: 67, courses: 4, xp: 1890, completion: 88 },
  { month: "May", hours: 71, courses: 3, xp: 2100, completion: 91 },
  { month: "Jun", hours: 58, courses: 2, xp: 1650, completion: 86 },
]

const skillProgressData = [
  { skill: "Programming", current: 85, target: 90, growth: 12 },
  { skill: "Data Science", current: 72, target: 80, growth: 18 },
  { skill: "Machine Learning", current: 68, target: 85, growth: 25 },
  { skill: "Web Development", current: 91, target: 95, growth: 8 },
  { skill: "Design", current: 45, target: 70, growth: 35 },
  { skill: "Business", current: 38, target: 60, growth: 22 },
]

const performanceRadarData = [
  { subject: "Speed", A: 85, fullMark: 100 },
  { subject: "Accuracy", A: 92, fullMark: 100 },
  { subject: "Consistency", A: 78, fullMark: 100 },
  { subject: "Engagement", A: 88, fullMark: 100 },
  { subject: "Retention", A: 82, fullMark: 100 },
  { subject: "Application", A: 75, fullMark: 100 },
]

const timeDistributionData = [
  { category: "Programming", hours: 45, color: "hsl(var(--chart-1))" },
  { category: "Data Science", hours: 32, color: "hsl(var(--chart-2))" },
  { category: "Design", hours: 18, color: "hsl(var(--chart-3))" },
  { category: "Business", hours: 12, color: "hsl(var(--chart-4))" },
  { category: "Other", hours: 8, color: "hsl(var(--chart-5))" },
]

const goalTrackingData = [
  {
    id: "1",
    title: "Complete 5 Courses This Month",
    progress: 80,
    current: 4,
    target: 5,
    deadline: "Dec 31, 2024",
    category: "Learning",
    priority: "high",
  },
  {
    id: "2",
    title: "Maintain 30-Day Streak",
    progress: 60,
    current: 18,
    target: 30,
    deadline: "Jan 15, 2025",
    category: "Consistency",
    priority: "medium",
  },
  {
    id: "3",
    title: "Earn 5000 XP",
    progress: 49,
    current: 2450,
    target: 5000,
    deadline: "Feb 1, 2025",
    category: "Achievement",
    priority: "low",
  },
]

const chartConfig = {
  hours: { label: "Hours", color: "hsl(var(--chart-1))" },
  courses: { label: "Courses", color: "hsl(var(--chart-2))" },
  xp: { label: "XP", color: "hsl(var(--chart-3))" },
  completion: { label: "Completion %", color: "hsl(var(--chart-4))" },
}

export function LearningAnalytics() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

  const totalHours = learningTrendsData.reduce((sum, data) => sum + data.hours, 0)
  const avgCompletion = Math.round(
    learningTrendsData.reduce((sum, data) => sum + data.completion, 0) / learningTrendsData.length,
  )
  const totalCourses = learningTrendsData.reduce((sum, data) => sum + data.courses, 0)
  const totalXP = learningTrendsData.reduce((sum, data) => sum + data.xp, 0)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Learning Analytics</h1>
        <p className="text-muted-foreground">Detailed insights into your learning progress and performance</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 max-w-lg">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Hours</p>
                    <p className="text-2xl font-bold">{totalHours}</p>
                  </div>
                  <Clock className="h-8 w-8 text-chart-1" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">+12% from last period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                    <p className="text-2xl font-bold">{totalCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-chart-2" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">+25% from last period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total XP</p>
                    <p className="text-2xl font-bold">{totalXP.toLocaleString()}</p>
                  </div>
                  <Zap className="h-8 w-8 text-chart-3" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">+18% from last period</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Completion</p>
                    <p className="text-2xl font-bold">{avgCompletion}%</p>
                  </div>
                  <Target className="h-8 w-8 text-chart-4" />
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground">+3% from last period</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Trends */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Learning Trends
                </CardTitle>
                <CardDescription>Your learning activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={learningTrendsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="hours"
                        stroke="var(--color-hours)"
                        fill="var(--color-hours)"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Time Distribution
                </CardTitle>
                <CardDescription>How you spend your learning time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={timeDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="hours"
                      >
                        {timeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {timeDistributionData.map((category) => (
                    <div key={category.category} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                      <span>{category.category}</span>
                      <span className="text-muted-foreground">({category.hours}h)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Skill Development Progress
              </CardTitle>
              <CardDescription>Track your progress across different skill areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillProgressData.map((skill) => (
                  <div key={skill.skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{skill.skill}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          +{skill.growth}% growth
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {skill.current}% / {skill.target}%
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Progress value={skill.current} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Current: {skill.current}%</span>
                        <span>Target: {skill.target}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Radar
                </CardTitle>
                <CardDescription>Multi-dimensional performance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={performanceRadarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Performance"
                        dataKey="A"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monthly Comparison
                </CardTitle>
                <CardDescription>Compare your performance across months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={learningTrendsData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="completion" fill="var(--color-completion)" radius={4} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-generated insights about your learning patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Strengths</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Consistent daily learning habits</li>
                    <li>• High completion rates (91% avg)</li>
                    <li>• Strong performance in programming</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Increase focus on design skills</li>
                    <li>• Improve retention in business topics</li>
                    <li>• Consider longer study sessions</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goal Tracking
              </CardTitle>
              <CardDescription>Monitor your progress towards learning objectives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {goalTrackingData.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{goal.category}</Badge>
                          <Badge
                            variant={
                              goal.priority === "high"
                                ? "destructive"
                                : goal.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                          >
                            {goal.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Due: {goal.deadline}</p>
                        <p className="text-sm font-medium">
                          {goal.current} / {goal.target}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Learning Patterns
                </CardTitle>
                <CardDescription>AI analysis of your learning behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Peak Learning Time</h4>
                  <p className="text-sm text-muted-foreground">You learn best between 9 AM - 11 AM</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Optimal Session Length</h4>
                  <p className="text-sm text-muted-foreground">45-60 minutes for maximum retention</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Learning Style</h4>
                  <p className="text-sm text-muted-foreground">Visual learner with hands-on preference</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions to improve learning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-sm mb-1">Focus Area</h4>
                  <p className="text-sm text-muted-foreground">Spend more time on Data Science fundamentals</p>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg border border-accent/20">
                  <h4 className="font-medium text-sm mb-1">Study Schedule</h4>
                  <p className="text-sm text-muted-foreground">Try 3x weekly sessions instead of daily</p>
                </div>
                <div className="p-3 bg-chart-3/5 rounded-lg border border-chart-3/20">
                  <h4 className="font-medium text-sm mb-1">Content Type</h4>
                  <p className="text-sm text-muted-foreground">Add more interactive coding exercises</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Learning Forecast
              </CardTitle>
              <CardDescription>Projected progress based on current patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Next Month</h4>
                  <p className="text-2xl font-bold text-primary">2 Courses</p>
                  <p className="text-sm text-muted-foreground">Expected completions</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Next Quarter</h4>
                  <p className="text-2xl font-bold text-accent">Level 15</p>
                  <p className="text-sm text-muted-foreground">Projected level</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Year End</h4>
                  <p className="text-2xl font-bold text-chart-3">12,000 XP</p>
                  <p className="text-sm text-muted-foreground">Total experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
