import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const { courseId } = params

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }

    console.log(`[API] Fetching chapters for course: ${courseId}`)

    // Mock chapter data - in real app, fetch from database
    const chapters = [
      {
        id: "ch1",
        title: "Introduction to Machine Learning",
        order: 1,
        duration: "2-3 hours",
        status: "published",
        lessons: [
          {
            id: "l1",
            title: "What is Machine Learning?",
            type: "lesson",
            duration: 15,
            videoUrl: "dQw4w9WgXcQ",
            completed: false
          },
          {
            id: "l2",
            title: "Types of Learning Algorithms",
            type: "lesson",
            duration: 20,
            videoUrl: "dQw4w9WgXcQ",
            completed: false
          }
        ],
        completed: false
      },
      {
        id: "ch2",
        title: "Data Preprocessing",
        order: 2,
        duration: "2-3 hours",
        status: "published",
        lessons: [
          {
            id: "l3",
            title: "Data Cleaning Techniques",
            type: "lesson",
            duration: 25,
            videoUrl: "dQw4w9WgXcQ",
            completed: false
          },
          {
            id: "l4",
            title: "Feature Engineering Quiz",
            type: "quiz",
            duration: 10,
            completed: false
          }
        ],
        completed: false
      },
      {
        id: "ch3",
        title: "Model Training & Evaluation",
        order: 3,
        duration: "3-4 hours",
        status: "published",
        lessons: [
          {
            id: "l5",
            title: "Training Your First Model",
            type: "lesson",
            duration: 30,
            videoUrl: "dQw4w9WgXcQ",
            completed: false
          }
        ],
        completed: false
      }
    ]

    return NextResponse.json({
      success: true,
      chapters
    })
  } catch (error) {
    console.error("[API] Fetch chapters error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch chapters",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
