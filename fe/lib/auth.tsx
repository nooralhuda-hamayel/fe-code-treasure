"use client"
//used for register and login
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Types
interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface LoginResponse {
  success: boolean
  message?: string
  user?: User
}

interface ErrorResponse {
  status: 'error'
  code: string
  message: string
  fields?: Array<{
    field: string
    type: string
    required: boolean
  }>
}

interface SuccessResponse {
  status: 'success'
  data: {
    user: User
    access_token: string
  }
}
const BASE_URL = "https://be-code-treasure.onrender.com/api"




// Register a new user
export async function registerUser(name: string, email: string, password: string, avatarId: number) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, avatar_id: avatarId }),
    })

    const data = await response.json()

    if (!response.ok) {
      switch (response.status) {
        case 400:
          throw new Error(data.error || "Missing required fields")
        case 409:
          throw new Error(data.error || "Email already exists")
        case 500:
          throw new Error(data.error || "Server error occurred")
        default:
          throw new Error(data.error || "Registration failed")
      }
    }

    // Store user and token in localStorage
    localStorage.setItem("user", JSON.stringify(data.user))
    localStorage.setItem("accessToken", data.token)

    return data
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

// Fetch user profile
async function fetchUserProfile(token: string): Promise<User> {
  try {
    const response = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}

// Login user
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    console.log('Attempting to login with URL:', `${BASE_URL}/auth`);
    
    const response = await fetch(`${BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    console.log('Response status:', response.status);
    const data = await response.json()
    console.log('Response data:', data);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Login failed"
      }
    }

    // Store the access token
    const accessToken = data.access_token;
    if (!accessToken) {
      console.error('No access token in response');
      return {
        success: false,
        message: "Invalid server response - no access token"
      }
    }

    localStorage.setItem("accessToken", accessToken);

    // Fetch user profile with the token
    try {
      const user = await fetchUserProfile(accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      
      return {
        success: true,
        user: user
      }
    } catch (profileError) {
      console.error("Error fetching user profile:", profileError);
      return {
        success: false,
        message: "Failed to fetch user profile"
      }
    }

  } catch (error) {
    console.error('Login error details:', {
      error,
      url: `${BASE_URL}/auth`,
      email: email.length, // Log only length for security
    });

    // Check if it's a CORS error
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      return {
        success: false,
        message: "Unable to connect to the server. Please check your internet connection or try again later."
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred"
    }
  }
}

// Logout user
export async function logoutUser() {
  try {
    const token = localStorage.getItem("accessToken")
    if (token) {
      const response = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })

      if (!response.ok) {
        console.error("Logout failed on server")
      }
    }
  } catch (error) {
    console.error("Logout error:", error)
  } finally {
    // Always clear local storage
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
  }
}

// Request password reset (send OTP)
export async function requestPasswordReset(email: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to request password reset")
    }

    const data = await response.json()
    return {
      message: data.message || "Password reset OTP sent to your email",
      email,
    }
  } catch (error) {
    console.error("Password reset request error:", error)
    throw error
  }
}

// Verify OTP
export async function verifyOtp(email: string, otp: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to verify OTP")
    }

    const data = await response.json()
    return {
      message: data.message || "OTP verified successfully",
      resetToken: data.resetToken,
    }
  } catch (error) {
    console.error("OTP verification error:", error)
    throw error
  }
}

// Reset password with token
export async function resetPassword(resetToken: string, newPassword: string) {
  try {
    const response = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resetToken}` // استخدام التوكن في الهيدر
      },
      body: JSON.stringify({ newPassword }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to reset password")
    }

    const data = await response.json()
    return {
      message: data.message || "Password reset successful",
      success: true
    }
  } catch (error) {
    console.error("Password reset error:", error)
    throw error
  }
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  register: (name: string, email: string, password: string, avatarId: number) => Promise<void>
  loading: boolean
  error: string | null
  isAuthenticated: boolean
  requestReset: (email: string) => Promise<{ message: string; email: string }>
  verifyResetOtp: (email: string, otp: string) => Promise<{ resetToken: string }>
  resetUserPassword: (resetToken: string, newPassword: string) => Promise<{ message: string; success: boolean }>
}

export function useAuth(): AuthContextType {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User
        setUser(parsedUser)
      } catch (e) {
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await loginUser(email, password)
      if (response.success && response.user) {
        setUser(response.user)
      }
      return response
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      throw err
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("accessToken")
    setUser(null)
  }

  const register = async (name: string, email: string, password: string, avatarId: number) => {
    try {
      const data = await registerUser(name, email, password, avatarId)
      setUser(data.user)
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
      throw error
    }
  }

  const requestReset = async (email: string) => {
    try {
      const result = await requestPasswordReset(email)
      return result
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to request password reset")
      throw error
    }
  }

  const verifyResetOtp = async (email: string, otp: string) => {
    try {
      const result = await verifyOtp(email, otp)
      return result
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to verify OTP")
      throw error
    }
  }

  const resetUserPassword = async (resetToken: string, newPassword: string) => {
    try {
      const result = await resetPassword(resetToken, newPassword)
      return result
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to reset password")
      throw error
    }
  }

  const checkAuthStatus = () => {
    return {
      isAuthenticated: !!user,
      isLoading: loading
    }
  }

  return {
    user,
    login,
    logout,
    register,
    loading,
    error,
    isAuthenticated: !!user,
    requestReset,
    verifyResetOtp,
    resetUserPassword,
  }
}

// Auth protection HOC
export function withAuth(Component: React.ComponentType) {
  return function AuthProtected(props: any) {
    const router = useRouter()
    const { user, loading } = useAuth()
    const isAuthenticated = !!user

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push("/login")
      }
    }, [loading, isAuthenticated, router])

    if (loading) {
      return <div>Loading...</div>
    }

    return isAuthenticated ? <Component {...props} /> : null
  }
}

// Admin protection HOC
export function withAdminAuth(Component: React.ComponentType) {
  return function AdminProtected(props: any) {
    // Temporarily disable admin auth check
    return <Component {...props} />

    // Original code (commented out for now)
    /*
    const router = useRouter()
    const { user, loading } = useAuth()
    const isAuthenticated = !!user

    useEffect(() => {
      if (!loading && (!isAuthenticated || user?.role !== "admin")) {
        router.push("/login")
      }
    }, [loading, isAuthenticated, user, router])

    if (loading) {
      return <div>Loading...</div>
    }

    return isAuthenticated && user?.role === "admin" ? <Component {...props} /> : null
    */
  }
}
