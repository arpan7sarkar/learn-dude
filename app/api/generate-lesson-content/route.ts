import { type NextRequest, NextResponse } from "next/server"
import { generateLessonContent } from "@/lib/gemini"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lesson, chapterContext, courseContext, difficulty } = body

    if (!lesson || !chapterContext || !courseContext || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[AI] Generating content for lesson:", lesson.title)

    const content = await generateLessonContent(lesson, chapterContext, courseContext, difficulty)

    console.log("[AI] Generated lesson content successfully")

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error) {
    console.error("[AI] Lesson content generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate lesson content",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
