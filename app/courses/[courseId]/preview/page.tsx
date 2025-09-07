"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import type { Chapter } from "@/lib/types"

export default function PreviewCoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${courseId}/chapters`)
      const data = await res.json()
      if (data.success) setChapters(data.data.chapters)
    }
    if (courseId) void load()
  }, [courseId])

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Course Preview</h1>
      <div className="space-y-4">
        {chapters.map((ch, idx) => (
          <Card key={ch.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </span>
                {ch.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> ~{ch.lessons.reduce((a, b) => a + (b.duration || 0), 0)} mins
                </span>
                <Badge variant="outline">{ch.completed ? "Completed" : "Pending"}</Badge>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                {ch.lessons.map((ls) => (
                  <li key={ls.id}>{ls.title}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
