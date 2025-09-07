import { type NextRequest, NextResponse } from "next/server"
import { generateLessonContent } from "@/lib/gemini"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { lesson, chapterContext, courseContext, difficulty } = body

    if (!lesson || !lesson.id || !chapterContext || !courseContext || !difficulty) {
      return NextResponse.json({ error: "Missing required fields, including lesson.id" }, { status: 400 })
    }

    console.log("[AI] Generating content for lesson:", lesson.title)

    const content = await generateLessonContent(lesson, chapterContext, courseContext, difficulty)

    console.log("[AI] Generated lesson content successfully")

    console.log("[DB] Saving lesson content to the database...")
    const updatedLesson = await db.lesson.update({
      where: {
        id: lesson.id,
      },
      data: {
        content: content,
      },
    })
    console.log("[DB] Lesson content saved successfully for lesson:", updatedLesson.id)

    return NextResponse.json({
      success: true,
      content: updatedLesson.content,
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
