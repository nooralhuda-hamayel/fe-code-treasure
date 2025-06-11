import { NextResponse } from 'next/server';
import { QuestionProgressService } from '../services/question-progress.service';
import { auth } from '../auth';
import { ApiResponse, QuestionAttempt } from '../types';

const progressService = new QuestionProgressService();

export async function handleAttemptSubmission(
  request: Request,
  questionId: string
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answer } = await request.json();
    const startTime = request.headers.get('x-start-time');
    const timeSpent = startTime ? Math.floor((Date.now() - parseInt(startTime)) / 1000) : 0;

    const attempt = await progressService.submitAttempt(
      user.id,
      questionId,
      answer,
      false, // Will be updated by the backend
      timeSpent
    );

    const canProceed = await progressService.canProceedToNextQuestion(
      user.id,
      questionId
    );

    const response: ApiResponse<{
      attempt: QuestionAttempt;
      canProceedToNext: boolean;
    }> = {
      success: true,
      data: {
        attempt,
        canProceedToNext: canProceed
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error processing attempt:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to process attempt'
      },
      { status: 500 }
    );
  }
}

export async function getQuestionProgress(
  request: Request,
  questionId: string
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await progressService.getQuestionProgress(
      user.id,
      questionId
    );

    if (!progress) {
      const newProgress = await progressService.initializeQuestion(
        user.id,
        questionId
      );
      return NextResponse.json({ success: true, data: newProgress });
    }

    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    console.error('Error getting progress:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get question progress'
      },
      { status: 500 }
    );
  }
} 