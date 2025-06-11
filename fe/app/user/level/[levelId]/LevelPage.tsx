"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import CountdownTimer from "@/app/user/countdown-timer"
import DragDropQuestion from "@/app/user/components/modals/drag-drop-question"
import FillGapQuestion from "@/app/user/components/modals/fill-gap-question"
import TypedGapQuestion from "@/app/user/components/modals/typed-gap-question"
import LevelCompletedModal from "@/app/user/components/modals/level-completed-modal"
import FlyingCoin from "@/app/user/flying-coin"
import { levelsService, questionsService } from "@/lib/services/api"
import { Level, Question as ApiQuestion } from "@/lib/types"
import AuthWrapper from "@/lib/auth-wrapper"

interface AnswerResult {
  answer: any;
  correct: boolean;
  points: number;
}

export default function LevelPage({ params }: { params: { levelId: string } }) {
  const router = useRouter()
  const [level, setLevel] = useState<Level | null>(null)
  const [questions, setQuestions] = useState<ApiQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerResult[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [stars, setStars] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCoin, setShowCoin] = useState(false)
  const [coinPosition, setCoinPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const fetchLevelAndQuestions = async () => {
      try {
        setLoading(true)
        
        // Fetch level and questions in parallel
        const [levelResponse, questionsResponse] = await Promise.all([
          levelsService.getLevelById(params.levelId),
          questionsService.getLevelQuestions(params.levelId)
        ]);

        if (levelResponse.success && questionsResponse.success) {
          setLevel(levelResponse.data);
          setQuestions(questionsResponse.data);
          setTimeRemaining(levelResponse.data.time_limit);
        } else {
          setError(levelResponse.error || questionsResponse.error || "Failed to load quiz data");
        }
      } catch (err) {
        setError("An error occurred while loading the quiz");
        console.error("Error loading quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLevelAndQuestions();
  }, [params.levelId]);

  // Timer effect
  useEffect(() => {
    if (!level || loading || isCompleted) return;

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
  }, [level, loading, isCompleted]);

  const handleAnswer = async (answer: any) => {
    if (isCompleted || !questions[currentQuestionIndex]) return;

    try {
      const response = await questionsService.submitAnswer(questions[currentQuestionIndex].id, answer);

      if (response.success) {
        // Show coin animation if answer is correct
        if (response.data.correct) {
          const questionElement = document.querySelector('.question-card');
          const scoreElement = document.querySelector('.score-display');
          
          if (questionElement && scoreElement) {
            const questionRect = questionElement.getBoundingClientRect();
            const scoreRect = scoreElement.getBoundingClientRect();
            
            setCoinPosition({
              x: questionRect.left + questionRect.width / 2,
              y: questionRect.top + questionRect.height / 2
            });
            
            setShowCoin(true);
            setTimeout(() => setShowCoin(false), 1000);
          }
        }

        // Update answers array
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = {
          answer,
          correct: response.data.correct,
          points: response.data.points
        };
        setAnswers(newAnswers);

        // Move to next question or complete quiz
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          handleQuizComplete();
        }
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  const handleQuizComplete = async () => {
    if (!level) return;

    const totalPoints = answers.reduce((sum, answer) => sum + (answer?.points || 0), 0);
    const maxPoints = questions.reduce((sum, question) => sum + question.points, 0);
    const finalScore = Math.round((totalPoints / maxPoints) * 100);
    
    // Calculate stars based on score and time
    let earnedStars = 0;
    if (finalScore >= 90) earnedStars = 3;
    else if (finalScore >= 70) earnedStars = 2;
    else if (finalScore >= level.required_score) earnedStars = 1;

    setScore(finalScore);
    setStars(earnedStars);
    setIsCompleted(true);

    try {
      await levelsService.submitLevelProgress(level.id, {
        time_spent: level.time_limit - timeRemaining,
        score: finalScore,
        stars: earnedStars,
        completed: new Date()
      });
    } catch (err) {
      console.error("Error submitting level progress:", err);
    }
  };

  const handleNextLevel = () => {
    // Find next level in sequence
    if (level) {
      router.push(`/level/${level.order + 1}`);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
        </div>
      );
    }

    if (error || !level) {
      return (
        <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-red-400 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error || "Failed to load quiz"}</p>
        </div>
      );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{level.name}</h1>
            <p className="text-slate-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center score-display">
              <div className="text-2xl font-bold text-amber-400">
                {answers.filter(a => a?.correct).length}
              </div>
              <div className="text-sm text-slate-400">Correct</div>
            </div>
            <CountdownTimer
              timeRemaining={timeRemaining}
              totalTime={level.time_limit}
              isActive={!isCompleted}
            />
          </div>
        </div>

        {/* Question Card */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="question-card"
        >
          {currentQuestion.type === "drag-drop" && (
            <DragDropQuestion
              question={currentQuestion}
              currentOrder={answers[currentQuestionIndex]?.answer || [...Array(currentQuestion.code_blocks.length)].map((_, i) => i)}
              onReorder={handleAnswer}
              answered={!!answers[currentQuestionIndex]}
              isCorrect={answers[currentQuestionIndex]?.correct || false}
            />
          )}

          {currentQuestion.type === "fill-gap" && (
            <FillGapQuestion
              question={currentQuestion}
              selectedOption={answers[currentQuestionIndex]?.answer || ""}
              onOptionSelect={handleAnswer}
              answered={!!answers[currentQuestionIndex]}
              isCorrect={answers[currentQuestionIndex]?.correct || false}
            />
          )}

          {currentQuestion.type === "typed-gap" && (
            <TypedGapQuestion
              question={currentQuestion}
              typedAnswer={answers[currentQuestionIndex]?.answer || ""}
              onAnswerChange={handleAnswer}
              answered={!!answers[currentQuestionIndex]}
              isCorrect={answers[currentQuestionIndex]?.correct || false}
            />
          )}
        </motion.div>

        {/* Progress bar */}
        <div className="mt-8 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Flying coin animation */}
        {showCoin && (
          <FlyingCoin
            startX={coinPosition.x}
            startY={coinPosition.y}
            endX={window.innerWidth - 100}
            endY={50}
          />
        )}

        {/* Level completed modal */}
        {isCompleted && (
          <LevelCompletedModal
            isOpen={true}
            onClose={() => router.push('/levels')}
            level={level}
            stars={stars}
            time={level.time_limit - timeRemaining}
            score={score}
            onNextLevel={handleNextLevel}
          />
        )}
      </div>
    );
  };

  return (
    <AuthWrapper>
      {renderContent()}
    </AuthWrapper>
  );
} 