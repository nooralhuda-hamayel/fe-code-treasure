// Define types for our data structures
export interface Level {
  id: number
  name: string
  description: string
  difficulty: string
  totalQuestions: number
  timeLimit: number
  requiredScore: number
}

export interface UserProgress {
  userId: number
  levelId: number
  completed: boolean
  stars: number
  bestTime: number | null
  bestScore: number
  attempts: number
  lastPlayed: string | null
}

// Define base question interface
export interface BaseQuestion {
  id: number
  type: string
  timeLimit?: number
}

// Define more specific types for the question types
export interface TypedGapQuestionType extends BaseQuestion {
  type: "typed-gap"
  question: {
    text: string
    codeSnippet: string
    correctAnswer: string
    explanation?: string
    language: string
  }
}

export interface FillGapQuestionType extends BaseQuestion {
  type: "fill-gap"
  question: {
    text: string
    codeSnippet: string
    options: string[]
    correctAnswer: string
    explanation?: string
    language: string
  }
}

export interface DragDropQuestionType extends BaseQuestion {
  type: "drag-drop"
  question: {
    text: string
    codeBlocks: string[]
    correctOrder: number[]
    explanation?: string
    language: string
  }
}

// Union type for all question types
export type Question = TypedGapQuestionType | FillGapQuestionType | DragDropQuestionType

// Define a type for the answer results
export interface AnswerResult {
  questionId: number
  answer: string | number[] | string[]
  correct: boolean
}

interface QuizResult {
  message: string
  completed: boolean
  stars: number
  score: number
  time: number
}

// Mock data for development/preview mode
const MOCK_LEVELS: Level[] = [
  {
    id: 1,
    name: "Beginner JavaScript",
    description: "Learn the basics of JavaScript syntax and variables",
    difficulty: "easy",
    totalQuestions: 5,
    timeLimit: 30,
    requiredScore: 60,
  },
  {
    id: 2,
    name: "CSS Foundations",
    description: "Master CSS fundamentals and styling techniques",
    difficulty: "easy",
    totalQuestions: 5,
    timeLimit: 30,
    requiredScore: 60,
  },
  {
    id: 3,
    name: "JavaScript Functions",
    description: "Understand how JavaScript functions work",
    difficulty: "medium",
    totalQuestions: 5,
    timeLimit: 40,
    requiredScore: 70,
  },
  {
    id: 4,
    name: "DOM Manipulation",
    description: "Learn to interact with the Document Object Model",
    difficulty: "medium",
    totalQuestions: 5,
    timeLimit: 40,
    requiredScore: 70,
  },
  {
    id: 5,
    name: "ES6 Features",
    description: "Explore modern JavaScript ES6+ features",
    difficulty: "medium",
    totalQuestions: 5,
    timeLimit: 45,
    requiredScore: 70,
  },
]

const MOCK_PROGRESS: UserProgress[] = [
  {
    userId: 1,
    levelId: 1,
    completed: true,
    stars: 3,
    bestTime: 120,
    bestScore: 100,
    attempts: 2,
    lastPlayed: "2023-05-10T15:30:00Z",
  },
  {
    userId: 1,
    levelId: 2,
    completed: false,
    stars: 0,
    bestTime: null,
    bestScore: 0,
    attempts: 1,
    lastPlayed: "2023-05-11T10:15:00Z",
  },
]

