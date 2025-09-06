import { type NextRequest, NextResponse } from "next/server"
import { generateCourseStructure, generateQuiz } from "@/lib/gemini"
import { findVideosForChapter } from "@/lib/youtube"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, difficulty, chapters, includeVideos } = body

    if (!name || !category || !difficulty || !chapters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[AI] Starting course generation for:", name)

    // Generate the basic course structure
    const courseStructure = await generateCourseStructure({
      name,
      description,
      category,
      difficulty,
      chapters,
      includeVideos,
    })

    console.log("[AI] Generated course structure with", courseStructure.chapters.length, "chapters")

    // If videos are requested, find YouTube videos for each chapter
    if (includeVideos) {
      console.log("[AI] Finding YouTube videos for chapters...")

      for (const chapter of courseStructure.chapters) {
        try {
          const videos = await findVideosForChapter(chapter.title, chapter.topics, category)

          // Add video URLs to lessons
          chapter.lessons.forEach((lesson, index) => {
            if (videos[index]) {
              lesson.type = "video"
              lesson.videoUrl = videos[index].url
            }
          })

          console.log(`[AI] Found ${videos.length} videos for chapter: ${chapter.title}`)
        } catch (error) {
          console.error(`[AI] Error finding videos for chapter ${chapter.title}:`, error)
          // Continue without videos for this chapter
        }
      }
    }

    // Generate quizzes for each chapter
    console.log("[AI] Generating quizzes for chapters...")

    for (const chapter of courseStructure.chapters) {
      try {
        const quiz = await generateQuiz(chapter.title, chapter.topics, difficulty)
        chapter.quiz = quiz
        console.log(`[AI] Generated quiz for chapter: ${chapter.title}`)
      } catch (error) {
        console.error(`[AI] Error generating quiz for chapter ${chapter.title}:`, error)
        // Continue without quiz for this chapter
      }
    }

    console.log("[AI] Course generation completed successfully")

    return NextResponse.json({
      success: true,
      course: courseStructure,
    })
  } catch (error) {
    console.error("[AI] Course generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate course",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
