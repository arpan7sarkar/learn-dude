export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "learning" | "social" | "creation" | "milestone"
  rarity: "common" | "rare" | "epic" | "legendary"
  condition: {
    type: string
    target: number
    current?: number
  }
  reward: {
    xp: number
    badge?: string
  }
  unlocked: boolean
  unlockedAt?: Date
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_lesson",
    name: "First Steps",
    description: "Complete your first lesson",
    icon: "🎯",
    category: "learning",
    rarity: "common",
    condition: { type: "lessons_completed", target: 1 },
    reward: { xp: 50 },
    unlocked: false,
  },
  {
    id: "week_streak",
    name: "Consistent Learner",
    description: "Maintain a 7-day learning streak",
    icon: "🔥",
    category: "learning",
    rarity: "rare",
    condition: { type: "streak_days", target: 7 },
    reward: { xp: 200, badge: "streak_master" },
    unlocked: false,
  },
  {
    id: "quiz_master",
    name: "Quiz Master",
    description: "Score 100% on 10 quizzes",
    icon: "🧠",
    category: "learning",
    rarity: "epic",
    condition: { type: "perfect_quizzes", target: 10 },
    reward: { xp: 500, badge: "quiz_genius" },
    unlocked: false,
  },
  {
    id: "speed_learner",
    name: "Speed Learner",
    description: "Complete 5 lessons in one day",
    icon: "⚡",
    category: "learning",
    rarity: "rare",
    condition: { type: "lessons_per_day", target: 5 },
    reward: { xp: 300 },
    unlocked: false,
  },
  {
    id: "course_creator",
    name: "Course Creator",
    description: "Create your first AI-generated course",
    icon: "🎓",
    category: "creation",
    rarity: "common",
    condition: { type: "courses_created", target: 1 },
    reward: { xp: 300 },
    unlocked: false,
  },
  {
    id: "knowledge_seeker",
    name: "Knowledge Seeker",
    description: "Complete 25 lessons across different topics",
    icon: "📚",
    category: "learning",
    rarity: "epic",
    condition: { type: "diverse_lessons", target: 25 },
    reward: { xp: 750, badge: "knowledge_master" },
    unlocked: false,
  },
  {
    id: "month_streak",
    name: "Dedication Master",
    description: "Maintain a 30-day learning streak",
    icon: "💎",
    category: "milestone",
    rarity: "legendary",
    condition: { type: "streak_days", target: 30 },
    reward: { xp: 1000, badge: "dedication_legend" },
    unlocked: false,
  },
  {
    id: "ai_enthusiast",
    name: "AI Enthusiast",
    description: "Use AI tutor 50 times",
    icon: "🤖",
    category: "social",
    rarity: "rare",
    condition: { type: "ai_interactions", target: 50 },
    reward: { xp: 400 },
    unlocked: false,
  },
]

export function checkAchievements(userStats: any, achievements: Achievement[]): Achievement[] {
  return achievements.filter((achievement) => {
    if (achievement.unlocked) return false

    const { type, target } = achievement.condition
    let current = 0

    switch (type) {
      case "lessons_completed":
        current = userStats.lessonsCompleted || 0
        break
      case "streak_days":
        current = userStats.currentStreak || 0
        break
      case "perfect_quizzes":
        current = userStats.perfectQuizzes || 0
        break
      case "lessons_per_day":
        current = userStats.lessonsToday || 0
        break
      case "courses_created":
        current = userStats.coursesCreated || 0
        break
      case "diverse_lessons":
        current = userStats.diverseLessons || 0
        break
      case "ai_interactions":
        current = userStats.aiInteractions || 0
        break
    }

    return current >= target
  })
}
