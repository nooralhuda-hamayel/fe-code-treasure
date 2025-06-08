"use client"

import { useRef } from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { fetchQuizQuestions, submitQuizAnswers } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import FillGapQuestion from "@/app/user/components/modals/fill-gap-question"
import TypedGapQuestion from "@/app/user/components/modals/typed-gap-question"
import DragDropQuestion from "@/app/user/components/modals/drag-drop-question"
import CountdownTimer from "@/app/user/countdown-timer"
import LevelCompletedModal from "@/app/user/level-completed-modal"
import Confetti from "@/app/user/confetti"
import { ArrowRight, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Star } from "lucide-react"
import FlyingCoin from "@/app/user/flying-coin"
import { levelsService, questionsService } from "@/lib/services/api"
import { 
  Level, 
  Question,
  BackendAnswer,
  BackendQuestion,
  BackendAnswerResponse,
  ApiResponse,
  DragDropQuestion as DragDropQuestionType,
  FillGapQuestion as FillGapQuestionType,
  TypedGapQuestion as TypedGapQuestionType,
  AnswerResult
} from "@/lib/types"

// تعريف أنواع البيانات للباك
interface BackendOption {
  id: number;
  label: string;
  is_correct: boolean;
}

interface QuestionState {
  stars: number;
  attempts: number;
  usedHint: boolean;
  timeExceeded: boolean;
  completed: boolean;
}

