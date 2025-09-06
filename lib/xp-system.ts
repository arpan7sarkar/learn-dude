export interface XPReward {
  action: string
  points: number
  description: string
}

export const XP_REWARDS: Record<string, XPReward> = {
  LESSON_COMPLETE: {
    action: "lesson_complete",
    points: 50,
    description: "Completed a lesson",
  },
  QUIZ_PERFECT: {
    action: "quiz_perfect",
    points: 100,
    description: "Perfect score on quiz",
  },
  QUIZ_PASS: {
    action: "quiz_pass",
    points: 75,
    description: "Passed a quiz",
  },
  COURSE_COMPLETE: {
    action: "course_complete",
    points: 500,
    description: "Completed a course",
  },
  DAILY_LOGIN: {
    action: "daily_login",
    points: 10,
    description: "Daily login bonus",
  },
  STREAK_MILESTONE: {
    action: "streak_milestone",
    points: 200,
    description: "Reached streak milestone",
  },
  FIRST_COURSE_CREATED: {
    action: "first_course_created",
    points: 300,
    description: "Created first course",
  },
}

export interface UserLevel {
  level: number
  title: string
  xpRequired: number
  benefits: string[]
}

export const LEVEL_SYSTEM: UserLevel[] = [
  { level: 1, title: "Beginner", xpRequired: 0, benefits: ["Access to basic courses"] },
  { level: 2, title: "Learner", xpRequired: 100, benefits: ["Course bookmarks"] },
  { level: 3, title: "Student", xpRequired: 300, benefits: ["Progress analytics"] },
  { level: 5, title: "Scholar", xpRequired: 750, benefits: ["Advanced courses", "Priority support"] },
  { level: 8, title: "Expert", xpRequired: 1500, benefits: ["Course creation", "Community access"] },
  { level: 12, title: "Master", xpRequired: 3000, benefits: ["Unlimited courses", "Mentorship program"] },
  { level: 15, title: "Guru", xpRequired: 5000, benefits: ["Beta features", "Custom badges"] },
  { level: 20, title: "Legend", xpRequired: 10000, benefits: ["Lifetime access", "Special recognition"] },
]

export function calculateLevel(xp: number): { level: number; title: string; xpToNext: number; progress: number } {
  let currentLevel = LEVEL_SYSTEM[0]
  let nextLevel = LEVEL_SYSTEM[1]

  for (let i = 0; i < LEVEL_SYSTEM.length - 1; i++) {
    if (xp >= LEVEL_SYSTEM[i].xpRequired && xp < LEVEL_SYSTEM[i + 1].xpRequired) {
      currentLevel = LEVEL_SYSTEM[i]
      nextLevel = LEVEL_SYSTEM[i + 1]
      break
    }
  }

  if (xp >= LEVEL_SYSTEM[LEVEL_SYSTEM.length - 1].xpRequired) {
    currentLevel = LEVEL_SYSTEM[LEVEL_SYSTEM.length - 1]
    nextLevel = currentLevel // Max level reached
  }

  const xpInCurrentLevel = xp - currentLevel.xpRequired
  const xpNeededForNext = nextLevel.xpRequired - currentLevel.xpRequired
  const progress = nextLevel === currentLevel ? 100 : (xpInCurrentLevel / xpNeededForNext) * 100

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    xpToNext: nextLevel.xpRequired,
    progress,
  }
}

export function awardXP(
  currentXP: number,
  reward: XPReward,
): { newXP: number; levelUp: boolean; newLevel?: UserLevel } {
  const newXP = currentXP + reward.points
  const oldLevel = calculateLevel(currentXP)
  const newLevelInfo = calculateLevel(newXP)

  return {
    newXP,
    levelUp: newLevelInfo.level > oldLevel.level,
    newLevel:
      newLevelInfo.level > oldLevel.level ? LEVEL_SYSTEM.find((l) => l.level === newLevelInfo.level) : undefined,
  }
}
