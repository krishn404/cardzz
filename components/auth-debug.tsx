"use client"

import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, User } from "lucide-react"

export function AuthDebug() {
  const { user, dbUser, loading, error, refreshUser } = useAuth()

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-yellow-800">
          <User className="h-5 w-5" />
          <span>Auth Debug (Development Only)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Firebase User</h4>
            <Badge variant={user ? "default" : "destructive"}>{user ? "Authenticated" : "Not Authenticated"}</Badge>
            {user && (
              <div className="text-sm text-yellow-700 mt-1">
                <div>UID: {user.uid}</div>
                <div>Email: {user.email}</div>
                <div>Name: {user.displayName}</div>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Database User</h4>
            <Badge variant={dbUser ? "default" : "destructive"}>{dbUser ? "Found" : "Not Found"}</Badge>
            {dbUser && (
              <div className="text-sm text-yellow-700 mt-1">
                <div>ID: {dbUser.id}</div>
                <div>Admin: {dbUser.is_admin ? "Yes" : "No"}</div>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium text-yellow-800 mb-2">Status</h4>
            <Badge variant={loading ? "secondary" : error ? "destructive" : "default"}>
              {loading ? "Loading" : error ? "Error" : "Ready"}
            </Badge>
            {error && <div className="text-sm text-red-600 mt-1">{error}</div>}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" onClick={refreshUser} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh User
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
