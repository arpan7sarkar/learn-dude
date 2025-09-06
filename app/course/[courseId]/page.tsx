import { LessonViewer } from "@/components/lesson-viewer"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return <LessonViewer courseId={params.courseId} />
}
