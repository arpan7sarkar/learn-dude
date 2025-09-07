import { GoogleGenerativeAI } from "@google/generative-ai"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_KEY_2 = process.env.GEMINI_API_KEY_2
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

// content 

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

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

  const prompt = `
You are generating a JSON course structure for an e-learning platform.

Course Name: ${courseData.name}
Description: ${courseData.description || "Not provided"}
Category: ${courseData.category}
Difficulty Level: ${courseData.difficulty}
Number of Chapters: ${courseData.chapters}
Include Videos: ${courseData.includeVideos ? "Yes" : "No"}

Requirements:
- Provide a complete course structure with:
  1) Course overview with estimated total duration
  2) Prerequisites (if any)
  3) 3-5 learning objectives
  4) Exactly ${courseData.chapters} chapters; each chapter must have:
     - title, description, duration (e.g., "1-2 hours")
     - 3-5 topics
     - 3-4 lessons; each lesson must have title, brief description in "content",
       type ("text"), and duration (e.g., "20-30 minutes").

Constraints:
- IDs must be present and unique. Use "chapter-1", "chapter-2", ... and "lesson-C-L" (e.g., lesson-2-1).
- Respond with ONLY valid JSON. Do not include markdown, code fences, or commentary.
- Ensure all string values are plain strings (no special formatting).

JSON schema to follow exactly:
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
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Strip code fences if present and extract JSON block
    const sanitized = text
      .replace(/^```json\s*([\s\S]*?)\s*```$/i, "$1")
      .replace(/^```\s*([\s\S]*?)\s*```$/i, "$1")
      .trim()

    const jsonMatch = sanitized.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response")
    }

    const raw = JSON.parse(jsonMatch[0]) as Partial<CourseStructure>

    // Normalize and fill defaults
    const normalized: CourseStructure = {
      title: raw.title || courseData.name,
      description: raw.description || (courseData.description || ""),
      estimatedDuration: raw.estimatedDuration || "",
      prerequisites: Array.isArray(raw.prerequisites) ? raw.prerequisites : [],
      learningObjectives: Array.isArray(raw.learningObjectives) ? raw.learningObjectives : [],
      chapters: Array.isArray(raw.chapters) ? raw.chapters as Chapter[] : [],
    }

    normalized.chapters = (normalized.chapters || []).map((ch, ci) => {
      const chapterId = ch.id && ch.id.trim().length > 0 ? ch.id : `chapter-${ci + 1}`
      const lessons = Array.isArray(ch.lessons) ? ch.lessons : []
      const fixedLessons = lessons.map((ls, li) => ({
        id: ls.id && ls.id.trim().length > 0 ? ls.id : `lesson-${ci + 1}-${li + 1}`,
        title: ls.title || `Lesson ${ci + 1}.${li + 1}`,
        content: typeof ls.content === "string" ? ls.content : "",
        type: (ls.type as any) === "video" || (ls.type as any) === "interactive" ? ls.type : "text",
        duration: ls.duration || "20-30 minutes",
        videoUrl: ls.videoUrl,
      }))

      return {
        id: chapterId,
        title: ch.title || `Chapter ${ci + 1}`,
        description: ch.description || "",
        duration: ch.duration || "1-2 hours",
        topics: Array.isArray(ch.topics) ? ch.topics : [],
        lessons: fixedLessons,
        quiz: ch.quiz,
      }
    })

    return normalized
  } catch (error) {
    console.error("Error generating course structure:", error)
    throw new Error("Failed to generate course structure")
  }
}
//lesson content
export async function generateLessonContent(
  lesson: Lesson,
  chapterContext: string,
  courseContext: string,
  difficulty: string,
): Promise<string> {
  let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>
  if (genAI) {
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  } else if (GEMINI_API_KEY_2) {
    const genAI2 = new GoogleGenerativeAI(GEMINI_API_KEY_2)
    model = genAI2.getGenerativeModel({ model: "gemini-2.5-flash" })
  } else {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_2 environment variable.")
  }

  const prompt = `
Generate detailed lesson content for the following lesson:

Course Context: ${courseContext}
Chapter Context: ${chapterContext}
Lesson Title: ${lesson.title}
Lesson Description: ${lesson.content}
Difficulty Level: ${difficulty}
Target Duration: ${lesson.duration}

// content

Create comprehensive lesson content that includes:
0.First this should follow the content of the course structure and genarate the lesson by following that
1. By following the structure topics it should genarate each lesson by following that
2. Learning objectives for this specific lesson
3. Detailed explanation of concepts
3. Practical examples and use cases. Step-by-step instructions where applicable
5. Key takeaways and summary
6. Practice exercises or reflection questions

