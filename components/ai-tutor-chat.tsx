"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Brain, Send, Loader2, User, Sparkles, HelpCircle, X } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  context?: string
}

interface AiTutorChatProps {
  courseTitle?: string
  currentLesson?: string
  onClose?: () => void
  className?: string
}

export function AiTutorChat({ courseTitle, currentLesson, onClose, className }: AiTutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: courseTitle
        ? `Hi! I'm your AI tutor for "${courseTitle}". I'm here to help you understand the concepts in "${currentLesson}". What would you like to know?`
        : "Hello! I'm your AI tutor. I can help explain concepts, answer questions, and provide additional practice problems. How can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const suggestedQuestions = [
    "Can you explain this concept in simpler terms?",
    "What are some real-world applications?",
    "Can you give me a practice problem?",
    "What should I study next?",
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response (in real implementation, this would call the Gemini API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateMockResponse(userMessage.content, { courseTitle, currentLesson }),
        timestamp: new Date(),
        context: currentLesson,
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Tutor
            <Badge variant="secondary">
              <Sparkles className="h-3 w-3 mr-1" />
              Online
            </Badge>
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <CardDescription>
          {courseTitle ? `Get help with "${currentLesson}"` : "Ask questions and get personalized explanations"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-80 w-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary/10">
                      <Brain className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div className={`max-w-[80%] ${message.role === "user" ? "order-first" : ""}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-sm ${
                      message.role === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg px-3 py-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7 bg-transparent"
                  onClick={() => handleSuggestedQuestion(question)}
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!input.trim() || isLoading} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function generateMockResponse(userInput: string, courseContext?: any): string {
  const responses = [
    "That's a great question! Let me break this down for you step by step...",
    "I can help explain that concept. Here's a simple way to think about it...",
    "Excellent question! This is actually a fundamental concept that many students find challenging...",
    "Let me provide you with a practical example to illustrate this concept...",
    "That's an important topic! Here's how I would approach understanding this...",
  ]

  const randomResponse = responses[Math.floor(Math.random() * responses.length)]

  if (courseContext?.currentLesson) {
    return `${randomResponse} In the context of "${courseContext.currentLesson}", this relates to the key concepts we're covering. Would you like me to provide a specific example or practice problem?`
  }

  return `${randomResponse} Is there a particular aspect you'd like me to focus on, or would you like me to provide some practice exercises?`
}
