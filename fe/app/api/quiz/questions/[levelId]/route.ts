import { NextResponse } from "next/server"

const BASE_URL = "https://be-code-treasure.onrender.com/api"

export async function GET(
  request: Request,
  { params }: { params: { levelId: string } }
) {
  try {
    // Check for authorization header
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing or invalid authorization token" },
        { status: 401 }
      )
    }

    const levelId = parseInt(params.levelId)
    if (isNaN(levelId)) {
      return NextResponse.json(
        { error: "Invalid level ID. Must be a number." },
        { status: 400 }
      )
    }

    // Forward the request to backend
    const response = await fetch(`${BASE_URL}/levels/${levelId}/questions`, {
      headers: {
        "Authorization": authHeader
      }
    })

    const data = await response.json()

    // Handle different response statuses
    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch questions" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
    
  } catch (error) {
    console.error("[QUIZ_QUESTIONS_GET]", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 