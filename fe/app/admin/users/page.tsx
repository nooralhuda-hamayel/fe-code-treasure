"use client"

import { useState, useEffect } from "react"
import { withAdminAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Star, Trophy, MessageSquare, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AuthWrapper from "@/lib/auth-wrapper"

interface UserData {
  id: number
  name: string
  email: string
  role: string
  created_at: string
  completed_levels: number
  total_stars: number
  highest_score: number
  total_attempts: number
}

function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)

        // In a real implementation, this would fetch from the API
        // For now, we'll use mock data
        const mockUsers: UserData[] = [
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "user",
            created_at: "2023-04-15T10:30:00Z",
            completed_levels: 5,
            total_stars: 12,
            highest_score: 95,
            total_attempts: 15,
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            created_at: "2023-04-20T14:20:00Z",
            completed_levels: 3,
            total_stars: 7,
            highest_score: 85,
            total_attempts: 10,
          },
          {
            id: 3,
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
            created_at: "2023-03-10T09:15:00Z",
            completed_levels: 10,
            total_stars: 28,
            highest_score: 100,
            total_attempts: 30,
          },
        ]

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setLoading(false)
      } catch (err) {
        setError("Failed to load users")
        setLoading(false)
        console.error("Error loading users:", err)
      }
    }

    fetchUsers()
  }, [])

  // Filter users based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )

    setFilteredUsers(filtered)
  }, [searchQuery, users])

  const handleDeleteClick = (user: UserData) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (!selectedUser) return

    // Filter out the deleted user
    const updatedUsers = users.filter(user => user.id !== selectedUser.id)
    setUsers(updatedUsers)
    setFilteredUsers(updatedUsers)
    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleMessageClick = (user: UserData) => {
    // Store the selected user in localStorage
    localStorage.setItem('selectedChatUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }))
    
    // Navigate to chat page
    router.push('/admin/chat')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900/20 border border-red-900 rounded-lg text-red-400 max-w-lg mx-auto">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <AuthWrapper requireAdmin>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-slate-400">View and manage all users on the platform</p>
          </div>

          {/* Search with reduced width */}
          <Card className="bg-slate-800/50 border-slate-700 w-full sm:w-1/4">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 bg-slate-900/50 border-slate-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow>
                    <TableHead className="text-slate-400">Name</TableHead>
                    <TableHead className="text-slate-400">Email</TableHead>
                    <TableHead className="text-slate-400 text-right">Levels</TableHead>
                    <TableHead className="text-slate-400 text-right">Stars</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-white">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                          <span>{user.completed_levels}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                          <span>{user.total_stars}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 border-slate-700 hover:bg-blue-900/20 hover:text-blue-400"
                            onClick={() => handleMessageClick(user)}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 border-slate-700 hover:bg-red-900/20 hover:text-red-400"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-slate-900 border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">Delete User</DialogTitle>
              <DialogDescription className="text-slate-400">
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            
            {selectedUser && (
              <div className="py-4">
                <p className="text-white"><span className="text-slate-400">Name:</span> {selectedUser.name}</p>
                <p className="text-white"><span className="text-slate-400">Email:</span> {selectedUser.email}</p>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="border-amber-500 hover:bg-amber-500/20 text-black hover:text-black"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AuthWrapper>
  )
}

export default withAdminAuth(AdminUsersPage)