export default function Quiz({ params }: { params: { levelId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const levelId = searchParams.get("levelId") ? Number.parseInt(searchParams.get("levelId") as string) : 1
  const { toast } = useToast()

  // State for quiz
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [typedAnswer, setTypedAnswer] = useState<string>("")
  const [currentOrder, setCurrentOrder] = useState<number[]>([])
  const [answered, setAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [answerResults, setAnswerResults] = useState<AnswerResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [showCompletedModal, setShowCompletedModal] = useState(false)
  const [quizResults, setQuizResults] = useState<{
    stars: number
    score: number
    time: number
    completed: boolean
  } | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [level, setLevel] = useState<Level | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [monkeyPosition, setMonkeyPosition] = useState(0)
  const [animationKey, setAnimationKey] = useState(0)
  const [showFlyingCoins, setShowFlyingCoins] = useState(false)
  const [monkeyCoords, setMonkeyCoords] = useState({ x: 0, y: 0 })
  const [scoreCoords, setScoreCoords] = useState({ x: 0, y: 0 })
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0)
  const [submittingResults, setSubmittingResults] = useState(false)
  const [resultStars, setResultStars] = useState(0)

  // For drag and drop questions
  const [dragOrder, setDragOrder] = useState<number[]>([])

  // For fill gap questions

  const totalSteps = questions.length
  const scoreRef = useRef<HTMLDivElement>(null)
  const monkeyRef = useRef<HTMLDivElement>(null)

  const [questionsState, setQuestionsState] = useState<Record<string, QuestionState>>({});
  const [currentQuestionStartTime, setCurrentQuestionStartTime] = useState<Date | null>(null);
  const STARS_PER_QUESTION = 5;
  const TIME_LIMIT_PER_QUESTION = 60; // 1 minute in seconds
  
  // Initialize question state when questions are loaded
  useEffect(() => {
    if (questions.length > 0) {
      const initialState: Record<string, QuestionState> = {};
      questions.forEach(q => {
        initialState[q.id] = {
          stars: STARS_PER_QUESTION,
          attempts: 0,
          usedHint: false,
          timeExceeded: false,
          completed: false
        };
      });
      setQuestionsState(initialState);
      setCurrentQuestionStartTime(new Date());
    }
  }, [questions]);

  // Simulate progress loading
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          const newProgress = prev + Math.random() * 15
          return newProgress >= 100 ? 100 : newProgress
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [isLoading])

  // تعديل وظيفة جلب الأسئلة
  useEffect(() => {
    const fetchLevelAndQuestions = async () => {
      try {
        setIsLoading(true);
        
        const [levelResponse, questionsResponse] = await Promise.all([
          levelsService.getLevelById(params.levelId),
          questionsService.getLevelQuestions(params.levelId)
        ]);

        if (levelResponse.success && questionsResponse.success) {
          setLevel(levelResponse.data);
          
          // تحويل الأسئلة من صيغة الباك إلى الصيغة المطلوبة في الفرونت
          const formattedQuestions = ((questionsResponse.data as unknown) as BackendQuestion[]).map(q => {
            const baseQuestion = {
              id: q.id.toString(),
              level_id: params.levelId,
              text: q.description,
              points: q.points || 1,
              order: q.ordering,
              description: q.description,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              language: q.language || 'javascript',
              hint: q.hint
            };

            // Backend returns options array with { id, label, is_correct, ordering } structure
            if (q.type === 'drag-drop') {
              return {
                ...baseQuestion,
                type: 'drag-drop' as const,
                codeBlocks: q.options.map(opt => opt.label),
                correctOrder: q.options
                  .sort((a, b) => a.ordering - b.ordering)
                  .map(opt => opt.id)
              };
            } else if (q.type === 'typed-gap' || q.options.length === 1) {
              return {
                ...baseQuestion,
                type: 'typed-gap' as const,
                codeSnippet: q.code_snippet || q.description,
                correctAnswer: q.options[0]?.label || ''
              };
            } else {
              return {
                ...baseQuestion,
                type: 'fill-gap' as const,
                codeSnippet: q.code_snippet || q.description,
                options: q.options.map(opt => opt.label),
                correctAnswer: q.options.find(opt => opt.is_correct)?.label || ''
              };
            }
          });

          setQuestions(formattedQuestions as Question[]);
          setTimeRemaining(levelResponse.data.timeLimit);
          setTotalTime(levelResponse.data.timeLimit);
        } else {
          setError(levelResponse.error || questionsResponse.error || "Failed to load quiz data");
        }
      } catch (err) {
        setError("An error occurred while loading the quiz");
        console.error("Error loading quiz:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLevelAndQuestions();
  }, [params.levelId]);

  // Timer effect
  useEffect(() => {
    if (!level || isLoading || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [level, isLoading, isCompleted]);

  // تعديل وظيفة إرسال الإجابة
  const handleAnswer = async (answer: string | number[]) => {
    if (isCompleted || !currentQuestionData) return;

    try {
      let answerToSubmit: BackendAnswer;
      
      // Format answer based on question type
      if (currentQuestionData.type === 'drag-drop') {
        answerToSubmit = {
          answer: currentOrder.map(String) // Convert numbers to strings for consistency
        };
      } else if (currentQuestionData.type === 'typed-gap') {
        answerToSubmit = {
          answer: typedAnswer.trim()
        };
      } else {
        // For fill-gap, find the option ID that matches the selected option
        const optionIndex = currentQuestionData.options.findIndex(opt => opt === selectedOption);
        answerToSubmit = {
          option_id: optionIndex !== -1 ? optionIndex + 1 : undefined,
          answer: selectedOption
        };
      }

      const response = await questionsService.submitAnswer(
        currentQuestionData.id,
        answerToSubmit
      );

      if (response.success && response.data) {
        const newAnswers = [...answerResults];
        newAnswers[currentQuestionIndex] = {
          questionId: currentQuestionData.id,
          answer: answer.toString(),
          correct: response.data.correct
        };
        setAnswerResults(newAnswers);

        setIsCorrect(response.data.correct);
        setAnswered(true);

        if (response.data.correct) {
          setShowFlyingCoins(true);
          setTimeout(() => setShowFlyingCoins(false), 1000);
        }
      } else {
        throw new Error(response.error || 'Failed to submit answer');
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    }
  };

  // وظيفة مساعدة للحصول على معرف الخيار
  const getOptionId = (answer: any, question: Question): number => {
    if (question.type === 'fill-gap') {
      const fillGapQuestion = question as FillGapQuestionType;
      const optionIndex = fillGapQuestion.options.indexOf(answer);
      return optionIndex + 1; // نفترض أن معرفات الخيارات تبدأ من 1
    } else if (question.type === 'typed-gap') {
      return 1; // نفترض أن هناك خيار واحد فقط للأسئلة المكتوبة
    } else if (question.type === 'drag-drop') {
      const dragDropQuestion = question as DragDropQuestionType;
      return answer[0]; // نأخذ أول معرف من مصفوفة الترتيب
    }
    return 0;
  };

  const handleQuizComplete = async () => {
    if (!level) return;

    try {
      setSubmittingResults(true);

      // Calculate total stars and score
      const totalStarsEarned = Object.values(questionsState).reduce((sum, state) => sum + state.stars, 0);
      const totalPossibleStars = questions.length * STARS_PER_QUESTION;
      const finalScore = Math.round((totalStarsEarned / totalPossibleStars) * 100);

      // Calculate level stars (based on overall performance)
      let earnedLevelStars = 0;
      const averageStarsPerQuestion = totalStarsEarned / questions.length;
      if (averageStarsPerQuestion >= 4) earnedLevelStars = 3;
      else if (averageStarsPerQuestion >= 3) earnedLevelStars = 2;
      else if (averageStarsPerQuestion >= 2) earnedLevelStars = 1;

      setResultStars(earnedLevelStars);
      setIsCompleted(true);
      setIsTimerActive(false);

      // Submit level progress
      const progressResponse = await levelsService.submitLevelProgress(levelId.toString(), {
        score: finalScore,
        stars: earnedLevelStars,
        timeSpent: totalTime - timeRemaining,
        completed: finalScore >= level.requiredScore,
        questionStats: Object.entries(questionsState).map(([questionId, state]) => ({
          questionId,
          stars: state.stars,
          attempts: state.attempts,
          usedHint: state.usedHint,
          timeExceeded: state.timeExceeded
        }))
      });

      if (!progressResponse.success) {
        throw new Error(progressResponse.error || 'Failed to submit level progress');
      }

      setQuizResults({
        stars: earnedLevelStars,
        score: finalScore,
        time: totalTime - timeRemaining,
        completed: finalScore >= level.requiredScore,
      });

      // Show completion modal
      setShowCompletedModal(true);

      // Show confetti if passed
      if (finalScore >= level.requiredScore) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

      toast({
        title: finalScore >= level.requiredScore ? "Level completed!" : "Level not passed",
        description: `You scored ${finalScore}% with ${earnedLevelStars} stars overall. Average stars per question: ${averageStarsPerQuestion.toFixed(1)}`,
        variant: finalScore >= level.requiredScore ? "success" : "warning",
      });
    } catch (err) {
      console.error("Error completing quiz:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to complete quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingResults(false);
    }
  };

  // Get current question
  const currentQuestionData = questions[currentQuestionIndex]

  // Handle option selection for multiple choice questions
  const handleOptionSelect = (option: string) => {
    if (answered) return
    setSelectedOption(option)
  }

  // Handle typed answer change
  const handleAnswerChange = (value: string) => {
    if (answered) return
    setTypedAnswer(value)
  }

  // Handle reordering for drag-drop questions
  const handleReorder = (newOrder: number[]) => {
    if (answered) return
    setCurrentOrder(newOrder)
  }

  // Check answer
  const checkAnswer = () => {
    if (!currentQuestionData || !currentQuestionStartTime) return;

    let correct = false;
    let answer: string | number[] | string[] = "";

    // Update attempts count
    const currentState = questionsState[currentQuestionData.id];
    const newState = { ...currentState };
    newState.attempts += 1;

    // Check time limit
    const timeSpent = Math.floor((new Date().getTime() - currentQuestionStartTime.getTime()) / 1000);
    if (timeSpent > TIME_LIMIT_PER_QUESTION && !newState.timeExceeded) {
      newState.timeExceeded = true;
      newState.stars = Math.max(1, newState.stars - 2); // Deduct 2 stars for exceeding time, but keep minimum 1
    }

    // Check answer based on question type
    if (currentQuestionData.type === "fill-gap") {
      const fillGapQuestion = currentQuestionData as FillGapQuestionType;
      correct = selectedOption === fillGapQuestion.correctAnswer;
      answer = selectedOption;
    } else if (currentQuestionData.type === "typed-gap") {
      const typedGapQuestion = currentQuestionData as TypedGapQuestionType;
      correct = typedAnswer.trim().toLowerCase() === typedGapQuestion.correctAnswer.toLowerCase();
      answer = typedAnswer;
    } else if (currentQuestionData.type === "drag-drop") {
      const dragDropQuestion = currentQuestionData as DragDropQuestionType;
      correct = JSON.stringify(currentOrder) === JSON.stringify(dragDropQuestion.correctOrder);
      answer = currentOrder.map(String);
    }

    // Update stars based on incorrect answer
    if (!correct) {
      newState.stars = Math.max(1, newState.stars - 1); // Deduct 1 star for wrong answer, but keep minimum 1
    } else {
      newState.completed = true;
    }

    // Update question state
    setQuestionsState(prev => ({
      ...prev,
      [currentQuestionData.id]: newState
    }));

    // Update UI state
    setAnswered(true);
    setIsCorrect(correct);

    // Add to answer results
    const newResult: AnswerResult = {
      questionId: currentQuestionData.id,
      answer: answer.toString(),
      correct: correct,
    };

    const updatedResults = [...answerResults, newResult];
    setAnswerResults(updatedResults);

    // Show toast with remaining stars
    toast({
      title: correct ? "Correct!" : "Incorrect",
      description: `${correct ? "Great job!" : "Try again!"} (${newState.stars}/${STARS_PER_QUESTION} stars remaining)`,
      variant: correct ? "success" : "warning",
    });

    // Only allow proceeding to next question if answer is correct
    if (correct) {
      setCurrentQuestionStartTime(new Date()); // Reset timer for next question
    }
  };

  // Modify getHint function to deduct stars
  const handleGetHint = async () => {
    if (!currentQuestionData) return;

    const currentState = questionsState[currentQuestionData.id];
    if (!currentState.usedHint) {
      const newState = { ...currentState };
      newState.usedHint = true;
      newState.stars = Math.max(1, newState.stars - 1); // Deduct 1 star for using hint, but keep minimum 1

      setQuestionsState(prev => ({
        ...prev,
        [currentQuestionData.id]: newState
      }));

      try {
        const response = await questionsService.getHint(currentQuestionData.id);
        if (response.success && response.data) {
          toast({
            title: "Hint",
            description: response.data,
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Error getting hint:", error);
        toast({
          title: "Error",
          description: "Failed to get hint. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Hint already used",
        description: "You've already used the hint for this question.",
        variant: "warning",
      });
    }
  };

  // Handle next question
  const handleNextQuestion = async () => {
    // If this was the last question, submit the quiz
    if (currentQuestionIndex === questions.length - 1) {
      try {
        const results = await submitQuizAnswers(
          levelId,
          answerResults.map((result) => ({
            questionId: parseInt(result.questionId),
            answer: result.answer,
            correct: result.correct,
          })),
          totalTime - timeRemaining,
        )

        setQuizResults({
          stars: results.stars,
          score: results.score,
          time: totalTime - timeRemaining,
          completed: results.completed,
        })

        // Show completion modal
        setShowCompletedModal(true)

        // Show confetti if passed
        if (results.completed) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 5000)
        }

        // Clear session storage
        sessionStorage.removeItem("currentLevel")
        sessionStorage.removeItem("currentQuestionIndex")
        sessionStorage.removeItem("answers")
        sessionStorage.removeItem("startTime")
        sessionStorage.removeItem("elapsedTime")

        toast({
          title: "Quiz completed!",
          description: `You scored ${results.score}% and earned ${results.stars} stars.`,
          variant: results.completed ? "success" : "warning",
        })
      } catch (error) {
        console.error("Error submitting quiz:", error)
        toast({
          title: "Failed to submit quiz",
          description: "Please try again.",
          variant: "destructive",
        })
      }
      return
    }

    // Move to next question
    const nextIndex = currentQuestionIndex + 1
    setCurrentQuestionIndex(nextIndex)
    sessionStorage.setItem("currentQuestionIndex", nextIndex.toString())

    // Reset question state
    setAnswered(false)
    setIsCorrect(false)
    setSelectedOption("")
    setTypedAnswer("")

    // Initialize drag-drop order if needed
    if (questions[nextIndex]) {
      const question = questions[nextIndex]
      if (question.type === "drag-drop") {
        const dragDropQuestion = question as DragDropQuestionType
        setCurrentOrder([...Array(dragDropQuestion.codeBlocks.length).keys()])
      }
    }
  }

  // Handle going to levels page
  const handleGoToLevels = () => {
    router.push("/levels")
  }

  // Handle next level
  const handleNextLevel = () => {
    if (!level) return

    // Navigate to next level
    router.push(`/level/${level.order + 1}`)

    // Show toast
    toast({
      title: "Next level unlocked!",
      description: "Continue your coding adventure.",
      variant: "success",
    })
  }

  // Update coordinates for flying coins animation
  useEffect(() => {
    const updateCoords = () => {
      if (scoreRef.current && monkeyRef.current) {
        const scoreRect = scoreRef.current.getBoundingClientRect()
        const monkeyRect = monkeyRef.current.getBoundingClientRect()

        setScoreCoords({
          x: scoreRect.left + scoreRect.width / 2,
          y: scoreRect.top + scoreRect.height / 2,
        })

        setMonkeyCoords({
          x: monkeyRect.left + monkeyRect.width / 2,
          y: monkeyRect.top + monkeyRect.height / 2,
        })
      }
    }

    updateCoords()
    window.addEventListener("resize", updateCoords)

    return () => {
      window.removeEventListener("resize", updateCoords)
    }
  }, [monkeyPosition, currentQuestionIndex])

  const handleRestartQuiz = () => {
    // Reload the page with the same level to restart
    router.refresh()
  }

  const handleBackToLevels = () => {
    router.push("/levels")
  }

  const progress = ((currentQuestionIndex + 1) / (questions.length || 1)) * 100

  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showConfetti])

  // Render stars for score
  const renderStars = (count: number) => {
    return (
      <div className="flex space-x-1">
        {[...Array(totalSteps)].map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < count ? "text-amber-400 fill-amber-400" : "text-slate-600"
            } transition-colors duration-300`}
          />
        ))}
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="relative w-24 h-24 mb-6 mx-auto">
            <div className="absolute inset-0 rounded-full border-t-2 border-amber-500 animate-spin"></div>
            <div className="absolute inset-3 rounded-full border-2 border-slate-700"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-amber-500 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Loading Challenge</h2>
          <p className="text-slate-400 mb-4">Preparing your coding quiz...</p>
          <Progress value={loadingProgress} className="h-2 bg-slate-700" indicatorClassName="bg-amber-500" />
          <p className="text-sm text-slate-500 mt-2">{Math.round(loadingProgress)}%</p>
        </div>
      </div>
    )
  }

  // No questions loaded
  if (!currentQuestionData) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <Card className="p-8 max-w-md mx-auto text-center bg-slate-800 border-slate-700">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Questions Available</h2>
          <p className="text-slate-400 mb-6">We couldn't find any questions for this level.</p>
          <Button onClick={handleGoToLevels} className="bg-amber-500 hover:bg-amber-600">
            Return to Levels
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="min-h-[80vh]">
        <div className="max-w-4xl mx-auto">
          {/* Quiz header */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Level {levelId}: {level?.name || "Coding Challenge"}
              </h1>
              <p className="text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <CountdownTimer timeRemaining={timeRemaining} totalTime={totalTime} isActive={!isCompleted} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <Progress
              value={((currentQuestionIndex + (answered ? 1 : 0)) / questions.length) * 100}
              className="h-2 bg-slate-700"
              indicatorClassName="bg-amber-500"
            />
          </div>

          {/* Question */}
          <Card className="bg-slate-800 border-slate-700 p-6 mb-6 rounded-xl shadow-lg question-card">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold">{currentQuestionData.text}</h2>
              <div className="flex items-center space-x-4">
                {/* Stars display */}
                <div className="flex items-center space-x-1">
                  {[...Array(STARS_PER_QUESTION)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < (questionsState[currentQuestionData.id]?.stars || STARS_PER_QUESTION)
                          ? "text-amber-400 fill-amber-400"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                {/* Hint button */}
                {!questionsState[currentQuestionData.id]?.usedHint && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetHint}
                    className="text-amber-400 border-amber-400 hover:bg-amber-400/10"
                  >
                    Get Hint (-1 ⭐)
                  </Button>
                )}
              </div>
            </div>

            {/* Attempts counter */}
            <div className="text-sm text-slate-400 mb-4">
              Attempts: {questionsState[currentQuestionData.id]?.attempts || 0}
            </div>

            {/* Question content */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Question content based on type */}
              {currentQuestionData.type === "fill-gap" && (
                <FillGapQuestion
                  question={currentQuestionData as FillGapQuestionType}
                  selectedOption={selectedOption}
                  onOptionSelect={handleOptionSelect}
                  answered={answered}
                  isCorrect={isCorrect}
                />
              )}

              {currentQuestionData.type === "typed-gap" && (
                <TypedGapQuestion
                  question={currentQuestionData as TypedGapQuestionType}
                  typedAnswer={typedAnswer}
                  onAnswerChange={handleAnswerChange}
                  answered={answered}
                  isCorrect={isCorrect}
                />
              )}

              {currentQuestionData.type === "drag-drop" && (
                <DragDropQuestion
                  question={{
                    ...currentQuestionData as DragDropQuestionType,
                    correctOrder: (currentQuestionData as DragDropQuestionType).correctOrder.map(Number)
                  }}
                  currentOrder={currentOrder}
                  onReorder={handleReorder}
                  answered={answered}
                  isCorrect={isCorrect}
                />
              )}
            </motion.div>
          </Card>

          {/* Answer feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? "bg-green-900/20 border border-green-900/30" : "bg-red-900/20 border border-red-900/30"
                }`}
              >
                <div className="flex items-start">
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className={`font-bold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                      {isCorrect ? "Correct!" : "Incorrect"}
                    </h3>
                    {!isCorrect && (
                      <p className="text-sm mt-2 text-slate-300">
                        {currentQuestionData.type === "drag-drop" &&
                        (currentQuestionData as DragDropQuestionType).explanation
                          ? (currentQuestionData as DragDropQuestionType).explanation
                          : currentQuestionData.type !== "drag-drop" &&
                              ((currentQuestionData as FillGapQuestionType).explanation ||
                                (currentQuestionData as TypedGapQuestionType).explanation)
                            ? (currentQuestionData as FillGapQuestionType).explanation ||
                              (currentQuestionData as TypedGapQuestionType).explanation
                            : "Keep practicing to improve your coding skills!"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleGoToLevels}
              className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              Exit Quiz
            </Button>

            {!answered ? (
              <Button
                onClick={checkAnswer}
                className="bg-amber-500 hover:bg-amber-600 text-white"
                disabled={
                  (currentQuestionData.type === "fill-gap" && !selectedOption) ||
                  (currentQuestionData.type === "typed-gap" && !typedAnswer.trim())
                }
              >
                Check Answer
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                className="bg-amber-500 hover:bg-amber-600 text-white flex items-center"
              >
                {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Level completed modal */}
      {quizResults && level && (
        <LevelCompletedModal
          isOpen={showCompletedModal}
          onClose={() => setShowCompletedModal(false)}
          level={level}
          stars={quizResults.stars}
          time={quizResults.time}
          score={quizResults.score}
          onNextLevel={handleNextLevel}
        />
      )}

      {/* Flying coin animation */}
      {showFlyingCoins && (
        <FlyingCoin
          startX={monkeyCoords.x}
          startY={monkeyCoords.y}
          endX={scoreCoords.x}
          endY={scoreCoords.y}
        />
      )}
    </>
  )
}
