"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader2, Brain, Video, FileText, HelpCircle } from "lucide-react"

interface GenerationStep {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed" | "error"
  icon: React.ReactNode
}

interface AIGenerationStatusProps {
  isGenerating: boolean
  onComplete?: (courseData: any) => void
  courseFormData?: any
}

export function AIGenerationStatus({ isGenerating, onComplete, courseFormData }: AIGenerationStatusProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [generatedCourse, setGeneratedCourse] = useState(null)

  const steps: GenerationStep[] = [
    {
      id: "structure",
      title: "Generating Course Structure",
      description: "AI is creating chapters and learning objectives",
      status: "pending",
      icon: <Brain className="h-4 w-4" />,
    },
    {
      id: "content",
      title: "Creating Lesson Content",
      description: "Generating detailed content for each lesson",
      status: "pending",
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "videos",
      title: "Finding Video Content",
      description: "Searching for relevant educational videos",
      status: "pending",
      icon: <Video className="h-4 w-4" />,
    },
    {
      id: "quizzes",
      title: "Creating Quizzes",
      description: "Generating assessments and practice questions",
      status: "pending",
      icon: <HelpCircle className="h-4 w-4" />,
    },
  ]

  const [generationSteps, setGenerationSteps] = useState(steps)

  useEffect(() => {
    if (!isGenerating) return

    const generateCourse = async () => {
      try {
        // Update step status
        const updateStep = (stepIndex: number, status: GenerationStep["status"]) => {
          setGenerationSteps((prev) => prev.map((step, index) => (index === stepIndex ? { ...step, status } : step)))
          setCurrentStep(stepIndex)
          setProgress(((stepIndex + 1) / steps.length) * 100)
        }

        // Step 1: Generate course structure
        updateStep(0, "in-progress")

        const response = await fetch("/api/generate-course", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(courseFormData),
        })

        if (!response.ok) {
          throw new Error("Failed to generate course")
        }

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error || "Course generation failed")
        }

        updateStep(0, "completed")

        // Simulate other steps for demo (in real implementation, these would be actual API calls)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        updateStep(1, "in-progress")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        updateStep(1, "completed")

        if (courseFormData?.includeVideos) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          updateStep(2, "in-progress")
          await new Promise((resolve) => setTimeout(resolve, 2000))
          updateStep(2, "completed")
        } else {
          setGenerationSteps((prev) =>
            prev.map((step, index) =>
              index === 2 ? { ...step, status: "pending", description: "Skipped - videos not requested" } : step,
            ),
          )
        }

        await new Promise((resolve) => setTimeout(resolve, 1000))
        updateStep(3, "in-progress")
        await new Promise((resolve) => setTimeout(resolve, 1500))
        updateStep(3, "completed")

        setGeneratedCourse(result.course)
        setProgress(100)

        // Call completion callback
        if (onComplete) {
          onComplete(result.course)
        }
      } catch (error) {
        console.error("Course generation error:", error)
        setGenerationSteps((prev) =>
          prev.map((step, index) => (index === currentStep ? { ...step, status: "error" } : step)),
        )
      }
    }

    generateCourse()
  }, [isGenerating, courseFormData, onComplete])

  if (!isGenerating) return null

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          AI Course Generation in Progress
        </CardTitle>
        <CardDescription>Please wait while our AI creates your personalized course content</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Overall Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Generation Steps */}
        <div className="space-y-4">
          {generationSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
              <div className="flex-shrink-0">
                {step.status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : step.status === "in-progress" ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : step.status === "error" ? (
                  <Circle className="h-5 w-5 text-destructive" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {step.icon}
                  <h4 className="font-medium text-sm">{step.title}</h4>
                  <Badge
                    variant={
                      step.status === "completed"
                        ? "default"
                        : step.status === "in-progress"
                          ? "secondary"
                          : step.status === "error"
                            ? "destructive"
                            : "outline"
                    }
                    className="text-xs"
                  >
                    {step.status === "in-progress"
                      ? "Processing"
                      : step.status === "completed"
                        ? "Done"
                        : step.status === "error"
                          ? "Error"
                          : "Waiting"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Estimated time: 2-3 minutes</p>
          <p className="mt-1">AI is analyzing your requirements and creating personalized content...</p>
        </div>
      </CardContent>
    </Card>
  )
}
