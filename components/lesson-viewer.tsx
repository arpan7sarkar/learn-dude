"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Circle,
  Play,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Trophy,
} from "lucide-react"
import { AiTutorChat } from "@/components/ai-tutor-chat"
import { XPNotification } from "@/components/xp-notification"
import { AchievementNotification } from "@/components/achievement-notification"
import { XP_REWARDS, awardXP } from "@/lib/xp-system"
import { checkAchievements, ACHIEVEMENTS } from "@/lib/achievements"

interface Lesson {
  id: string
  title: string
  content: string
  duration: number
  videoUrl?: string
  completed: boolean
  type: "lesson" | "quiz" | "assignment"
}

interface Chapter {
  id: string
  title: string
  lessons: Lesson[]
  completed: boolean
}

interface Course {
  id: string
  title: string
  description: string
  chapters: Chapter[]
  totalProgress: number
}

interface LessonViewerProps {
  courseId: string
}

export function LessonViewer({ courseId }: LessonViewerProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [showAiTutor, setShowAiTutor] = useState(false)
  const [loading, setLoading] = useState(true)
  const [xpNotification, setXpNotification] = useState<any>(null)
  const [achievementNotification, setAchievementNotification] = useState<any>(null)

  // Mock course data - in real app, fetch from API
  useEffect(() => {
    const mockCourse: Course = {
      id: courseId,
      title: "Machine Learning Fundamentals",
      description: "Complete guide to machine learning concepts and applications",
      totalProgress: 45,
      chapters: [
        {
          id: "ch1",
          title: "Introduction to Machine Learning",
          completed: true,
          lessons: [
            {
              id: "l1",
              title: "What is Machine Learning?",
              content: `# What is Machine Learning?

Machine Learning (ML) is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.

## Key Concepts:

### 1. **Types of Machine Learning**
- **Supervised Learning**: Learning with labeled examples
- **Unsupervised Learning**: Finding patterns in unlabeled data  
- **Reinforcement Learning**: Learning through trial and error

### 2. **Common Applications**
- Image recognition and computer vision
- Natural language processing
- Recommendation systems
- Predictive analytics
- Autonomous vehicles

### 3. **The Learning Process**
1. **Data Collection**: Gather relevant datasets
2. **Data Preprocessing**: Clean and prepare data
3. **Model Selection**: Choose appropriate algorithms
4. **Training**: Feed data to the model
5. **Evaluation**: Test model performance
6. **Deployment**: Use model in production

Machine learning has revolutionized industries by enabling computers to identify patterns, make predictions, and automate complex decision-making processes that would be impossible to program manually.`,
              duration: 15,
              videoUrl: "dQw4w9WgXcQ",
              completed: true,
              type: "lesson",
            },
            {
              id: "l2",
              title: "Types of Learning Algorithms",
              content: `# Types of Learning Algorithms

Understanding different types of machine learning algorithms is crucial for selecting the right approach for your problem.

## Supervised Learning Algorithms

### Linear Regression
- Predicts continuous values
- Simple and interpretable
- Good baseline model

### Decision Trees
- Easy to understand and visualize
- Handles both numerical and categorical data
- Can overfit with complex trees

### Random Forest
- Ensemble of decision trees
- Reduces overfitting
- Provides feature importance

## Unsupervised Learning Algorithms

### K-Means Clustering
- Groups similar data points
- Requires specifying number of clusters
- Good for customer segmentation

### Principal Component Analysis (PCA)
- Reduces dimensionality
- Preserves most important information
- Useful for visualization

## Deep Learning
- Neural networks with multiple layers
- Excellent for complex patterns
- Requires large amounts of data`,
              duration: 20,
              videoUrl: "dQw4w9WgXcQ",
              completed: true,
              type: "lesson",
            },
          ],
        },
        {
          id: "ch2",
          title: "Data Preprocessing",
          completed: false,
          lessons: [
            {
              id: "l3",
              title: "Data Cleaning Techniques",
              content: `# Data Cleaning Techniques

Clean data is essential for building effective machine learning models. Poor quality data leads to poor model performance.

## Common Data Quality Issues

### 1. **Missing Values**
- **Detection**: Use \`df.isnull().sum()\` in pandas
- **Solutions**:
  - Remove rows/columns with missing data
  - Fill with mean, median, or mode
  - Use interpolation for time series
  - Predictive imputation

### 2. **Duplicate Records**
- **Detection**: \`df.duplicated().sum()\`
- **Solution**: \`df.drop_duplicates()\`

### 3. **Outliers**
- **Detection**: 
  - Statistical methods (Z-score, IQR)
  - Visualization (box plots, scatter plots)
- **Treatment**:
  - Remove if data entry errors
  - Transform using log/sqrt
  - Cap at percentile values

### 4. **Inconsistent Formatting**
- Standardize text case
- Remove extra whitespace
- Consistent date formats
- Uniform categorical values

## Best Practices
1. Always backup original data
2. Document all cleaning steps
3. Validate cleaning results
4. Consider domain expertise`,
              duration: 25,
              videoUrl: "dQw4w9WgXcQ",
              completed: false,
              type: "lesson",
            },
            {
              id: "l4",
              title: "Feature Engineering Quiz",
              content: `# Feature Engineering Quiz

Test your understanding of feature engineering concepts.

## Question 1
What is the primary goal of feature engineering?

A) To increase the size of the dataset
B) To create new features that better represent the problem
C) To remove all categorical variables
D) To normalize all numerical features

## Question 2
Which technique is used to handle categorical variables?

A) Standardization
B) One-hot encoding
C) Principal Component Analysis
D) Cross-validation

## Question 3
What does feature scaling accomplish?

A) Reduces the number of features
B) Ensures all features have similar ranges
C) Removes outliers from the data
D) Creates new synthetic features

*Answers: 1-B, 2-B, 3-B*`,
              duration: 10,
              completed: false,
              type: "quiz",
            },
          ],
        },
        {
          id: "ch3",
          title: "Model Training & Evaluation",
          completed: false,
          lessons: [
            {
              id: "l5",
              title: "Training Your First Model",
              content: `# Training Your First Model

Let's walk through the process of training a machine learning model step by step.

## Step 1: Import Libraries
\`\`\`python
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
\`\`\`

## Step 2: Load and Explore Data
\`\`\`python
# Load dataset
df = pd.read_csv('housing_data.csv')

# Explore the data
print(df.head())
print(df.info())
print(df.describe())
\`\`\`

## Step 3: Prepare Features and Target
\`\`\`python
# Define features and target
X = df[['bedrooms', 'bathrooms', 'sqft_living', 'sqft_lot']]
y = df['price']

# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
\`\`\`

## Step 4: Train the Model
\`\`\`python
# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)
\`\`\`

## Step 5: Make Predictions and Evaluate
\`\`\`python
# Make predictions
y_pred = model.predict(X_test)

# Evaluate performance
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'MSE: {mse}')
print(f'R²: {r2}')
\`\`\``,
              duration: 30,
              videoUrl: "dQw4w9WgXcQ",
              completed: false,
              type: "lesson",
            },
          ],
        },
      ],
    }

    setCourse(mockCourse)
    setLoading(false)
  }, [courseId])

  const currentLessonData = course?.chapters[currentChapter]?.lessons[currentLesson]

  const markLessonComplete = () => {
    if (!course) return

    const updatedCourse = { ...course }
    updatedCourse.chapters[currentChapter].lessons[currentLesson].completed = true

    // Check if chapter is complete
    const chapterLessons = updatedCourse.chapters[currentChapter].lessons
    const allComplete = chapterLessons.every((lesson) => lesson.completed)
    if (allComplete) {
      updatedCourse.chapters[currentChapter].completed = true
    }

    setCourse(updatedCourse)

    const currentXP = 2450 // This would come from user context in real app
    const reward = XP_REWARDS.LESSON_COMPLETE
    const xpResult = awardXP(currentXP, reward)

    setXpNotification({
      reward,
      newXP: xpResult.newXP,
      levelUp: xpResult.levelUp,
      newLevel: xpResult.newLevel,
    })

    const userStats = {
      lessonsCompleted: 25, // Mock data - would come from user context
      currentStreak: 7,
      perfectQuizzes: 3,
      lessonsToday: 2,
      coursesCreated: 1,
      diverseLessons: 15,
      aiInteractions: 12,
    }

    const newAchievements = checkAchievements(userStats, ACHIEVEMENTS)
    if (newAchievements.length > 0) {
      setAchievementNotification(newAchievements[0])
    }
  }

  const navigateLesson = (direction: "prev" | "next") => {
    if (!course) return

    if (direction === "next") {
      const nextLessonIndex = currentLesson + 1
      if (nextLessonIndex < course.chapters[currentChapter].lessons.length) {
        setCurrentLesson(nextLessonIndex)
      } else if (currentChapter + 1 < course.chapters.length) {
        setCurrentChapter(currentChapter + 1)
        setCurrentLesson(0)
      }
    } else {
      const prevLessonIndex = currentLesson - 1
      if (prevLessonIndex >= 0) {
        setCurrentLesson(prevLessonIndex)
      } else if (currentChapter > 0) {
        setCurrentChapter(currentChapter - 1)
        setCurrentLesson(course.chapters[currentChapter - 1].lessons.length - 1)
      }
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-96">Loading course...</div>
  }

  if (!course) {
    return <div className="flex items-center justify-center h-96">Course not found</div>
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Chapter Navigation */}
      <div className="w-80 border-r bg-card">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-foreground">{course.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{course.totalProgress}%</span>
            </div>
            <Progress value={course.totalProgress} className="h-2" />
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="p-4 space-y-4">
            {course.chapters.map((chapter, chapterIndex) => (
              <Card
                key={chapter.id}
                className={`cursor-pointer transition-colors ${
                  chapterIndex === currentChapter ? "ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      {chapter.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      {chapter.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          chapterIndex === currentChapter && lessonIndex === currentLesson
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => {
                          setCurrentChapter(chapterIndex)
                          setCurrentLesson(lessonIndex)
                        }}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {lesson.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}m
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{currentLessonData?.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <Badge variant="outline">{currentLessonData?.type}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentLessonData?.duration} minutes
                </span>
                {currentLessonData?.completed && (
                  <Badge variant="default" className="bg-green-500">
                    <Trophy className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAiTutor(!showAiTutor)}>
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Tutor
              </Button>
              {!currentLessonData?.completed && (
                <Button onClick={markLessonComplete}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="mx-6 mt-4">
              <TabsTrigger value="content">
                <BookOpen className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              {currentLessonData?.videoUrl && (
                <TabsTrigger value="video">
                  <Play className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="content" className="flex-1 mx-6 mb-6">
              <ScrollArea className="h-full">
                <Card>
                  <CardContent className="p-6">
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: currentLessonData?.content.replace(/\n/g, "<br>") || "",
                      }}
                    />
                  </CardContent>
                </Card>
              </ScrollArea>
            </TabsContent>

            {currentLessonData?.videoUrl && (
              <TabsContent value="video" className="flex-1 mx-6 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${currentLessonData.videoUrl}`}
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Navigation Footer */}
        <div className="border-t bg-card p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => navigateLesson("prev")}
              disabled={currentChapter === 0 && currentLesson === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="text-sm text-muted-foreground">
              Chapter {currentChapter + 1} of {course.chapters.length} • Lesson {currentLesson + 1} of{" "}
              {course.chapters[currentChapter].lessons.length}
            </div>

            <Button
              onClick={() => navigateLesson("next")}
              disabled={
                currentChapter === course.chapters.length - 1 &&
                currentLesson === course.chapters[currentChapter].lessons.length - 1
              }
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* AI Tutor Sidebar */}
      {showAiTutor && (
        <div className="w-96 border-l bg-card">
          <AiTutorChat
            courseTitle={course.title}
            currentLesson={currentLessonData?.title || ""}
            onClose={() => setShowAiTutor(false)}
          />
        </div>
      )}

      {/* XP and Achievement Notifications */}
      {xpNotification && <XPNotification {...xpNotification} onClose={() => setXpNotification(null)} />}

      {achievementNotification && (
        <AchievementNotification
          achievement={achievementNotification}
          onClose={() => setAchievementNotification(null)}
        />
      )}
    </div>
  )
}
