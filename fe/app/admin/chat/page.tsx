"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
// import { Button, Input, Card, CardContent, Badge } from "@/components/ui"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, MessageSquare, User, Shield, Search, Loader } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { isDevMode } from "@/lib/dev-utils"
import AuthWrapper from "@/lib/auth-wrapper"

interface Message {
  id: number
  senderId: number
  senderName: string
  senderRole: "user" | "admin"
  message: string
  timestamp: string
  isRead: boolean
  isDelivered?: boolean; 
}

interface ChatUser {
  id: number
  name: string
  email: string
  lastMessage?: string
  unreadCount: number
}

export default function AdminChatPage() {
  // States
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<ChatUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const usersListRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  const loadUsers = useCallback(async () => {
    try {
      if (isDevMode()) {
        const mockUsers: ChatUser[] = [
           {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            lastMessage: "مرحباً، أحتاج مساعدة",
            unreadCount: 2
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            lastMessage: "لدي مشكلة في الدفع",
            unreadCount: 0
          }
        ]
        setUsers(mockUsers)
        if (!selectedUser && mockUsers.length > 0) {
          setSelectedUser(mockUsers[0])
        }
      } else {
        const response = await fetch("/api/admin/users")
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users)
        }
      }
    } catch (error) {
      console.error("Failed to load users:", error)
    }
  }, [selectedUser])

  const loadMessages = useCallback(async (userId: number) => {
    try {
      setIsLoading(true)
      if (isDevMode()) {
        const mockMessages: Record<number, Message[]> = {
          1: [
            {
              id: 1,
              senderId: 1,
              senderName: "John Doe",
              senderRole: "user",
              message: "مرحباً، أحتاج مساعدة بخصوص حسابي",
              timestamp: new Date().toISOString(),
              isRead: true,
            },
            {
              id: 2,
              senderId: 0,
              senderName: "Admin",
              senderRole: "admin",
              message: "كيف يمكنني مساعدتك؟",
              timestamp: new Date().toISOString(),
              isRead: true,
            }
          ],
          2: [
            {
              id: 1,
              senderId: 2,
              senderName: "Jane Smith",
              senderRole: "user",
              message: "لدي مشكلة في عملية الدفع",
              timestamp: new Date().toISOString(),
              isRead: true,
            }
          ]
        }
        
        setMessages(mockMessages[userId] || [])
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === userId ? {...u, unreadCount: 0} : u
          )
        )
      } else {
        const response = await fetch(`/api/admin/messages/${userId}`)
        if (response.ok) {
          const data = await response.json()
          setMessages(data.messages)
          
          await fetch(`/api/admin/messages/${userId}/read`, {
            method: "POST"
          })
          
          setUsers(prevUsers => 
            prevUsers.map(u => 
              u.id === userId ? {...u, unreadCount: 0} : u
            )
          )
        }
      }
    } catch (error) {
      console.error("Failed to load messages:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleUserSelect = useCallback(async (user: ChatUser) => {
    if (selectedUser?.id === user.id) return
    
    setUsers(prevUsers => 
      prevUsers.map(u => 
        u.id === user.id ? {...u, unreadCount: 0} : u
      )
    )
    
    setIsLoading(true)
    setSelectedUser(user)
    await loadMessages(user.id)
  }, [selectedUser, loadMessages])

  const sendMessage = async () => {
    if (!newMessage.trim() || isSending || !selectedUser) return

    setIsSending(true)
    const messageText = newMessage.trim()
    setNewMessage("")

    const tempMessage: Message = {
      id: Date.now(),
      senderId: 0,
      senderName: "Admin",
      senderRole: "admin",
      message: messageText,
      timestamp: new Date().toISOString(),
      isRead: true,
    }

    try {
      setMessages(prev => [...prev, tempMessage])
      scrollToBottom()

      if (!isDevMode()) {
        const response = await fetch(`/api/admin/messages/${selectedUser.id}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            message: messageText,
            userId: selectedUser.id
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }
      }

      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? {...msg, isDelivered: true} : msg
      ))

    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id))
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSending(false)
    }
  }

  // Load selected user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('selectedChatUser')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      // Remove from localStorage after reading
      localStorage.removeItem('selectedChatUser')
      // Find user in users list and select them
      const userToSelect = users.find(u => u.id === parsedUser.id)
      if (userToSelect) {
        handleUserSelect(userToSelect)
      }
    }
  }, [users])

  // Effects
  useEffect(() => {
    if (authLoading) return
    if (!user || user.role !== "admin") {
      router.push("/dashboard")
      return
    }

    loadUsers()
    const interval = setInterval(loadUsers, 5000)
    return () => clearInterval(interval)
  }, [authLoading, user, router, loadUsers])

  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id)
    }
  }, [selectedUser, loadMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Render
  if (authLoading || !user) {
    return <LoadingScreen />
  }

  return (
    <AuthWrapper requireAdmin>
      <div className="flex h-[calc(100vh-2rem)]">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800/50 border-r border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Users List */}
          <div 
            ref={usersListRef}
            className="overflow-y-auto"
            style={{ height: 'calc(100vh - 8rem)' }}
          >
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={`p-4 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 ${
                  selectedUser?.id === user.id ? "bg-amber-600/20" : ""
                }`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                  {user.unreadCount > 0 && (
                    <Badge className="bg-amber-500 text-black">
                      {user.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-400 truncate mt-1">{user.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-slate-700 bg-slate-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" />
                    <h1 className="text-xl font-bold text-white">
                      {selectedUser.name}
                    </h1>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  <>
                    {messages.map((message, index) => {
                      const showDate =
                        index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)

                      return (
                        <div key={message.id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <Badge variant="outline" className="text-slate-400 border-slate-600">
                                {formatDate(message.timestamp)}
                              </Badge>
                            </div>
                          )}

                          <div className={`flex ${message.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] ${message.senderRole === "admin" ? "order-2" : "order-1"}`}>
                              <div className="flex items-center space-x-2 mb-1">
                                {message.senderRole === "admin" ? (
                                  <Shield className="w-4 h-4 text-amber-500" />
                                ) : (
                                  <User className="w-4 h-4 text-green-400" />
                                )}
                                <span className="text-sm text-slate-400">{message.senderName}</span>
                                <span className="text-xs text-slate-500">{formatTime(message.timestamp)}</span>
                              </div>
                              <div className={`p-3 rounded-lg ${
                                message.senderRole === "admin" 
                                  ? "bg-amber-500 text-black" 
                                  : "bg-slate-800 text-white"
                              }`}>
                                <p className="whitespace-pre-wrap">{message.message}</p>
                                {message.senderRole === "admin" && !message.isDelivered && (
                                  <p className="text-xs text-slate-700 mt-1">Sending...</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-4 border-t border-slate-700 bg-slate-800/50">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder-slate-400"
                    disabled={isSending}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isSending}
                    className="bg-amber-500 hover:bg-amber-600 text-black"
                  >
                    {isSending ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a user to start the conversation</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthWrapper>
  )
}

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <Loader className="animate-spin h-12 w-12 text-amber-500" />
  </div>
)