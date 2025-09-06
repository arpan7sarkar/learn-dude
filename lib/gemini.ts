import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set in environment variables. AI course generation will not work.")
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

export interface CourseStructure {
  title: string
  description: string
  estimatedDuration: string
  chapters: Chapter[]
  prerequisites: string[]
  learningObjectives: string[]
}

export interface Chapter {
  id: string
  title: string
  description: string
  duration: string
  topics: string[]
  lessons: Lesson[]
  quiz?: Quiz
}

export interface Lesson {
  id: string
  title: string
  content: string
  type: "text" | "video" | "interactive"
  duration: string
  videoUrl?: string
}

export interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
}

export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correctAnswer: string
  explanation: string
}

export async function generateCourseStructure(courseData: {
  name: string
  description?: string
  category: string
  difficulty: string
  chapters: number
  includeVideos: boolean
}): Promise<CourseStructure> {
  if (!genAI) {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Create a comprehensive course structure for the following course:

Course Name: ${courseData.name}
Description: ${courseData.description || "Not provided"}
Category: ${courseData.category}
Difficulty Level: ${courseData.difficulty}
Number of Chapters: ${courseData.chapters}
Include Videos: ${courseData.includeVideos ? "Yes" : "No"}

Please generate a detailed course structure with the following requirements:

1. Course overview with estimated total duration
2. Prerequisites (if any)
3. Learning objectives (3-5 key outcomes)
4. ${courseData.chapters} chapters, each with:
   - Chapter title and description
   - Estimated duration (in hours)
   - 3-5 key topics covered
   - 3-4 lessons per chapter with titles and brief descriptions
   - Duration for each lesson (15-45 minutes)

Make sure the content is:
- Appropriate for ${courseData.difficulty} level learners
- Logically structured and progressive
- Practical and engaging
- Relevant to ${courseData.category}

Return the response as a valid JSON object with this exact structure:
{
  "title": "course title",
  "description": "detailed course description",
  "estimatedDuration": "X-Y hours",
  "prerequisites": ["prerequisite1", "prerequisite2"],
  "learningObjectives": ["objective1", "objective2", "objective3"],
  "chapters": [
    {
      "id": "chapter-1",
      "title": "Chapter Title",
      "description": "Chapter description",
      "duration": "X hours",
      "topics": ["topic1", "topic2", "topic3"],
      "lessons": [
        {
          "id": "lesson-1-1",
          "title": "Lesson Title",
          "content": "Brief lesson description",
          "type": "text",
          "duration": "X minutes"
        }
      ]
    }
  ]
}
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response")
    }

    const courseStructure = JSON.parse(jsonMatch[0]) as CourseStructure
    return courseStructure
  } catch (error) {
    console.error("Error generating course structure:", error)
    throw new Error("Failed to generate course structure")
  }
}

export async function generateLessonContent(
  lesson: Lesson,
  chapterContext: string,
  courseContext: string,
  difficulty: string,
): Promise<string> {
  if (!genAI) {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Generate detailed lesson content for the following lesson:

Course Context: ${courseContext}
Chapter Context: ${chapterContext}
Lesson Title: ${lesson.title}
Lesson Description: ${lesson.content}
Difficulty Level: ${difficulty}
Target Duration: ${lesson.duration}

Create comprehensive lesson content that includes:
1. Learning objectives for this specific lesson
2. Detailed explanation of concepts
3. Practical examples and use cases
4. Step-by-step instructions where applicable
5. Key takeaways and summary
6. Practice exercises or reflection questions

The content should be:
- Appropriate for ${difficulty} level learners
- Engaging and easy to follow
- Practical with real-world applications
- Well-structured with clear sections

Format the content in markdown with proper headings, bullet points, and code blocks where appropriate.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating lesson content:", error)
    throw new Error("Failed to generate lesson content")
  }
}

export async function generateQuiz(chapterTitle: string, chapterTopics: string[], difficulty: string): Promise<Quiz> {
  if (!genAI) {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Create a quiz for the following chapter:

Chapter: ${chapterTitle}
Topics Covered: ${chapterTopics.join(", ")}
Difficulty Level: ${difficulty}

Generate 5-8 quiz questions that test understanding of the key concepts. Include:
- 3-4 multiple choice questions
- 1-2 true/false questions  
- 1-2 short answer questions

For each question provide:
- Clear, unambiguous question text
- Answer options (for multiple choice)
- Correct answer
- Brief explanation of why the answer is correct

Return as valid JSON with this structure:
{
  "id": "quiz-id",
  "title": "Chapter Quiz: [Chapter Name]",
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "multiple-choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Explanation text"
    }
  ]
}
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response")
    }

    const quiz = JSON.parse(jsonMatch[0]) as Quiz
    return quiz
  } catch (error) {
    console.error("Error generating quiz:", error)
    throw new Error("Failed to generate quiz")
  }
}
