"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Clock, Users, Star, Search, Filter, Plus } from "lucide-react"
import Link from "next/link"

const mockCourses = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    description: "Learn the basics of machine learning with hands-on projects and real-world applications.",
    category: "Technology",
    difficulty: "Beginner",
    duration: "8 weeks",
    students: 1234,
    rating: 4.8,
    image: "/machine-learning-course-banner.png",
    progress: 65,
    enrolled: true,
  },
  {
    id: "2",
    title: "React Advanced Patterns",
    description: "Master advanced React patterns, hooks, and performance optimization techniques.",
    category: "Technology",
    difficulty: "Advanced",
    duration: "6 weeks",
    students: 892,
    rating: 4.9,
    image: "/react-patterns-course.png",
    progress: 0,
    enrolled: false,
  },
  {
    id: "3",
    title: "Data Science with Python",
    description: "Complete data science course covering pandas, numpy, matplotlib, and machine learning.",
    category: "Data Science",
    difficulty: "Intermediate",
    duration: "12 weeks",
    students: 2156,
    rating: 4.7,
    image: "/python-data-science-course.png",
    progress: 30,
    enrolled: true,
  },
  {
    id: "4",
    title: "UI/UX Design Principles",
    description: "Learn modern design principles, user research, and prototyping with industry tools.",
    category: "Design",
    difficulty: "Beginner",
    duration: "10 weeks",
    students: 756,
    rating: 4.6,
    image: "/ui-ux-design-course.png",
    progress: 0,
    enrolled: false,
  },
]

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || course.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Courses</h1>
            <p className="text-muted-foreground">
              Discover and enroll in AI-generated courses tailored to your learning goals
            </p>
          </div>
          <Button asChild className="mt-4 md:mt-0">
            <Link href="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Course
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3" variant="secondary">
                  {course.difficulty}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Badge variant="outline" className="mb-2">
                    {course.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{course.rating}</span>
                  </div>
                </div>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <CardDescription className="line-clamp-3">{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {course.students.toLocaleString()}
                  </div>
                </div>

                {course.enrolled && course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {course.enrolled ? (
                    <Button asChild className="flex-1">
                      <Link href={`/course/${course.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild className="flex-1">
                        <Link href={`/course/${course.id}`}>Enroll Now</Link>
                      </Button>
                      <Button variant="outline" size="icon">
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria or create a new course</p>
            <Button asChild>
              <Link href="/create">Create New Course</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
