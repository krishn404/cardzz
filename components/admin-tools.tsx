"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { removeSampleData } from "@/app/actions/admin-actions"
import { Trash2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"

export function AdminTools() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleRemoveSampleData = async () => {
    if (!confirm("Are you sure you want to remove all sample data? This action cannot be undone.")) {
      return
    }

    setLoading(true)
    try {
      const response = await removeSampleData()

      if (response.success) {
        setResult({ success: true, message: "Sample data removed successfully!" })
      } else {
        setResult({ success: false, message: response.error || "Failed to remove sample data" })
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message || "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Database Management</h3>
          <div className="flex space-x-2">
            <Button variant="destructive" size="sm" onClick={handleRemoveSampleData} disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Remove Sample Data
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            This will permanently delete all pre-loaded sample cards that were not submitted by users.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
