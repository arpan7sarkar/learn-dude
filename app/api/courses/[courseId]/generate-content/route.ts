import { NextResponse } from "next/server"
import type { ApiResponse, Lesson } from "@/lib/types"
import { generateLessonContent } from "@/lib/gemini"

function markdownToHtml(md: string): string {
  // very basic markdown to HTML; replace only common patterns to avoid extra deps
  let html = md
  html = html.replace(/^###\s+(.*)$/gim, '<h3>$1</h3>')
  html = html.replace(/^##\s+(.*)$/gim, '<h2>$1</h2>')
  html = html.replace(/^#\s+(.*)$/gim, '<h1>$1</h1>')
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>')
  html = html.replace(/`{3}([\s\S]*?)`{3}/gim, '<pre><code>$1</code></pre>')
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>')
  html = html.replace(/^\s*[-*]\s+(.*)$/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)(?![\s\S]*<li>)/gim, '<ul>$1</ul>')
  html = html.replace(/^(?!<h\d|<ul|<pre|<li|<p|<\/)(.+)$/gim, '<p>$1</p>')
  return html
}

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const body = await req.json()
    const {
      lesson = { id: `gen-${Date.now()}`, title: 'Untitled', duration: 10, type: 'lesson' },
      chapterTitle = 'Chapter',
      courseTitle = `Course ${params.courseId}`,
      difficulty = 'Beginner',
    } = body || {}

    const md = await generateLessonContent(
      {
        id: String(lesson.id),
        title: String(lesson.title),
        content: '',
        type: 'text',
        duration: String(lesson.duration ?? 15),
      } as any,
      chapterTitle,
      courseTitle,
      difficulty,
    )

    const html = markdownToHtml(md)

    const created: Lesson = {
      id: String(lesson.id),
      title: String(lesson.title),
      type: 'lesson',
      duration: Number(lesson.duration ?? 15),
      content: html,
    }

    const res: ApiResponse<{ created: Lesson }> = { success: true, data: { created } }
    return NextResponse.json(res)
  } catch (error) {
    console.error('generate-content error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate content' } as ApiResponse<never>, {
      status: 500,
    })
  }
}
