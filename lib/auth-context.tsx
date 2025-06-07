"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User as FirebaseUser, onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import type { User } from "./types"
import { supabase } from "./supabase"

interface AuthContextType {
  user: FirebaseUser | null
  dbUser: User | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  dbUser: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [dbUser, setDbUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const setSupabaseAuth = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      // Get the Firebase ID token and set it for Supabase
      const token = await firebaseUser.getIdToken()
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      })
    } else {
      // Clear Supabase session
      await supabase.auth.signOut()
    }
  }

  const createOrGetUser = async (firebaseUser: FirebaseUser) => {
    try {
      console.log("Creating/getting user for:", firebaseUser.uid)

      // Set the auth session first
      await setSupabaseAuth(firebaseUser)

      // Try to get existing user first
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("firebase_uid", firebaseUser.uid)
        .single()

      if (existingUser) {
        console.log("Found existing user:", existingUser)
        return existingUser
      }

      if (fetchError && fetchError.code !== "PGRST116") {
        // PGRST116 is "not found" error, which is expected for new users
        throw fetchError
      }

      console.log("Creating new user...")

      // Use the service role client for user creation to bypass RLS
      const { data: newUser, error: insertError } = await fetch("/api/auth/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: firebaseUser.uid,
          name: firebaseUser.displayName || "Anonymous",
          email: firebaseUser.email || "",
        }),
      }).then((res) => res.json())

      if (insertError) {
        throw new Error(insertError)
      }

      console.log("Created new user:", newUser)
      return newUser
    } catch (error: any) {
      console.error("Error in createOrGetUser:", error)
      throw error
    }
  }

  const refreshUser = async () => {
    if (user) {
      try {
        const userData = await createOrGetUser(user)
        setDbUser(userData)
        setError(null)
      } catch (error: any) {
        console.error("Error refreshing user:", error)
        setError(error.message)
      }
    }
  }

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Wait for auth to be ready
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid)
      setUser(firebaseUser)
      setError(null)

      if (firebaseUser) {
        try {
          const userData = await createOrGetUser(firebaseUser)
          setDbUser(userData)
        } catch (error: any) {
          console.error("Error managing user:", error)
          setError(error.message)
          setDbUser(null)
        }
      } else {
        await setSupabaseAuth(null)
        setDbUser(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, dbUser, loading, error, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
