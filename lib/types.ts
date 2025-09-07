export type LessonType = "lesson" | "quiz" | "assignment" | "video"

export interface Lesson {
  id: string
  title: string
  content?: string
  duration?: number
  videoId?: string
  completed?: boolean
  type: LessonType
}

export interface Chapter {
  id: string
  title: string
  order: number
  lessons: Lesson[]
  completed?: boolean
  topics?: string[]
}

export interface CourseMeta {
  id: string
  name: string
  description: string
  category: string
  difficulty: string
  status?: "draft" | "published"
  thumbnail?: string
}

export interface Course extends CourseMeta {
  chapters: Chapter[]
}

export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
