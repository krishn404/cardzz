import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data, error } = await supabaseAdmin.from("cards").insert(body).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body

    const { data, error } = await supabaseAdmin.from("cards").update(updateData).eq("id", id).select().single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Card ID required" }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from("cards").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
