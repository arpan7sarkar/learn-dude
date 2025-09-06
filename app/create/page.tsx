"use client"

import { useState } from "react"
import { CourseCreationForm } from "@/components/course-creation-form"
import { CourseEditor } from "@/components/course-editor"
import { AIGenerationStatus } from "@/components/ai-generation-status"

type CourseFormData = {
  name: string
  description?: string
  category: string
  difficulty: string
  chapters: number
  includeVideos: boolean
  estimatedDuration?: string
}

export default function CreateCoursePage() {
  const [step, setStep] = useState<"form" | "generating" | "editor">("form")
  const [isGenerating, setIsGenerating] = useState(false)
  const [courseFormData, setCourseFormData] = useState<CourseFormData | null>(null)
  const [generatedCourse, setGeneratedCourse] = useState(null)

  const handleCourseSubmit = async (data: CourseFormData) => {
    setCourseFormData(data)
    setIsGenerating(true)
    setStep("generating")
  }

  const handleGenerationComplete = (courseData: any) => {
    setGeneratedCourse(courseData)
    setIsGenerating(false)
    setStep("editor")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        {step === "form" && <CourseCreationForm onSubmit={handleCourseSubmit} isGenerating={isGenerating} />}

        {step === "generating" && (
          <AIGenerationStatus
            isGenerating={isGenerating}
            onComplete={handleGenerationComplete}
            courseFormData={courseFormData}
          />
        )}

        {step === "editor" && generatedCourse && <CourseEditor courseData={generatedCourse} />}
      </div>
    </div>
  )
}
