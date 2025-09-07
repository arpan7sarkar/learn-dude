import { NextResponse } from "next/server"
import type { ApiResponse, CourseMeta } from "@/lib/types"

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
  const payload = await req.json().catch(() => ({}))

  const updated: CourseMeta = {
    id: params.courseId,
    name: payload.name || "Untitled Course",
    description: payload.description || "",
    category: payload.category || "General",
    difficulty: payload.difficulty || "Beginner",
    status: payload.status || "draft",
    thumbnail: payload.thumbnail || "/placeholder.svg",
  }

  const res: ApiResponse<CourseMeta> = { success: true, data: updated }
  return NextResponse.json(res)
}
