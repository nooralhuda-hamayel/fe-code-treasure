import { NextResponse } from 'next/server';
import { QuestionProgressService } from '../services/question-progress.service';
import { auth } from '../auth';
import { ApiResponse, QuestionHint, QuestionProgress } from '../types';

const progressService = new QuestionProgressService();

export async function handleHintRequest(
  request: Request,
  questionId: string
) {
  try {
    const user = await auth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const progress = await progressService.useHint(user.id, questionId);

    const response: ApiResponse<{
      progress: QuestionProgress;
      hint: QuestionHint;
    }> = {
      success: true,
      data: {
        progress,
        hint: {
          hint: 'This is a hint for the question', // This will come from your API
          cost: 1
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error getting hint:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to get hint'
      },
      { status: 500 }
    );
  }
} 