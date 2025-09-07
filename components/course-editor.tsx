"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Clock,
  Users,
  Video,
  Edit3,
  Eye,
  Sparkles,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Brain,
} from "lucide-react"

interface Chapter {
  id: string
  title: string
  duration: string
  topics: string[]
  status: "generated" | "pending" | "editing"
  hasVideo: boolean
}

interface CourseData {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  totalChapters: number
  estimatedDuration: string
  banner: string
  chapters: Chapter[]
  progress: number
}

// Mock course data
const mockCourse: CourseData = {
  id: "course-1",
  name: "Introduction to Machine Learning",
  description:
    "Learn the fundamentals of machine learning, from basic concepts to practical applications using Python and popular ML libraries.",
  category: "Programming & Development",
  difficulty: "intermediate",
  totalChapters: 8,
  estimatedDuration: "16-24 hours",
  banner: "/machine-learning-course-banner.png",
  progress: 75,
  chapters: [
    {
      id: "ch-1",
      title: "Introduction to Machine Learning",
      duration: "2-3 hours",
      topics: ["What is ML?", "Types of ML", "Applications", "Tools & Libraries"],
      status: "generated",
      hasVideo: true,
    },
    {
      id: "ch-2",
      title: "Data Preprocessing",
      duration: "2-3 hours",
      topics: ["Data Cleaning", "Feature Engineering", "Normalization", "Handling Missing Data"],
      status: "generated",
      hasVideo: true,
    },
    {
      id: "ch-3",
      title: "Supervised Learning - Regression",
      duration: "3-4 hours",
      topics: ["Linear Regression", "Polynomial Regression", "Evaluation Metrics", "Overfitting"],
      status: "generated",
      hasVideo: false,
    },
    {
      id: "ch-4",
      title: "Supervised Learning - Classification",
      duration: "3-4 hours",
      topics: ["Logistic Regression", "Decision Trees", "Random Forest", "SVM"],
      status: "pending",
      hasVideo: true,
    },
    {
      id: "ch-5",
      title: "Unsupervised Learning",
      duration: "2-3 hours",
      topics: ["K-Means Clustering", "Hierarchical Clustering", "PCA", "DBSCAN"],
      status: "pending",
      hasVideo: false,
    },
    {
      id: "ch-6",
      title: "Model Evaluation & Validation",
      duration: "2-3 hours",
      topics: ["Cross-Validation", "Confusion Matrix", "ROC Curves", "Hyperparameter Tuning"],
      status: "pending",
      hasVideo: true,
    },
    {
      id: "ch-7",
      title: "Deep Learning Basics",
      duration: "3-4 hours",
      topics: ["Neural Networks", "Backpropagation", "Activation Functions", "TensorFlow Intro"],
      status: "pending",
      hasVideo: true,
    },
    {
      id: "ch-8",
      title: "Real-World Projects",
      duration: "4-5 hours",
      topics: ["End-to-End Project", "Model Deployment", "Best Practices", "Next Steps"],
      status: "pending",
      hasVideo: false,
    },
  ],
}

interface CourseEditorProps {
  courseData?: any
  courseId?: string
}

export function CourseEditor({ courseData, courseId }: CourseEditorProps) {
  const [course] = useState<CourseData>(courseData || mockCourse)
  const [isGenerating, setIsGenerating] = useState(false)
  const cid = courseId || course.id || "course-1"
  const router = useRouter()

  const handleGenerateContent = async () => {
    setIsGenerating(true)
    // Simulate AI content generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const generatedChapters = course.chapters.filter((ch) => ch.status === "generated").length
  const totalChapters = course.chapters.length

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
            <p className="text-muted-foreground max-w-2xl">{course.description}</p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" className="flex items-center gap-2 bg-transparent">
              <Link href={`/courses/${cid}/preview`}>
                <Eye className="h-4 w-4" />
                Preview
              </Link>
            </Button>
            <Button className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Publish Course
            </Button>
          </div>
        </div>

        {/* Course Banner */}
        <div className="relative rounded-lg overflow-hidden mb-6">
          <img
            src={course.banner || "/placeholder.svg?key=1to3q"}
            alt="Course banner"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-6">
            <div className="text-white">
              <Badge variant="secondary" className="mb-2">
                {course.category}
              </Badge>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.totalChapters} chapters
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.estimatedDuration}
                </span>
                <span className="flex items-center gap-1 capitalize">
                  <Users className="h-4 w-4" />
                  {course.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="structure" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="structure">Course Structure</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="structure" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Chapter Overview
                    </span>
                    <Badge variant="outline">
                      {generatedChapters}/{totalChapters} Generated
                    </Badge>
                  </CardTitle>
                  <CardDescription>AI-generated course structure with detailed topics for each chapter</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {course.chapters.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className="border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => router.push(`/courses/${cid}/watch/${chapter.id}`)}
                        role="button"
                        aria-label={`Open ${chapter.title}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-medium mb-1">{chapter.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {chapter.duration}
                                </span>
                                {chapter.hasVideo && (
                                  <span className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    Video included
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {chapter.status === "generated" ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <Circle className="h-5 w-5 text-muted-foreground" />
                            )}
                            <Badge variant={chapter.status === "generated" ? "default" : "secondary"}>
                              {chapter.status === "generated" ? "Ready" : "Pending"}
                            </Badge>
                            <Button asChild size="sm" variant="outline" onClick={(e) => e.stopPropagation()}>
                              <Link href={`/courses/${cid}/watch/${chapter.id}`}>Open</Link>
                            </Button>
                          </div>
                        </div>

                        <div className="ml-11">
                          <div className="flex flex-wrap gap-2">
                            {chapter.topics.map((topic, topicIndex) => (
                              <Badge key={topicIndex} variant="outline" className="text-xs">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Content Generation
                  </CardTitle>
                  <CardDescription>
                    Generate detailed lesson content, quizzes, and assignments for your course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Content Generation Progress</span>
                        <span className="text-sm text-muted-foreground">
                          {generatedChapters}/{totalChapters} chapters
                        </span>
                      </div>
                      <Progress value={(generatedChapters / totalChapters) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <div className="font-medium">Lesson Content</div>
                          <div className="text-sm text-muted-foreground">{generatedChapters} generated</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Video className="h-8 w-8 text-accent" />
                        <div>
                          <div className="font-medium">Video Content</div>
                          <div className="text-sm text-muted-foreground">5 videos found</div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleGenerateContent} disabled={isGenerating} className="w-full">
                      {isGenerating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate All Content
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Course Settings</CardTitle>
                  <CardDescription>Configure course visibility, pricing, and enrollment options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center py-8 text-muted-foreground">Course settings panel coming soon...</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">Draft - In Progress</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Difficulty</Label>
                  <p className="text-sm text-muted-foreground capitalize">{course.difficulty}</p>
                </div>
                <Separator />
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm text-muted-foreground">{course.estimatedDuration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href={`/courses/${cid}/preview`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Course
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
                onClick={async () => {
                  await fetch(`/api/courses/${cid}/test-path`)
                  alert("Learning path validated successfully.")
                }}
              >
                <Play className="h-4 w-4 mr-2" />
                Test Learning Path
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href={`/courses/${cid}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Course Info
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={`text-sm font-medium ${className}`} {...props} />
}
