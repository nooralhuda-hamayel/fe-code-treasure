import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from '../middleware';

// Temporary mock service until backend integration
class QuestionsService {
  async getAllQuestions() { return []; }
  async getLevelQuestions(levelId: number) { return []; }
  async createQuestion(data: any) { return data; }
  async updateQuestion(id: number, data: any) { return data; }
  async deleteQuestion(id: number) { return true; }
}

const questionsService = new QuestionsService();

// جلب جميع الأسئلة
export async function GET(req: NextRequest) {
  try {
    // التحقق من صلاحيات المسؤول
    const user = await authMiddleware(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // استخراج معرف المستوى من query parameters
    const { searchParams } = new URL(req.url);
    const levelId = searchParams.get('levelId');

    let questions;
    if (levelId) {
      questions = await questionsService.getLevelQuestions(parseInt(levelId));
    } else {
      questions = await questionsService.getAllQuestions();
    }

    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

// إضافة سؤال جديد
export async function POST(req: NextRequest) {
  try {
    // التحقق من صلاحيات المسؤول
    const user = await authMiddleware(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const questionData = await req.json();

    // التحقق من وجود البيانات المطلوبة
    if (!questionData.level_id || !questionData.type || !questionData.text) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newQuestion = await questionsService.createQuestion(questionData);
    return NextResponse.json(
      { success: true, data: newQuestion },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create question' },
      { status: 500 }
    );
  }
}

// تحديث سؤال
export async function PUT(req: NextRequest) {
  try {
    // التحقق من صلاحيات المسؤول
    const user = await authMiddleware(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('id');
    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const questionData = await req.json();
    const updatedQuestion = await questionsService.updateQuestion(
      parseInt(questionId),
      questionData
    );
    return NextResponse.json({ success: true, data: updatedQuestion });
  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update question' },
      { status: 500 }
    );
  }
}

// حذف سؤال
export async function DELETE(req: NextRequest) {
  try {
    // التحقق من صلاحيات المسؤول
    const user = await authMiddleware(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const questionId = searchParams.get('id');
    if (!questionId) {
      return NextResponse.json(
        { success: false, error: 'Question ID is required' },
        { status: 400 }
      );
    }

    await questionsService.deleteQuestion(parseInt(questionId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete question' },
      { status: 500 }
    );
  }
} 