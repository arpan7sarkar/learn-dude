import { NextResponse } from "next/server"
import type { ApiResponse, Chapter, Lesson } from "@/lib/types"
import { generateCourseStructure } from "@/lib/gemini"
import { findVideosForChapter } from "@/lib/youtube"

export async function GET(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get("name") || `Course ${params.courseId}`
    const description = searchParams.get("description") || ""
    const category = searchParams.get("category") || "General"
    const difficulty = searchParams.get("difficulty") || "Beginner"
    const chaptersCount = Number(searchParams.get("chapters") || 3)
    const includeVideos = (searchParams.get("includeVideos") || "true").toLowerCase() === "true"

    // Generate structure using Gemini
    const structure = await generateCourseStructure({
      name,
      description,
      category,
      difficulty,
      chapters: chaptersCount,
      includeVideos,
    })

    // Map to our Chapter/Lesson types and enrich with YouTube videos when requested
    const chapters: Chapter[] = []
    for (let i = 0; i < structure.chapters.length; i++) {
      const ch = structure.chapters[i]

      let lessons: Lesson[] = ch.lessons.map((ls, li) => {
        const mins = Number.parseInt((ls.duration || "0").replace(/[^0-9]/g, "")) || 15
        const type = ls.type === "video" ? "video" : "lesson"
        return {
          id: ls.id || `l-${i + 1}-${li + 1}`,
          title: ls.title,
          type,
          duration: mins,
          // content intentionally not pre-filled; will be generated on-demand
        } as Lesson
      })

      if (includeVideos) {
        try {
          const videos = await findVideosForChapter(ch.title, ch.topics || [], category)
          // attach matches by index
          lessons = lessons.map((ls, idx) => {
            if (ls.type === "video" && videos[idx]) {
              const url = videos[idx].url
              const idMatch = url.match(/[?&]v=([^&]+)/)
              const videoId = idMatch ? idMatch[1] : videos[idx].id
              return { ...ls, videoId }
            }
            return ls
          })
        } catch (e) {
          console.warn("YouTube enrichment failed for chapter:", ch.title, e)
        }
      }

      chapters.push({
        id: ch.id || `ch-${i + 1}`,
        title: ch.title,
        order: i + 1,
        completed: false,
        topics: ch.topics || [],
        lessons,
      })
    }

    const res: ApiResponse<{ chapters: Chapter[] }> = { success: true, data: { chapters } }
    return NextResponse.json(res)
  } catch (error) {
    console.error("Chapters generation error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate chapters" } satisfies ApiResponse<never>, {
      status: 500,
    })
  }
}
