"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle, Target, Zap, Clock, Gift } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  type: "daily" | "weekly"
  target: number
  current: number
  reward: {
    xp: number
    bonus?: string
  }
  completed: boolean
  expiresAt: Date
}

export function DailyChallenges() {
  const [challenges] = useState<Challenge[]>([
    {
      id: "daily_lessons",
      title: "Daily Learner",
      description: "Complete 3 lessons today",
      type: "daily",
      target: 3,
      current: 1,
      reward: { xp: 150, bonus: "Streak multiplier" },
      completed: false,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
    },
    {
      id: "quiz_streak",
      title: "Quiz Master",
      description: "Score 80%+ on 2 quizzes",
      type: "daily",
      target: 2,
      current: 0,
      reward: { xp: 200 },
      completed: false,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
    {
      id: "ai_tutor_chat",
      title: "AI Curious",
      description: "Ask the AI tutor 5 questions",
      type: "daily",
      target: 5,
      current: 2,
      reward: { xp: 100, bonus: "Knowledge boost" },
      completed: false,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
    {
      id: "weekly_course",
      title: "Course Conqueror",
      description: "Complete an entire course this week",
      type: "weekly",
      target: 1,
      current: 0,
      reward: { xp: 500, bonus: "Premium badge" },
      completed: false,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    },
    {
      id: "create_course",
      title: "Content Creator",
      description: "Generate a new AI course",
      type: "daily",
      target: 1,
      current: 1,
      reward: { xp: 300 },
      completed: true,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    },
  ])

  const formatTimeRemaining = (expiresAt: Date) => {
    const now = new Date()
    const diff = expiresAt.getTime() - now.getTime()

    if (diff <= 0) return "Expired"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m left`
    }
    return `${minutes}m left`
  }

  const dailyChallenges = challenges.filter((c) => c.type === "daily")
  const weeklyChallenges = challenges.filter((c) => c.type === "weekly")

  return (
    <div className="space-y-6">
      {/* Daily Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Daily Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-colors ${
                challenge.completed
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {challenge.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1">
                    <Zap className="h-3 w-3 mr-1" />
                    {challenge.reward.xp} XP
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(challenge.expiresAt)}
                  </div>
                </div>
              </div>

              {!challenge.completed && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {challenge.current} / {challenge.target}
                    </span>
                  </div>
                  <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
                </div>
              )}

              {challenge.reward.bonus && (
                <div className="mt-3 p-2 bg-primary/10 rounded border border-primary/20">
                  <div className="flex items-center gap-2 text-xs">
                    <Gift className="h-3 w-3 text-primary" />
                    <span className="text-primary font-medium">Bonus: {challenge.reward.bonus}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Weekly Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Weekly Challenges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {weeklyChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`p-4 rounded-lg border transition-colors ${
                challenge.completed
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-card hover:bg-muted/50"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {challenge.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="font-medium">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-xs mb-1 bg-accent/10 border-accent/30">
                    <Zap className="h-3 w-3 mr-1" />
                    {challenge.reward.xp} XP
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeRemaining(challenge.expiresAt)}
                  </div>
                </div>
              </div>

              {!challenge.completed && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {challenge.current} / {challenge.target}
                    </span>
                  </div>
                  <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
                </div>
              )}

              {challenge.reward.bonus && (
                <div className="mt-3 p-2 bg-accent/10 rounded border border-accent/20">
                  <div className="flex items-center gap-2 text-xs">
                    <Gift className="h-3 w-3 text-accent" />
                    <span className="text-accent font-medium">Bonus: {challenge.reward.bonus}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
