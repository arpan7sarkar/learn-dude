import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, courseContext, conversationHistory } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Build context for the AI tutor
    let contextPrompt = `You are an AI tutor helping students learn. You should:
- Provide clear, educational explanations
- Use examples and analogies when helpful
- Encourage learning and critical thinking
- Ask follow-up questions to check understanding
- Adapt your explanations to the student's level

`

    if (courseContext) {
      contextPrompt += `Current learning context:
- Course: ${courseContext.courseName}
- Chapter: ${courseContext.currentChapter}
- Lesson: ${courseContext.currentLesson}

`
    }

    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
      contextPrompt += "Previous conversation:\n"
      conversationHistory.slice(-5).forEach((msg: any) => {
        contextPrompt += `${msg.role}: ${msg.content}\n`
      })
      contextPrompt += "\n"
    }

    contextPrompt += `Student question: ${message}

Please provide a helpful, educational response:`

    const result = await model.generateContent(contextPrompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      success: true,
      response: text,
    })
  } catch (error) {
    console.error("[AI Tutor] Error:", error)
    return NextResponse.json(
      {
        error: "Failed to get AI response",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
