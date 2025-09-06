import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, BookOpen, Trophy, Zap, Users, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">LearnAI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
              Create
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            Powered by AI
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Learn Anything with
            <span className="text-primary"> AI-Powered</span> Courses
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
            Create custom learning paths, get personalized AI tutoring, and track your progress with gamified learning
            experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Start Learning Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything You Need to Learn</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our AI-powered platform adapts to your learning style and helps you master any subject.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Brain className="h-10 w-10 text-primary mb-2" />
              <CardTitle>AI Course Generation</CardTitle>
              <CardDescription>
                Generate complete courses on any topic with structured lessons, quizzes, and assignments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BookOpen className="h-10 w-10 text-accent mb-2" />
              <CardTitle>Interactive Learning</CardTitle>
              <CardDescription>
                Engage with dynamic content, videos, and hands-on exercises tailored to your pace.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Trophy className="h-10 w-10 text-chart-5 mb-2" />
              <CardTitle>Gamified Progress</CardTitle>
              <CardDescription>
                Earn XP, unlock achievements, and maintain learning streaks to stay motivated.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Target className="h-10 w-10 text-chart-1 mb-2" />
              <CardTitle>Personalized Paths</CardTitle>
              <CardDescription>AI adapts your learning journey based on your progress and preferences.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="h-10 w-10 text-chart-2 mb-2" />
              <CardTitle>AI Tutoring</CardTitle>
              <CardDescription>
                Get instant help and explanations from your personal AI tutor available 24/7.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="h-10 w-10 text-chart-4 mb-2" />
              <CardTitle>Smart Analytics</CardTitle>
              <CardDescription>
                Track your learning patterns and get insights to optimize your study sessions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Learning?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already using AI to master new skills and advance their careers.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/signup">Start Your Journey</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-semibold">LearnAI</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 LearnAI. Empowering learners with AI technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
