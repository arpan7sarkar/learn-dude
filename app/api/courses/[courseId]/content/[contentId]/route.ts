import { type NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string; contentId: string } }
) {
  try {
    const { courseId, contentId } = params

    if (!courseId || !contentId) {
      return NextResponse.json({ error: "Course ID and Content ID are required" }, { status: 400 })
    }

    console.log(`[API] Fetching content: ${contentId} for course: ${courseId}`)

    // Mock content data - in real app, fetch from database
    const content = {
      id: contentId,
      courseId,
      title: "Machine Learning Fundamentals",
      type: "lesson",
      content: `# Machine Learning Fundamentals

Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Key Concepts:

### 1. **Types of Machine Learning**
- **Supervised Learning**: Learning with labeled examples
- **Unsupervised Learning**: Finding patterns in unlabeled data  
- **Reinforcement Learning**: Learning through trial and error

### 2. **Common Applications**
- Image recognition and computer vision
- Natural language processing
- Recommendation systems
- Predictive analytics
- Autonomous vehicles

### 3. **The Learning Process**
1. **Data Collection**: Gather relevant datasets
2. **Data Preprocessing**: Clean and prepare data
3. **Model Selection**: Choose appropriate algorithms
4. **Training**: Feed data to the model
5. **Evaluation**: Test model performance
6. **Deployment**: Use model in production

Machine learning has revolutionized industries by enabling computers to identify patterns, make predictions, and automate complex decision-making processes that would be impossible to program manually.`,
      videoUrl: "dQw4w9WgXcQ",
      duration: 15,
      status: "published",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      content
    })
  } catch (error) {
    console.error("[API] Fetch content error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch content",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
