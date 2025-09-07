"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Clock, Play } from "lucide-react"
import type { Chapter, Lesson } from "@/lib/types"

export default function WatchChapterPage() {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>()
  const router = useRouter()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentLesson, setCurrentLesson] = useState<number>(0)
  const generatingRef = useRef<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chapterDoc, setChapterDoc] = useState<string>("")
  const [chapterDocLoading, setChapterDocLoading] = useState<boolean>(false)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/courses/${courseId}/chapters?includeVideos=true`)
        if (!res.ok) throw new Error(`Chapters API ${res.status}`)
        const data = await res.json()
        if (!data?.success) throw new Error("Chapters API returned unsuccessful response")
        setChapters(data.data.chapters)
      } catch (err) {
        console.error("Failed to load chapters:", err)
        setError("Failed to load chapters. Ensure GEMINI_API_KEY and YOUTUBE_API_KEY are set.")
      }
      setLoading(false)
    }
    if (courseId) void load()
  }, [courseId])

  const chapterIndex = useMemo(() => {
    const idx = chapters.findIndex((c) => c.id === chapterId)
    return idx >= 0 ? idx : (chapters.length > 0 ? 0 : -1)
  }, [chapters, chapterId])
  const chapter = chapterIndex >= 0 ? chapters[chapterIndex] : undefined
  const lesson: Lesson | undefined = chapter?.lessons[currentLesson]

  // Fetch content for lessons that don't have content yet (on-demand generation)
  useEffect(() => {
    async function ensureContent() {
      if (!chapter) return
      const updated = { ...chapter }
      const needs = updated.lessons
        .map((ls, idx) => ({ ls, idx }))
        .filter(({ ls }) => !ls.content)

      if (needs.length === 0) return

      const results = await Promise.all(
        needs.map(async ({ ls }) => {
          if (generatingRef.current.has(ls.id)) return { id: ls.id, content: undefined as string | undefined }
          generatingRef.current.add(ls.id)
          try {
            const res = await fetch(`/api/courses/${courseId}/generate-content`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lesson: { id: ls.id, title: ls.title, duration: ls.duration },
                chapterTitle: chapter.title,
                courseTitle: `Course ${courseId}`,
                difficulty: "Beginner",
              }),
            })
            if (!res.ok) throw new Error(`generate-content ${res.status}`)
            const data = await res.json()
            return { id: ls.id, content: data?.data?.created?.content as string | undefined }
          } catch (err) {
            console.error("Failed to generate content for", ls.id, err)
            return { id: ls.id, content: undefined }
          } finally {
            generatingRef.current.delete(ls.id)
          }
        }),
      )

      // Merge back into chapters state
      setChapters((prev: Chapter[]) => {
        const copy = prev.map((c) => ({ ...c, lessons: c.lessons.map((l) => ({ ...l })) }))
        const ci = copy.findIndex((c) => c.id === chapter.id)
        if (ci === -1) return prev
        results.forEach((r) => {
          const li = copy[ci].lessons.findIndex((l) => l.id === r.id)
          if (li !== -1) copy[ci].lessons[li].content = r.content || copy[ci].lessons[li].content
        })
        return copy
      })
    }
    void ensureContent()
  }, [chapter?.id, courseId])

  // Fetch full AI-generated chapter document when chapter changes
  useEffect(() => {
    async function loadChapterDoc() {
      if (!chapter) return
      try {
        setChapterDocLoading(true)
        setChapterDoc("")
        const res = await fetch("/api/generate-lesson-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chapter,
            course: {
              title: `Course ${courseId}`,
              description: "",
              estimatedDuration: "",
              prerequisites: [],
              learningObjectives: [],
              chapters: [chapter],
            },
            difficulty: "Beginner",
          }),
        })
        if (!res.ok) throw new Error(`chapter-doc ${res.status}`)
        const data = await res.json()
        const content: string | undefined = data?.content || data?.chapterId ? data?.content : undefined
        // The endpoint returns { success, chapterId, content }
        setChapterDoc(typeof data?.content === "string" ? data.content : "")
      } catch (err) {
        console.error("Failed to load chapter document", err)
      } finally {
        setChapterDocLoading(false)
      }
    }
    void loadChapterDoc()
  }, [chapter?.id, courseId])

  const goNext = () => {
    if (!chapter) return
    if (currentLesson + 1 < chapter.lessons.length) {
      setCurrentLesson((x) => x + 1)
    } else if (chapterIndex + 1 < chapters.length) {
      router.push(`/courses/${courseId}/watch/${chapters[chapterIndex + 1].id}`)
      setCurrentLesson(0)
    }
  }

  const goPrev = () => {
    if (!chapter) return
    if (currentLesson > 0) setCurrentLesson((x) => x - 1)
    else if (chapterIndex > 0) {
      router.push(`/courses/${courseId}/watch/${chapters[chapterIndex - 1].id}`)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>
  if (!chapter) return <div className="p-6">No chapter found.</div>

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-80 border-r bg-card">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Course Content</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-4">
            {chapters.map((ch, i) => (
              <div key={ch.id} className={`border rounded-md ${i === chapterIndex ? "ring-2 ring-primary" : ""}`}>
                <div className="p-3 font-medium flex items-center gap-2">
                  {ch.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Button
                    variant="ghost"
                    className="px-0 h-auto font-medium text-left"
                    onClick={() => router.push(`/courses/${courseId}/watch/${ch.id}`)}
                  >
                    {i + 1}. {ch.title}
                  </Button>
                </div>
                <div className="px-3 pb-3 space-y-1">
                  {ch.lessons.map((ls, li) => (
                    <Button
                      key={ls.id}
                      variant={i === chapterIndex && li === currentLesson ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => {
                        if (i !== chapterIndex) router.push(`/courses/${courseId}/watch/${ch.id}`)
                        setCurrentLesson(li)
                      }}
                    >
                      <Badge variant="outline" className="mr-2 text-2xs">{ls.type}</Badge>
                      <span className="truncate">{ls.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {ls.duration || 0}m
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Chapter header and navigation */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{chapter?.title}</h1>
              <div className="text-sm text-muted-foreground">All parts in this chapter are listed below.</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={goPrev}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous Chapter/Part
              </Button>
              <Button onClick={goNext}>
                Next Chapter/Part <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content area: Table of Contents + All Parts sequentially */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* AI-Generated Chapter Document */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Chapter Content (AI)</h2>
              {chapterDocLoading ? (
                <p className="text-muted-foreground">Generating chapter content...</p>
              ) : chapterDoc ? (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">{chapterDoc}</div>
              ) : (
                <p className="text-muted-foreground">No content yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Table of Contents */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
              <div className="space-y-2">
                {chapter?.lessons.map((ls, i) => (
                  <Button
                    key={ls.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      const el = document.getElementById(`part-${ls.id}`)
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
                      setCurrentLesson(i)
                    }}
                  >
                    <Badge variant="outline" className="mr-2 text-2xs">
                      {ls.type}
                    </Badge>
                    <span className="truncate">{i + 1}. {ls.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {ls.duration || 0}m
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* All Parts Sequentially */}
          <div className="space-y-10">
            {chapter?.lessons.map((ls, i) => (
              <div key={ls.id} id={`part-${ls.id}`}>
                <h3 className="text-lg font-semibold mb-3">Part {i + 1}: {ls.title}</h3>
                {ls.type === "video" && ls.videoId && (
                  <div className="aspect-video mb-4">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${ls.videoId}`}
                      title={`Video for ${ls.title}`}
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  {ls.content ? (
                    <div dangerouslySetInnerHTML={{ __html: ls.content }} />
                  ) : (
                    <p className="text-muted-foreground">Content will appear here once generated.</p>
                  )}
                </div>
                {i < (chapter?.lessons.length || 1) - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
