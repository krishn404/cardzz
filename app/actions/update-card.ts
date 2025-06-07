"use server"

import { supabaseAdmin } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

interface CardUpdateData {
  id: string
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

export async function updateCard(data: CardUpdateData) {
  try {
    console.log("🚀 Server action: updateCard called with data:", {
      id: data.id,
      name: data.name,
      bank: data.bank,
      category: data.category,
      firebase_uid: data.firebase_uid,
    })

    // Validate required fields
    if (!data.id?.trim()) {
      throw new Error("Card ID is required")
    }
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

    // Check if the card exists and belongs to the user
    const { data: existingCard, error: cardError } = await supabaseAdmin
      .from("cards")
      .select("id, submitted_by, slug")
      .eq("id", data.id)
      .single()

    if (cardError) {
      console.error("❌ Card lookup error:", cardError)
      throw new Error(`Card not found: ${cardError.message}`)
    }

    if (existingCard.submitted_by !== user.id) {
      throw new Error("You can only edit your own cards")
    }

    // Prepare update data
    const updateData = {
      name: data.name.trim(),
      bank: data.bank.trim(),
      category: data.category.trim(),
      eligibility: data.eligibility.trim(),
      benefits: data.benefits.trim(),
      referral_url: data.referral_url.trim(),
      joining_fee: Number(data.joining_fee) || 0,
      annual_fee: Number(data.annual_fee) || 0,
      description: data.description?.trim() || null,
    }

    console.log("💾 Updating card data:", {
      ...updateData,
      benefits: updateData.benefits.substring(0, 50) + "...",
    })

    // Update the card
    const { data: updatedCard, error: updateError } = await supabaseAdmin
      .from("cards")
      .update(updateData)
      .eq("id", data.id)
      .eq("submitted_by", user.id) // Double-check ownership
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

    if (updateError) {
      console.error("❌ Update error:", updateError)
      throw new Error(`Failed to update card: ${updateError.message}`)
    }

    if (!updatedCard) {
      console.error("❌ No card returned after update")
      throw new Error("Card was not updated successfully")
    }

    console.log("✅ Card updated successfully:", {
      id: updatedCard.id,
      name: updatedCard.name,
      slug: updatedCard.slug,
      status: updatedCard.status,
    })

    // Revalidate relevant pages
    revalidatePath("/")
    revalidatePath("/my-submissions")
    revalidatePath("/explore")
    if (updatedCard.slug) {
      revalidatePath(`/cards/${updatedCard.slug}`)
    }

    return {
      success: true,
      card: updatedCard,
      message: "Card updated successfully!",
    }
  } catch (error: any) {
    console.error("❌ Server action error:", error)
    return {
      success: false,
      error: error.message || "Failed to update card",
      details: error.stack,
    }
  }
}

export async function deleteCard(cardId: string, firebase_uid: string) {
  try {
    console.log("🚀 Server action: deleteCard called with:", { cardId, firebase_uid })

    if (!cardId?.trim()) {
      throw new Error("Card ID is required")
    }
    if (!firebase_uid?.trim()) {
      throw new Error("User authentication required")
    }

    // Get the user from the database using Firebase UID
    const { data: user, error: userError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("firebase_uid", firebase_uid)
      .single()

    if (userError || !user) {
      throw new Error("User not found. Please sign in again.")
    }

    // Check if the card exists and belongs to the user
    const { data: existingCard, error: cardError } = await supabaseAdmin
      .from("cards")
      .select("id, submitted_by, name, slug")
      .eq("id", cardId)
      .single()

    if (cardError) {
      throw new Error(`Card not found: ${cardError.message}`)
    }

    if (existingCard.submitted_by !== user.id) {
      throw new Error("You can only delete your own cards")
    }

    console.log("🗑️ Deleting card:", { id: existingCard.id, name: existingCard.name })

    // Delete the card (this will cascade delete referrals and clicks due to foreign key constraints)
    const { error: deleteError } = await supabaseAdmin
      .from("cards")
      .delete()
      .eq("id", cardId)
      .eq("submitted_by", user.id) // Double-check ownership

    if (deleteError) {
      console.error("❌ Delete error:", deleteError)
      throw new Error(`Failed to delete card: ${deleteError.message}`)
    }

    console.log("✅ Card deleted successfully")

    // Revalidate relevant pages
    revalidatePath("/")
    revalidatePath("/my-submissions")
    revalidatePath("/explore")

    return {
      success: true,
      message: "Card deleted successfully!",
    }
  } catch (error: any) {
    console.error("❌ Delete action error:", error)
    return {
      success: false,
      error: error.message || "Failed to delete card",
    }
  }
}
