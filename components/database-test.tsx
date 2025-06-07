"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, TestTube } from "lucide-react"

export function DatabaseTest() {
  const { user, dbUser } = useAuth()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<Array<{ test: string; status: "pass" | "fail"; message: string }>>([])

  const runTests = async () => {
    setTesting(true)
    const testResults: Array<{ test: string; status: "pass" | "fail"; message: string }> = []

    try {
      // Test 1: Database connection
      console.log("🧪 Testing database connection...")
      const { data: connectionTest, error: connectionError } = await supabase.from("cards").select("count").limit(1)

      testResults.push({
        test: "Database Connection",
        status: connectionError ? "fail" : "pass",
        message: connectionError ? connectionError.message : "Connected successfully",
      })

      // Test 2: Card insertion (if user is logged in)
      if (user && dbUser) {
        console.log("🧪 Testing card insertion...")
        const testCard = {
          name: `Test Card ${Date.now()}`,
          slug: `test-card-${Date.now()}`,
          bank: "Test Bank",
          category: "Test",
          eligibility: "Test Credit",
          benefits: "This is a test card for database validation. It should be automatically deleted after testing.",
          referral_url: "https://example.com/test",
          joining_fee: 0,
          annual_fee: 0,
          submitted_by: dbUser.id,
          status: "approved",
          image_url: "/placeholder.svg?height=200&width=300",
        }

        const { data: insertedCard, error: insertError } = await supabase
          .from("cards")
          .insert(testCard)
          .select()
          .single()

        if (insertError) {
          testResults.push({
            test: "Card Insertion",
            status: "fail",
            message: insertError.message,
          })
        } else {
          testResults.push({
            test: "Card Insertion",
            status: "pass",
            message: "Card inserted successfully",
          })

          // Test 3: Card retrieval
          console.log("🧪 Testing card retrieval...")
          const { data: retrievedCard, error: retrieveError } = await supabase
            .from("cards")
            .select("*")
            .eq("id", insertedCard.id)
            .single()

          testResults.push({
            test: "Card Retrieval",
            status: retrieveError ? "fail" : "pass",
            message: retrieveError ? retrieveError.message : "Card retrieved successfully",
          })

          // Clean up test card
          console.log("🧹 Cleaning up test card...")
          await supabase.from("cards").delete().eq("id", insertedCard.id)
        }
      } else {
        testResults.push({
          test: "Card Insertion",
          status: "fail",
          message: "User not authenticated - cannot test insertion",
        })
      }

      // Test 4: Card listing
      console.log("🧪 Testing card listing...")
      const { data: cardList, error: listError } = await supabase.from("cards").select("id, name, status").limit(5)

      testResults.push({
        test: "Card Listing",
        status: listError ? "fail" : "pass",
        message: listError ? listError.message : `Retrieved ${cardList?.length || 0} cards`,
      })

      setResults(testResults)
    } catch (error: any) {
      console.error("❌ Test error:", error)
      testResults.push({
        test: "General Test",
        status: "fail",
        message: error.message,
      })
      setResults(testResults)
    } finally {
      setTesting(false)
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null // Don't show in production
  }

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-800">
          <Database className="h-5 w-5" />
          <span>Database Test Suite (Development Only)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button size="sm" onClick={runTests} disabled={testing}>
            <TestTube className={`h-4 w-4 mr-1 ${testing ? "animate-pulse" : ""}`} />
            {testing ? "Running Tests..." : "Run Database Tests"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            {results.map((result, index) => (
              <Alert key={index} variant={result.status === "fail" ? "destructive" : "default"}>
                <div className="flex items-center space-x-2">
                  {result.status === "pass" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <strong>{result.test}:</strong> {result.message}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
