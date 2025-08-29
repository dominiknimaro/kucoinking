// app/api/admin/reset-session/route.ts
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"

export async function POST(request: Request) {
  try {
    const { visitorId } = await request.json()

    if (!visitorId) {
      return NextResponse.json({ error: "Visitor ID is required" }, { status: 400 })
    }

    const resetSuccess = visitorStore.markVisitorForReset(visitorId)

    if (resetSuccess) {
      console.log(`Admin: Visitor ${visitorId} marked for session reset.`)
      return NextResponse.json({ success: true, message: `Session for visitor ${visitorId} marked for reset.` })
    } else {
      console.warn(`Admin: Visitor ${visitorId} not found for reset.`)
      return NextResponse.json({ success: false, message: `Visitor ${visitorId} not found.` }, { status: 404 })
    }
  } catch (error) {
    console.error("Error in admin reset session API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
