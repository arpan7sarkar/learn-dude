import { NextResponse } from "next/server"
import type { ApiResponse, CourseMeta } from "@/lib/types"

export async function POST(_req: Request, { params }: { params: { courseId: string } }) {
  const { courseId } = params

  const meta: CourseMeta = {
    id: courseId,
    name: `Course ${courseId}`,
    description: "Mock course published",
    category: "General",
    difficulty: "Beginner",
    status: "published",
    thumbnail: "/placeholder.svg",
  }

  const res: ApiResponse<CourseMeta> = { success: true, data: meta }
  return NextResponse.json(res)
}
