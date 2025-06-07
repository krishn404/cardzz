"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, RefreshCw } from "lucide-react"

interface TestResult {
  test: string
  status: "passed" | "failed" | "warning"
  message: string
  details?: string
}

export default function TestDbPage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    const testResults: TestResult[] = []

    // Test 1: Basic connection
    try {
      const { data, error } = await supabase.from("users").select("count").single()
      testResults.push({
        test: "Database Connection",
        status: error ? "failed" : "passed",
        message: error ? error.message : "Connected successfully",
        details: error ? `Error code: ${error.code}` : "Supabase client initialized and connected",
      })
    } catch (error: any) {
      testResults.push({
        test: "Database Connection",
        status: "failed",
        message: error.message || "Unknown connection error",
        details: error.stack,
      })
    }

    // Test 2: Check if tables exist
    const tables = ["users", "cards", "referrals", "clicks"]
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select("*").limit(1)
        testResults.push({
          test: `Table: ${table}`,
          status: error ? "failed" : "passed",
          message: error ? error.message : `Table exists and accessible`,
          details: error ? `Error code: ${error.code}` : `Found ${data?.length || 0} records (limited to 1)`,
        })
      } catch (error: any) {
        testResults.push({
          test: `Table: ${table}`,
          status: "failed",
          message: error.message || "Unknown table error",
          details: error.stack,
        })
      }
    }

    // Test 3: Check for required columns
    try {
      const { data, error } = await supabase.from("cards").select("status, submitted_by").limit(1)
      testResults.push({
        test: "Cards Required Columns",
        status: error ? "failed" : "passed",
        message: error ? error.message : "Status and submitted_by columns exist",
        details: error ? `Error code: ${error.code}` : "Required columns for user submissions are present",
      })
    } catch (error: any) {
      testResults.push({
        test: "Cards Required Columns",
        status: "failed",
        message: error.message || "Column check failed",
        details: error.stack,
      })
    }

    // Test 4: Check sample data
    try {
      const { data, error } = await supabase.from("cards").select("*").eq("status", "approved")
      testResults.push({
        test: "Sample Cards Data",
        status: error ? "failed" : data && data.length > 0 ? "passed" : "warning",
        message: error
          ? error.message
          : data && data.length > 0
            ? `Found ${data.length} approved cards`
            : "No sample cards found",
        details: error
          ? `Error code: ${error.code}`
          : data
            ? `Cards: ${data.map((c) => c.name).join(", ")}`
            : "Consider adding sample data",
      })
    } catch (error: any) {
      testResults.push({
        test: "Sample Cards Data",
        status: "failed",
        message: error.message || "Data check failed",
        details: error.stack,
      })
    }

    // Test 5: Check environment variables
    const envVars = [
      { name: "NEXT_PUBLIC_SUPABASE_URL", value: process.env.NEXT_PUBLIC_SUPABASE_URL },
      { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
      { name: "NEXT_PUBLIC_FIREBASE_API_KEY", value: process.env.NEXT_PUBLIC_FIREBASE_API_KEY },
      { name: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", value: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN },
      { name: "NEXT_PUBLIC_FIREBASE_PROJECT_ID", value: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID },
    ]

    envVars.forEach((envVar) => {
      testResults.push({
        test: `Env: ${envVar.name}`,
        status: envVar.value ? "passed" : "failed",
        message: envVar.value ? "Set correctly" : "Missing or empty",
        details: envVar.value ? `Value: ${envVar.value.substring(0, 20)}...` : "Check your .env.local file",
      })
    })

    // Test 6: Test RLS policies
    try {
      const { data, error } = await supabase.from("cards").select("*").eq("status", "approved").limit(1)
      testResults.push({
        test: "RLS Policies",
        status: error ? "failed" : "passed",
        message: error ? error.message : "RLS policies working correctly",
        details: error ? `Error code: ${error.code}` : "Can read approved cards without authentication",
      })
    } catch (error: any) {
      testResults.push({
        test: "RLS Policies",
        status: "failed",
        message: error.message || "RLS test failed",
        details: error.stack,
      })
    }

    setResults(testResults)
    setLoading(false)
  }

  const addSampleData = async () => {
    setLoading(true)
    try {
      const sampleCards = [
        {
          name: "Chase Sapphire Preferred",
          slug: "chase-sapphire-preferred",
          bank: "Chase",
          category: "Travel",
          eligibility: "Good Credit (670-749)",
          benefits:
            "2x points on travel and dining, 60,000 bonus points after spending $4,000 in first 3 months. Transfer points to airline and hotel partners at 1:1 ratio. No foreign transaction fees.",
          referral_url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
          joining_fee: 0,
          annual_fee: 95,
          status: "approved",
          image_url: "/placeholder.svg?height=200&width=300",
        },
        {
          name: "Capital One Venture X",
          slug: "capital-one-venture-x",
          bank: "Capital One",
          category: "Travel",
          eligibility: "Excellent Credit (750+)",
          benefits:
            "2x miles on everything, $300 annual travel credit, 75,000 bonus miles after spending $4,000 in first 3 months. Priority Pass lounge access and TSA PreCheck credit.",
          referral_url: "https://www.capitalone.com/credit-cards/venture-x/",
          joining_fee: 0,
          annual_fee: 395,
          status: "approved",
          image_url: "/placeholder.svg?height=200&width=300",
        },
        {
          name: "Citi Double Cash",
          slug: "citi-double-cash",
          bank: "Citi",
          category: "Cashback",
          eligibility: "Good Credit (670-749)",
          benefits:
            "2% cash back on all purchases (1% when you buy, 1% when you pay). No annual fee, no rotating categories to track. Balance transfer intro APR for 18 months.",
          referral_url: "https://www.citi.com/credit-cards/citi-double-cash-credit-card",
          joining_fee: 0,
          annual_fee: 0,
          status: "approved",
          image_url: "/placeholder.svg?height=200&width=300",
        },
      ]

      const { data, error } = await supabase.from("cards").upsert(sampleCards, { onConflict: "slug" })

      if (error) throw error

      alert("Sample data added successfully!")
      runTests() // Refresh tests
    } catch (error: any) {
      alert(`Error adding sample data: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runTests()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <XCircle className="h-5 w-5 text-yellow-600" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <XCircle className="h-5 w-5 text-gray-600" />
    }
  }

  const getAlertVariant = (status: string) => {
    switch (status) {
      case "passed":
        return "default"
      case "warning":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-6 w-6" />
            <span>Cardly Database & Environment Test</span>
          </CardTitle>
          <p className="text-gray-600">
            This page tests your database connection, tables, environment variables, and overall setup.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex space-x-4">
              <Button onClick={runTests} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                {loading ? "Running Tests..." : "Run Tests"}
              </Button>
              <Button onClick={addSampleData} disabled={loading} variant="outline">
                Add Sample Data
              </Button>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => (
                <Alert key={index} variant={getAlertVariant(result.status)}>
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <strong>{result.test}:</strong>
                        <span
                          className={`font-medium ${
                            result.status === "passed"
                              ? "text-green-700"
                              : result.status === "warning"
                                ? "text-yellow-700"
                                : "text-red-700"
                          }`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <AlertDescription className="mt-1">
                        {result.message}
                        {result.details && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-sm text-gray-600">Show details</summary>
                            <pre className="mt-1 text-xs bg-gray-100 p-2 rounded overflow-auto">{result.details}</pre>
                          </details>
                        )}
                      </AlertDescription>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>

            {results.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• If all tests pass, your app should work correctly</li>
                  <li>• If environment variables fail, check your .env.local file</li>
                  <li>• If database tests fail, run the SQL cleanup script in Supabase</li>
                  <li>• If no sample data, click "Add Sample Data" button</li>
                  <li>
                    • Visit the homepage to see your cards:{" "}
                    <a href="/" className="underline">
                      Go to Homepage
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
