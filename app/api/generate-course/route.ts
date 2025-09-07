import { type NextRequest, NextResponse } from "next/server"
import { generateCourseStructure, generateQuiz } from "@/lib/gemini"
import { findVideosForChapter } from "@/lib/youtube"

import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await request.json()
    const { name, description, category, difficulty, chapters, includeVideos } = body

    if (!name || !category || !difficulty || !chapters) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[AI] Starting course generation for:", name)

    const courseStructure = await generateCourseStructure({
      name,
      description,
      category,
      difficulty,
      chapters,
      includeVideos,
    })

    console.log("[AI] Generated course structure with", courseStructure.chapters.length, "chapters")

    if (includeVideos) {
      console.log("[AI] Finding YouTube videos for chapters...")
      for (const chapter of courseStructure.chapters) {
        try {
          const videos = await findVideosForChapter(chapter.title, chapter.topics, category)
          chapter.lessons.forEach((lesson, index) => {
            if (videos[index]) {
              lesson.type = "video"
              lesson.videoUrl = videos[index].url
            }
          })
          console.log(`[AI] Found ${videos.length} videos for chapter: ${chapter.title}`)
        } catch (error) {
          console.error(`[AI] Error finding videos for chapter ${chapter.title}:`, error)
        }
      }
    }

    console.log("[AI] Generating quizzes for chapters...")
    for (const chapter of courseStructure.chapters) {
      try {
        const quiz = await generateQuiz(chapter.title, chapter.topics, difficulty)
        chapter.quiz = quiz
        console.log(`[AI] Generated quiz for chapter: ${chapter.title}`)
      } catch (error) {
        console.error(`[AI] Error generating quiz for chapter ${chapter.title}:`, error)
      }
    }

    console.log("[DB] Saving generated course to the database...")

    const course = await db.course.create({
      data: {
        name: courseStructure.name,
        description: courseStructure.description,
        category: courseStructure.category,
        difficulty: courseStructure.difficulty,
        userId: userId,
        chapters: {
          create: courseStructure.chapters.map((chapter: any, index: number) => {
            const lessonsData = chapter.lessons.map((lesson: any) => ({
              title: lesson.title,
              type: lesson.videoUrl ? "video" : "lesson",
              videoId: lesson.videoUrl,
            }))

            if (chapter.quiz) {
              lessonsData.push({
                title: "Quiz",
                type: "quiz",
                content: JSON.stringify(chapter.quiz),
              })
            }

            return {
              title: chapter.title,
              order: index,
              lessons: {
                create: lessonsData,
              },
            }
          }),
        },
      },
      include: {
        chapters: {
          include: {
            lessons: true,
          },
        },
      },
    })

    console.log("[DB] Course saved successfully with ID:", course.id)

    return NextResponse.json({
      success: true,
      course: course,
    })
  } catch (error) {
    console.error("[API] Course generation error:", error)
    return NextResponse.json(
      {
        error: "Failed to generate course",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
