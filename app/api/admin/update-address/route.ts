// app/api/admin/update-address/route.ts
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"

export async function POST(request: Request) {
  console.log("[/api/admin/update-address] Request received.")
  try {
    const { visitorId, cryptoId, address } = await request.json()
    console.log(
      `[/api/admin/update-address] Received: visitorId=${visitorId}, cryptoId=${cryptoId}, address=${address}`,
    )

    if (!visitorId || !cryptoId || typeof address !== "string") {
      console.error("[/api/admin/update-address] Invalid input: visitorId, cryptoId, and address are required.")
      return NextResponse.json(
        { error: "Invalid input: visitorId, cryptoId, and address are required." },
        { status: 400 },
      )
    }

    const updatedVisitor = visitorStore.updateCryptoAddress(visitorId, cryptoId, address)

    if (updatedVisitor) {
      console.log(`[/api/admin/update-address] Admin: Updated address for ${cryptoId} for visitor ${visitorId}.`)
      return NextResponse.json({ success: true, message: `Address for ${cryptoId} updated.` })
    } else {
      console.warn(
        `[/api/admin/update-address] Failed to update address: Visitor ${visitorId} or crypto ${cryptoId} not found in store.`,
      )
      return NextResponse.json(
        { success: false, message: "Failed to update address or visitor not found." },
        { status: 404 },
      )
    }
  } catch (error) {
    console.error("[/api/admin/update-address] Error in admin update address API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
