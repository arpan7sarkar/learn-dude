"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Clock, CheckCircle2, Circle, Eye, Edit3, Play, Rocket } from "lucide-react"
import type { Chapter } from "@/lib/types"

export default function CourseManagementPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const res = await fetch(`/api/courses/${courseId}/chapters`)
      const data = await res.json()
      if (data.success) setChapters(data.data.chapters)
      setLoading(false)
    }
    if (courseId) void load()
  }, [courseId])

  const onPublish = async () => {
    const res = await fetch(`/api/courses/${courseId}/publish`, { method: "POST" })
    const data = await res.json()
    if (data.success) setStatus("published")
  }

  const onTestPath = async () => {
    await fetch(`/api/courses/${courseId}/test-path`)
    alert("Learning path looks good!")
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Course Dashboard</h1>
          <p className="text-muted-foreground">Manage your course, content, and publishing</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={status === "published" ? "default" : "secondary"}>
            {status === "published" ? "Published" : "Draft"}
          </Badge>
          <Button onClick={onPublish} className="flex items-center gap-2">
            <Rocket className="h-4 w-4" /> Publish
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Chapter Overview
              </CardTitle>
              <CardDescription>AI-generated course structure with detailed topics for each chapter</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => router.push(`/courses/${courseId}/watch/${ch.id}`)}
                    role="button"
                    aria-label={`Open ${ch.title}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">{ch.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> ~{ch.lessons.reduce((a, b) => a + (b.duration || 0), 0)} mins
                            </span>
                            <span className="flex items-center gap-1">
                              {ch.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              {ch.completed ? "Completed" : "Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/courses/${courseId}/watch/${ch.id}`} className="flex items-center gap-1">
                            <Play className="h-4 w-4" /> Watch
                          </Link>
                        </Button>
                      </div>
                    </div>
                    {ch.topics && (
                      <div className="ml-11 flex flex-wrap gap-2">
                        {ch.topics.map((t, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href={`/courses/${courseId}/preview`} className="flex items-center gap-2">
                  <Eye className="h-4 w-4" /> Preview
                </Link>
              </Button>
              <Button variant="outline" onClick={onTestPath} className="w-full justify-start bg-transparent">
                <Play className="h-4 w-4 mr-2" /> Test Learning Path
              </Button>
              <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                <Link href={`/courses/${courseId}/edit`} className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" /> Edit Info
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Buttons are wired to API routes with mock responses.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