const MOCK_QUESTIONS: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      type: "fill-gap",
      timeLimit: 30,
      question: {
        text: "Complete the function to add two numbers:",
        codeSnippet: "function add(a, b) {\n  return a ___ b;\n}",
        options: ["+", "-", "*", "/"],
        correctAnswer: "+",
        explanation: "The addition operator (+) is used to add two values together.",
        language: "javascript",
      },
    },
    {
      id: 2,
      type: "typed-gap",
      timeLimit: 30,
      question: {
        text: "Complete the function to multiply two numbers:",
        codeSnippet: "function multiply(a, b) {\n  return a ___ b;\n}",
        correctAnswer: "*",
        explanation: "The multiplication operator (*) is used to multiply two values.",
        language: "javascript",
      },
    },
    {
      id: 3,
      type: "fill-gap",
      timeLimit: 30,
      question: {
        text: "Choose the correct way to declare a variable in JavaScript:",
        codeSnippet: 'const ___ = "Hello";',
        options: ["greeting", "var", "1name", "class"],
        correctAnswer: "greeting",
        explanation: "Variables need a name (identifier) when you declare them.",
        language: "javascript",
      },
    },
    {
      id: 4,
      type: "drag-drop",
      timeLimit: 45,
      question: {
        text: "Arrange the code to create a valid function that calculates the area of a rectangle:",
        codeBlocks: [
          "function calculateArea(width, height) {",
          "  if (width <= 0 || height <= 0) {",
          '    return "Invalid dimensions";',
          "  }",
          "  const area = width * height;",
          "  return area;",
          "}",
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        language: "javascript",
      },
    },
    {
      id: 5,
      type: "typed-gap",
      timeLimit: 30,
      question: {
        text: "Complete the conditional statement:",
        codeSnippet: 'if (age ___ 18) {\n  console.log("Adult");\n}',
        correctAnswer: ">=",
        explanation: "Use >= to check if a value is greater than or equal to another value.",
        language: "javascript",
      },
    },
  ],
  2: [
    {
      id: 6,
      type: "fill-gap",
      timeLimit: 30,
      question: {
        text: "Complete the CSS property to center an element horizontally:",
        codeSnippet: ".container {\n  margin: 0 ___;\n}",
        options: ["auto", "center", "0", "100%"],
        correctAnswer: "auto",
        explanation: "Setting left and right margins to 'auto' centers an element horizontally.",
        language: "css",
      },
    },
    {
      id: 7,
      type: "typed-gap",
      timeLimit: 30,
      question: {
        text: "Complete the CSS property to make text bold:",
        codeSnippet: ".bold-text {\n  font-weight: ___;\n}",
        correctAnswer: "bold",
        explanation: "The 'bold' value for font-weight makes text bold.",
        language: "css",
      },
    },
    {
      id: 8,
      type: "drag-drop",
      timeLimit: 45,
      question: {
        text: "Arrange the CSS to create a flexbox container with centered items:",
        codeBlocks: [
          ".flex-container {",
          "  display: flex;",
          "  justify-content: center;",
          "  align-items: center;",
          "  height: 100vh;",
          "  width: 100%;",
          "}",
        ],
        correctOrder: [0, 1, 2, 3, 4, 5, 6],
        language: "css",
      },
    },
  ],
}

// Replace the isDevMode function with this more reliable version
function isDevMode(): boolean {
  // Always return true in preview environments to use mock data
  return true
}

// Replace getApiBaseUrl with the actual backend URL
function getApiBaseUrl() {
  return "https://be-code-treasure.onrender.com/api"
}

// Helper function to get the auth token
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// Fetch all levels
export async function fetchLevels(): Promise<Level[]> {
  try {
    if (isDevMode()) {
      console.log("Using mock levels data")
      return MOCK_LEVELS
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${getApiBaseUrl()}/levels`, {
      headers: {
        "Authorization": token
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch levels: ${response.status}`)
    }

    const data = await response.json()
    return data.levels || []
  } catch (error) {
    console.error("Error fetching levels:", error)
    // In case of error, return mock data in development
    if (isDevMode()) {
      return MOCK_LEVELS
    }
    throw error
  }
}

// Fetch user progress
export async function fetchUserProgress(): Promise<UserProgress[]> {
  try {
    if (isDevMode()) {
      console.log("Using mock progress data")
      return MOCK_PROGRESS
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${getApiBaseUrl()}/progress`, {
      headers: {
        "Authorization": token
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch progress: ${response.status}`)
    }

    const data = await response.json()
    return data.progress || []
  } catch (error) {
    console.error("Error fetching user progress:", error)
    // In case of error, return mock data in development
    if (isDevMode()) {
      return MOCK_PROGRESS
    }
    throw error
  }
}

