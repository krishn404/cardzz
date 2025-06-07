"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { User, Settings, LogOut, Shield, CreditCard, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user, dbUser, loading } = useAuth()

  const handleSignOut = async () => {
    if (!auth) return

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto mobile-container py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-3xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="max-w-4xl mx-auto mobile-container py-8">
          <Card className="border-0 luxury-shadow rounded-3xl">
            <CardContent className="text-center p-8 md:p-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <User className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
              <p className="text-gray-600 mb-8">Please sign in to view your profile.</p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl"
              >
                <Link href="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto mobile-container py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center mb-6">
            <Avatar className="w-20 h-20 md:w-24 md:h-24">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">{user.displayName || "User"}</h1>
          <p className="text-gray-600 text-lg">{user.email}</p>
          {dbUser?.is_admin && (
            <Badge className="mt-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Shield className="h-3 w-3 mr-1" />
              Administrator
            </Badge>
          )}
        </div>

        {/* Profile Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 luxury-shadow-sm rounded-3xl hover:luxury-shadow transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <span>My Submissions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">View and manage your submitted credit cards</p>
              <Button asChild className="w-full rounded-2xl">
                <Link href="/my-submissions">View My Cards</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 luxury-shadow-sm rounded-3xl hover:luxury-shadow transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <span>Submit New Card</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Share a new credit card with the community</p>
              <Button asChild variant="outline" className="w-full rounded-2xl">
                <Link href="/submit-card">Submit Card</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Admin Panel */}
        {dbUser?.is_admin && (
          <Card className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white rounded-3xl luxury-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-white">
                <Shield className="h-6 w-6" />
                <span>Administrator Panel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-100 mb-4">Access admin tools and manage the platform</p>
              <Button asChild className="bg-white text-purple-600 hover:bg-gray-100 rounded-2xl">
                <Link href="/admin">
                  <Settings className="h-4 w-4 mr-2" />
                  Open Admin Panel
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Account Actions */}
        <Card className="border-0 luxury-shadow-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-gray-600" />
              <span>Account Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
              <div>
                <h3 className="font-medium text-gray-900">Account Information</h3>
                <p className="text-sm text-gray-600">Manage your account details and preferences</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl">
                Edit
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl">
              <div>
                <h3 className="font-medium text-gray-900">Sign Out</h3>
                <p className="text-sm text-gray-600">Sign out of your account</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleSignOut} className="rounded-xl">
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
    