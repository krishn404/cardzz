"use server"

import { supabaseAdmin } from "@/lib/supabase-server"

export async function removeSampleData() {
  try {
    const { error } = await supabaseAdmin.from("cards").delete().eq("status", "approved").is("submitted_by", null)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("Error removing sample data:", error)
    return { success: false, error: error.message }
  }
}
