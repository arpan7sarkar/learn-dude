"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Brain, BookOpen, Video, Clock, Users, Sparkles, ChevronRight, Play } from "lucide-react"

const courseFormSchema = z.object({
  name: z.string().min(3, "Course name must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  difficulty: z.string().min(1, "Please select a difficulty level"),
  chapters: z.number().min(1).max(20),
  includeVideos: z.boolean().default(false),
  estimatedDuration: z.string().optional(),
})

type CourseFormData = z.infer<typeof courseFormSchema>

const categories = [
  "Programming & Development",
  "Data Science & Analytics",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Engineering",
  "Business & Finance",
  "Design & Creative",
  "Languages",
  "Personal Development",
  "Other",
]

const difficulties = [
  { value: "beginner", label: "Beginner", description: "No prior knowledge required" },
  { value: "intermediate", label: "Intermediate", description: "Some basic knowledge helpful" },
  { value: "advanced", label: "Advanced", description: "Requires solid foundation" },
]

interface CourseCreationFormProps {
  onSubmit: (data: CourseFormData) => void
  isGenerating?: boolean
}

export function CourseCreationForm({ onSubmit, isGenerating = false }: CourseCreationFormProps) {
  const [step, setStep] = useState(1)
  const totalSteps = 3

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      difficulty: "",
      chapters: 5,
      includeVideos: false,
      estimatedDuration: "",
    },
  })

  const handleSubmit = (data: CourseFormData) => {
    onSubmit(data)
  }

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Create AI Course</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-sm text-muted-foreground mt-2">
          Step {step} of {totalSteps}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Course Basics
                </CardTitle>
                <CardDescription>Tell us about your course and we'll generate a complete learning path</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Introduction to Machine Learning" {...field} />
                      </FormControl>
                      <FormDescription>Choose a clear, descriptive name for your course</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what students will learn in this course..."
                          className="min-h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Help AI understand your course goals and target audience</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button onClick={nextStep} type="button">
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Course Structure */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Course Structure
                </CardTitle>
                <CardDescription>Configure how your course will be organized and delivered</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {difficulties.map((diff) => (
                            <SelectItem key={diff.value} value={diff.value}>
                              <div className="flex flex-col">
                                <span>{diff.label}</span>
                                <span className="text-xs text-muted-foreground">{diff.description}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chapters"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Chapters</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <Input
                            type="number"
                            min="1"
                            max="20"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 1)}
                          />
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            Estimated: {field.value * 2}-{field.value * 4} hours total
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>AI will create detailed lessons for each chapter</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="includeVideos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Include Video Content
                        </FormLabel>
                        <FormDescription>AI will find relevant YouTube videos for each topic</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline" type="button">
                    Previous
                  </Button>
                  <Button onClick={nextStep} type="button">
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review & Generate */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Review & Generate
                </CardTitle>
                <CardDescription>Review your course details and let AI create your learning path</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Course Summary */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Course Name</Label>
                      <p className="text-sm text-muted-foreground">{form.watch("name") || "Not specified"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Category</Label>
                      <p className="text-sm text-muted-foreground">{form.watch("category") || "Not selected"}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Difficulty</Label>
                      <p className="text-sm text-muted-foreground capitalize">
                        {form.watch("difficulty") || "Not selected"}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Chapters</Label>
                      <p className="text-sm text-muted-foreground">{form.watch("chapters")} chapters</p>
                    </div>
                  </div>

                  {form.watch("description") && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground">{form.watch("description")}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span>Videos: {form.watch("includeVideos") ? "Included" : "Not included"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>AI-Generated Content</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">What happens next?</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• AI will create a detailed course structure</li>
                        <li>• Generate lesson content for each chapter</li>
                        <li>• Create quizzes and assignments</li>
                        {form.watch("includeVideos") && <li>• Find relevant video content</li>}
                        <li>• Set up progress tracking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button onClick={prevStep} variant="outline" type="button" disabled={isGenerating}>
                    Previous
                  </Button>
                  <Button type="submit" disabled={isGenerating} className="min-w-32">
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Generate Course
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </form>
      </Form>
    </div>
  )
}
