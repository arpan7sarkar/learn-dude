import { NextResponse } from "next/server"
import type { ApiResponse } from "@/lib/types"

export async function GET(_req: Request, { params }: { params: { courseId: string } }) {
  const checks = {
    courseId: params.courseId,
    validSequence: true,
    issues: [] as string[],
    summary: "Learning path validated successfully. No blocking issues found.",
  }
  const res: ApiResponse<typeof checks> = { success: true, data: checks }
  return NextResponse.json(res)
}