// Fetch quiz questions from the API
export async function fetchQuizQuestions(levelId: number): Promise<Question[]> {
  try {
    if (isDevMode()) {
      console.log("Mock fetchQuizQuestions:", { levelId })
      await new Promise((resolve) => setTimeout(resolve, 800))
      return MOCK_QUESTIONS[levelId] || []
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${getApiBaseUrl()}/levels/${levelId}/questions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch quiz questions")
    }

    const data = await response.json()
    return data.questions || []
  } catch (error) {
    console.error("Error fetching quiz questions:", error)
    throw error
  }
}

// Submit quiz answers to the API
export async function submitQuizAnswers(
  levelId: number,
  answers: AnswerResult[],
  timeElapsed: number,
): Promise<QuizResult> {
  try {
    if (isDevMode()) {
      console.log("Mock submitQuizAnswers:", { levelId, answers, timeElapsed })
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Calculate mock results
      const totalQuestions = answers.length
      const correctAnswers = answers.filter((a) => a.correct).length
      const score = Math.round((correctAnswers / totalQuestions) * 100)
      const level = MOCK_LEVELS.find((l) => l.id === levelId)

      if (!level) {
        throw new Error("Level not found")
      }

      const completed = score >= level.requiredScore
      let stars = 0
      if (score >= 90) stars = 3
      else if (score >= 75) stars = 2
      else if (score >= 60) stars = 1

      // Update mock progress
      const progressIndex = MOCK_PROGRESS.findIndex((p) => p.levelId === levelId)
      if (progressIndex >= 0) {
        const currentProgress = MOCK_PROGRESS[progressIndex]
        MOCK_PROGRESS[progressIndex] = {
          ...currentProgress,
          completed: completed || currentProgress.completed,
          stars: Math.max(stars, currentProgress.stars),
          bestScore: Math.max(score, currentProgress.bestScore),
          bestTime: currentProgress.bestTime ? Math.min(timeElapsed, currentProgress.bestTime) : timeElapsed,
          attempts: currentProgress.attempts + 1,
          lastPlayed: new Date().toISOString(),
        }
      } else {
        MOCK_PROGRESS.push({
          userId: 1,
          levelId,
          completed,
          stars,
          bestTime: timeElapsed,
          bestScore: score,
          attempts: 1,
          lastPlayed: new Date().toISOString(),
        })
      }

      return {
        message: completed ? "Congratulations! You've completed the level!" : "Keep practicing to improve your score!",
        completed,
        stars,
        score,
        time: timeElapsed,
      }
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${getApiBaseUrl()}/levels/${levelId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers,
        timeElapsed,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to submit quiz answers")
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting quiz answers:", error)
    throw error
  }
}

// Track level attempt in the database
export async function trackLevelAttempt(levelId: number): Promise<void> {
  try {
    if (isDevMode()) {
      console.log("Mock trackLevelAttempt:", { levelId })
      await new Promise((resolve) => setTimeout(resolve, 300))
      return
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("No authentication token found")
    }

    const response = await fetch(`${getApiBaseUrl()}/levels/${levelId}/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to track level attempt")
    }
  } catch (error) {
    console.error("Error tracking level attempt:", error)
    // Don't throw the error as this is not critical functionality
  }
}

// Refresh tokens
export async function refreshTokens(): Promise<boolean> {
  try {
    // Mock refresh in development/preview mode
    if (isDevMode()) {
      console.log("Mock refreshing tokens")
      return true
    }

    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include", // Important for cookies
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh token: ${response.status}`)
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.accessToken)

    return true
  } catch (error) {
    console.error("Error refreshing token:", error)
    // Token refresh failed, user needs to login again
    localStorage.removeItem("accessToken")
    // In development mode, don't redirect
    if (!isDevMode()) {
      window.location.href = "/login"
    }
    return false
  }
}



