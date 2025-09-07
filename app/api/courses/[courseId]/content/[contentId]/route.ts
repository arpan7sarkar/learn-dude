import { NextResponse } from "next/server"
import type { ApiResponse, Lesson } from "@/lib/types"

export async function GET(_req: Request, { params }: { params: { courseId: string; contentId: string } }) {
  const { courseId, contentId } = params
  const lesson: Lesson = {
    id: contentId,
    title: `Lesson ${contentId} for ${courseId}`,
    type: "lesson",
    duration: 12,
    content:
      "<h2>Auto-generated Content</h2><p>This is mock content generated on demand for the selected item.</p>",
  }
  const res: ApiResponse<Lesson> = { success: true, data: lesson }
  return NextResponse.json(res)
}
