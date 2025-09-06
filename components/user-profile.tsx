"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Zap, Flame, Star, User, CreditCard, Target, Award } from "lucide-react"
import { calculateLevel, LEVEL_SYSTEM } from "@/lib/xp-system"
import { ACHIEVEMENTS } from "@/lib/achievements"

export function UserProfile() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/diverse-user-avatars.png",
    xp: 2450,
    streak: 7,
    totalCourses: 15,
    completedCourses: 8,
    lessonsCompleted: 45,
    perfectQuizzes: 8,
    coursesCreated: 3,
    aiInteractions: 28,
    joinedDate: "2024-01-15",
    lastActive: "2024-12-09",
  })

  const levelInfo = calculateLevel(user.xp)
  const nextLevel = LEVEL_SYSTEM.find((l) => l.level === levelInfo.level + 1)
  const xpProgress = nextLevel
    ? ((user.xp - LEVEL_SYSTEM.find((l) => l.level === levelInfo.level)!.xpRequired) /
        (nextLevel.xpRequired - LEVEL_SYSTEM.find((l) => l.level === levelInfo.level)!.xpRequired)) *
      100
    : 100

  const userAchievements = ACHIEVEMENTS.map((achievement) => ({
    ...achievement,
    unlocked: Math.random() > 0.4,
    unlockedAt: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
  }))

  const unlockedAchievements = userAchievements.filter((a) => a.unlocked)
  const lockedAchievements = userAchievements.filter((a) => !a.unlocked)

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-lg">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">{user.email}</p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-chart-5" />
                  <span className="text-sm font-medium">
                    Level {levelInfo.level} - {levelInfo.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{user.xp.toLocaleString()} XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-medium">{user.streak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">{unlockedAchievements.length} achievements</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-48">
              <div className="text-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {nextLevel ? `Progress to Level ${levelInfo.level + 1}` : "Max Level Reached"}
                </span>
              </div>
              <Progress value={xpProgress} className="h-2" />
              <div className="text-xs text-muted-foreground mt-1 text-center">
                {nextLevel ? `${user.xp} / ${nextLevel.xpRequired} XP` : `${user.xp} XP (Max Level)`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Lessons Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.lessonsCompleted}</div>
                <p className="text-xs text-muted-foreground">Total lessons finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Perfect Quizzes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.perfectQuizzes}</div>
                <p className="text-xs text-muted-foreground">100% quiz scores</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="h-4 w-4 text-chart-5" />
                  Courses Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.coursesCreated}</div>
                <p className="text-xs text-muted-foreground">AI courses generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4 text-destructive" />
                  Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user.streak}</div>
                <p className="text-xs text-muted-foreground">Days learning</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-chart-5" />
                Level {levelInfo.level} Benefits
              </CardTitle>
              <CardDescription>Your current level unlocks these features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {LEVEL_SYSTEM.find((l) => l.level === levelInfo.level)?.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              {nextLevel && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-dashed">
                  <h4 className="font-medium text-sm mb-2">
                    Next Level ({nextLevel.level}) - {nextLevel.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Unlock at {nextLevel.xpRequired.toLocaleString()} XP (
                    {(nextLevel.xpRequired - user.xp).toLocaleString()} XP to go)
                  </p>
                  <div className="space-y-1">
                    {nextLevel.benefits.slice(0, 2).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid gap-6">
            {/* Unlocked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Unlocked Achievements ({unlockedAchievements.length})
                </CardTitle>
                <CardDescription>Badges you've earned through your learning journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unlockedAchievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {achievement.rarity}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.reward.xp} XP
                            </Badge>
                          </div>
                          {achievement.unlockedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Earned {achievement.unlockedAt.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Locked Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-muted-foreground" />
                  Locked Achievements ({lockedAchievements.length})
                </CardTitle>
                <CardDescription>Achievements waiting to be unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lockedAchievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 rounded-lg border bg-muted/20 border-muted opacity-60">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl grayscale">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{achievement.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {achievement.rarity}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              +{achievement.reward.xp} XP
                            </Badge>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              Progress: {achievement.condition.current || 0} / {achievement.condition.target}
                            </p>
                            <Progress
                              value={((achievement.condition.current || 0) / achievement.condition.target) * 100}
                              className="h-1 mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Alex" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Johnson" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="alex@example.com" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Subscription & Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Free Plan</h3>
                      <p className="text-sm text-muted-foreground">1 course creation limit</p>
                    </div>
                    <Badge variant="outline">Current Plan</Badge>
                  </div>
                </div>
                <Button className="w-full">Upgrade to Premium</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