The content should be:
- Follow the structure of the course and chapter
- Appropriate for ${difficulty} level learners
- Engaging and easy to follow
- Practical with real-world applications
- Well-structured with clear sections

Format the content in markdown with proper headings, bullet points, and code blocks where appropriate.
`
// content

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating lesson content:", error)
    throw new Error("Failed to generate lesson content")
  }
}

export async function generateChapterContent(
  chapter: Chapter,
  course: CourseStructure,
  difficulty: string,
): Promise<string> {
  let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>
  if (genAI) {
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
  } else if (GEMINI_API_KEY_2) {
    const genAI2 = new GoogleGenerativeAI(GEMINI_API_KEY_2)
    model = genAI2.getGenerativeModel({ model: "gemini-2.5-flash" })
  } else {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_2 environment variable.")
  }

  const prompt = `
You are generating content for a learning platform.

Instructions:
- Create a complete, self-contained chapter document in markdown for the chapter that will be open here http://localhost:3000/courses/course-id/watch/chapter-id.
- The chapter should be structured with appropriate headings and paragraphs for each major section.
- The content should be only those part who will be mentioned in the course structure
- The content must be distinct from other chapters and tailored specifically to this chapter's topics and lessons.
- Use clear hierarchy, professional tone, and concise explanations.
- Include a Table of Contents that links to each major section.
- Provide detailed context for each section (what, why, how, examples, pitfalls, best practices).

Course Context:
Title: ${course.title}
Description: ${course.description}
Estimated Duration: ${course.estimatedDuration}
Prerequisites: ${course.prerequisites.join(", ")}
Learning Objectives: ${course.learningObjectives.join(", ")}
Overall Difficulty: ${difficulty}

Chapter Context:
ID: ${chapter.id}
Title: ${chapter.title}
Description: ${chapter.description}
Estimated Duration: ${chapter.duration}
Topics: ${chapter.topics.join(", ")}
Lessons:
${chapter.lessons
  .map(
    (l, idx) => `- ${idx + 1}. ${l.title} (${l.duration}) — ${l.content} [type: ${l.type}]`,
  )
  .join("\n")}

Required Markdown Structure:
1. # ${chapter.title}
2. ## Overview
   - Purpose of the chapter, who it's for, how it fits into the course
3. ## Table of Contents
   - Use a list of markdown links to sections (e.g., [Section](#section))
4. ## Learning Objectives
   - 4-7 concrete objectives tailored to this chapter
5. ## Background and Context
   - Why the topics matter, prerequisites recap, mental models
6. ## Core Concepts
   - Subsections per key topic with definitions, intuition, formal details where appropriate
7. ## Guided Walkthrough
   - Step-by-step instructions or flows; call out decisions and alternatives
8. ## Practical Examples
   - 2-4 realistic examples; include code blocks if relevant to the course domain
9. ## Lesson-by-Lesson Deep Dive
   - A subsection for each lesson below, expanding its description into detailed content
   - Include inputs/outputs, checklists, and tips
10. ## Common Pitfalls and Troubleshooting
    - Misconceptions, edge cases, how to debug
11. ## Best Practices and Patterns
12. ## Summary and Key Takeaways
13. ## Further Reading and Resources
    - Curate 5-8 reputable resources (books, docs, articles). Do not invent URLs.

Constraints:
- Write for ${difficulty} learners.
- Avoid repeating verbatim content across sections; ensure each section adds new value.
- Keep the document cohesive and internally consistent with the course context.

Output strictly as Markdown only, no surrounding comments.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("Error generating chapter content:", error)
    throw new Error("Failed to generate chapter content")
  }
}

// Generate complete course content mapped by chapter IDs
export async function generateCompleteCourseContentByChapter(
  course: CourseStructure,
  difficulty: string,
): Promise<Record<string, string>> {
  if (!genAI && !GEMINI_API_KEY_2) {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY or GEMINI_API_KEY_2 environment variable.")
  }

  const chapterIdToContent: Record<string, string> = {}

  // Sequential to respect potential model rate limits; can be parallelized by caller if desired
  for (const chapter of course.chapters) {
    const chapterMarkdown = await generateChapterContent(chapter, course, difficulty)
    chapterIdToContent[chapter.id] = chapterMarkdown
  }

  return chapterIdToContent
}


export async function generateQuiz(chapterTitle: string, chapterTopics: string[], difficulty: string): Promise<Quiz> {
  if (!genAI) {
    throw new Error("Gemini AI is not configured. Please set GEMINI_API_KEY environment variable.")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })

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

// Generate a complete, structured chapter document with TOC and detailed sections