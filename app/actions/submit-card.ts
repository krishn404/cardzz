"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

interface CardSubmissionData {
  name: string
  bank: string
  category: string
  eligibility: string
  benefits: string
  referral_url: string
  joining_fee: number
  annual_fee: number
  description?: string
  firebase_uid: string
}

export async function submitCard(data: CardSubmissionData) {
  try {
    console.log("🚀 Server action: submitCard called with data:", {
      name: data.name,
      bank: data.bank,
      category: data.category,
      firebase_uid: data.firebase_uid,
    })

    // Validate required fields
    if (!data.name?.trim()) {
      throw new Error("Card name is required")
    }
    if (!data.bank?.trim()) {
      throw new Error("Bank is required")
    }
    if (!data.category?.trim()) {
      throw new Error("Category is required")
    }
    if (!data.eligibility?.trim()) {
      throw new Error("Eligibility is required")
    }
    if (!data.benefits?.trim()) {
      throw new Error("Benefits description is required")
    }
    if (!data.referral_url?.trim()) {
      throw new Error("Referral URL is required")
    }
    if (!data.firebase_uid?.trim()) {
      throw new Error("User authentication required")
    }

    // Validate URL format
    try {
      new URL(data.referral_url)
    } catch {
      throw new Error("Invalid referral URL format")
    }

    // First, get the user from the database using Firebase UID
    console.log("🔍 Looking up user with Firebase UID:", data.firebase_uid)
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, name, email")
      .eq("firebase_uid", data.firebase_uid)
      .single()

    if (userError) {
      console.error("❌ User lookup error:", userError)
      throw new Error(`User lookup failed: ${userError.message}`)
    }

    if (!user) {
      console.error("❌ User not found for Firebase UID:", data.firebase_uid)
      throw new Error("User not found. Please sign in again.")
    }

    console.log("✅ Found user:", { id: user.id, name: user.name, email: user.email })

    // Generate slug with better uniqueness
    const baseSlug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    let slug = baseSlug
    let counter = 1

    // Check for existing slugs and make unique if necessary
    while (true) {
      console.log("🔍 Checking slug availability:", slug)
      const { data: existingCard, error: checkError } = await supabaseAdmin
        .from("cards")
        .select("id")
        .eq("slug", slug)
        .single()

      if (checkError && checkError.code === "PGRST116") {
        // No existing card found, slug is available
        console.log("✅ Slug is available:", slug)
        break
      } else if (checkError) {
        console.error("❌ Error checking slug:", checkError)
        throw new Error(`Slug validation failed: ${checkError.message}`)
      } else {
        // Slug exists, try with counter
        counter++
        slug = `${baseSlug}-${counter}`
        console.log("⚠️ Slug exists, trying:", slug)
      }
    }

    // Prepare card data with all required fields
    const cardData = {
      name: data.name.trim(),
      slug,
      bank: data.bank.trim(),
      category: data.category.trim(),
      eligibility: data.eligibility.trim(),
      benefits: data.benefits.trim(),
      referral_url: data.referral_url.trim(),
      joining_fee: Number(data.joining_fee) || 0,
      annual_fee: Number(data.annual_fee) || 0,
      description: data.description?.trim() || null,
      submitted_by: user.id,
      status: "approved", // Set to approved for immediate display
      image_url: "/placeholder.svg?height=200&width=300",
      created_at: new Date().toISOString(),
    }

    console.log("💾 Inserting card data:", {
      ...cardData,
      benefits: cardData.benefits.substring(0, 50) + "...",
    })

    // Insert the card using admin client with explicit column specification
    const { data: newCard, error: insertError } = await supabaseAdmin
      .from("cards")
      .insert([cardData])
      .select(`
        id,
        name,
        slug,
        bank,
        category,
        eligibility,
        benefits,
        referral_url,
        joining_fee,
        annual_fee,
        status,
        created_at,
        submitted_by
      `)
      .single()

    if (insertError) {
      console.error("❌ Insert error:", insertError)
      throw new Error(`Failed to save card: ${insertError.message}`)
    }

    if (!newCard) {
      console.error("❌ No card returned after insert")
      throw new Error("Card was not created successfully")
    }

    console.log("✅ Card inserted successfully:", {
      id: newCard.id,
      name: newCard.name,
      slug: newCard.slug,
      status: newCard.status,
    })

    // Verify the card was actually saved by fetching it back
    console.log("🔍 Verifying card was saved...")
    const { data: verifyCard, error: verifyError } = await supabaseAdmin
      .from("cards")
      .select("id, name, status")
      .eq("id", newCard.id)
      .single()

    if (verifyError || !verifyCard) {
      console.error("❌ Verification failed:", verifyError)
      throw new Error("Card submission verification failed")
    }

    console.log("✅ Card verification successful:", verifyCard)

    // Revalidate the homepage to show new card immediately
    revalidatePath("/")
    revalidatePath("/my-submissions")

    return {
      success: true,
      card: newCard,
      message: "Card submitted successfully and is now live!",
    }
  } catch (error: any) {
    console.error("❌ Server action error:", error)
    return {
      success: false,
      error: error.message || "Failed to submit card",
      details: error.stack,
    }
  }
}

// Helper function to validate card data
export async function validateCardData(data: Partial<CardSubmissionData>) {
  const errors: Record<string, string> = {}

  if (!data.name?.trim()) {
    errors.name = "Card name is required"
  } else if (data.name.length < 3) {
    errors.name = "Card name must be at least 3 characters"
  } else if (data.name.length > 100) {
    errors.name = "Card name must be less than 100 characters"
  }

  if (!data.bank?.trim()) {
    errors.bank = "Bank selection is required"
  }

  if (!data.category?.trim()) {
    errors.category = "Category selection is required"
  }

  if (!data.eligibility?.trim()) {
    errors.eligibility = "Eligibility selection is required"
  }

  if (!data.benefits?.trim()) {
    errors.benefits = "Benefits description is required"
  } else if (data.benefits.length < 50) {
    errors.benefits = "Benefits description must be at least 50 characters"
  } else if (data.benefits.length > 2000) {
    errors.benefits = "Benefits description must be less than 2000 characters"
  }

  if (!data.referral_url?.trim()) {
    errors.referral_url = "Referral URL is required"
  } else {
    try {
      const url = new URL(data.referral_url)
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.referral_url = "URL must use HTTP or HTTPS protocol"
      }
    } catch {
      errors.referral_url = "Please enter a valid URL"
    }
  }

  if (data.joining_fee && (data.joining_fee < 0 || data.joining_fee > 10000)) {
    errors.joining_fee = "Joining fee must be between $0 and $10,000"
  }

  if (data.annual_fee && (data.annual_fee < 0 || data.annual_fee > 10000)) {
    errors.annual_fee = "Annual fee must be between $0 and $10,000"
  }

  return errors
}
