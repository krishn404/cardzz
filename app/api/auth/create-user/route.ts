import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firebase_uid, name, email } = body

    if (!firebase_uid || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("*").eq("firebase_uid", firebase_uid).single()

    if (existingUser) {
      return NextResponse.json(existingUser)
    }

    // Create new user using the anon key (should work with proper RLS)
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        firebase_uid,
        name: name || "Anonymous",
        email,
        is_admin: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(newUser)
  } catch (error: any) {
    console.error("API error creating user:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
