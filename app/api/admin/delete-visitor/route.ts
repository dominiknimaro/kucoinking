// app/api/admin/delete-visitor/route.ts
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"

export async function POST(request: Request) {
  try {
    const { visitorId } = await request.json()

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 })
    }

    const deleted = visitorStore.deleteVisitor(visitorId)

    if (deleted) {
      console.log(`Admin: Visitor ${visitorId} successfully deleted.`)
      return NextResponse.json({ success: true, message: `Visitor ${visitorId} deleted.` })
    } else {
      console.warn(`Admin: Visitor ${visitorId} not found for deletion.`)
      return NextResponse.json({ success: false, message: `Visitor ${visitorId} not found.` }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in admin delete visitor API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
