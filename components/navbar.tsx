"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { signInWithPopup, signOut } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { CreditCard, User, LogOut, Plus, Settings, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { user, dbUser, loading } = useAuth()

  const handleSignIn = async () => {
    if (!auth || !googleProvider) return

    try {
      await signInWithPopup(auth, googleProvider)
    } catch (error) {
      console.error("Sign in error:", error)
    }
  }

  const handleSignOut = async () => {
    if (!auth) return

    try {
      await signOut(auth)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 ios-blur border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Cardly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium">
              Browse Cards
            </Link>
            {user && (
              <>
                <Link
                  href="/submit-card"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Submit Card</span>
                </Link>
                <Link
                  href="/my-submissions"
                  className="text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
                >
                  My Cards
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Admin Badge */}
            {dbUser?.is_admin && (
              <Link href="/admin" className="hidden md:block">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600">
                  Admin
                </Badge>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/" className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                    Browse Cards
                  </Link>
                  {user && (
                    <>
                      <Link
                        href="/submit-card"
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        Submit Card
                      </Link>
                      <Link
                        href="/my-submissions"
                        className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        My Cards
                      </Link>
                      {dbUser?.is_admin && (
                        <Link
                          href="/admin"
                          className="text-lg font-medium text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Admin Panel
                        </Link>
                      )}
                    </>
                  )}
                  {!user && (
                    <Button onClick={handleSignIn} className="w-full">
                      Sign In with Google
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            {loading ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.displayName}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/my-submissions" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Submissions
                    </Link>
                  </DropdownMenuItem>
                  {dbUser?.is_admin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleSignIn}
                className="hidden md:flex bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
