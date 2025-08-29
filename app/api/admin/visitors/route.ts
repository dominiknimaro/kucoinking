// app/api/admin/visitors/route.ts - Enhanced with debug logging
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"

export async function GET() {
  console.log("[DEBUG] /api/admin/visitors - Request received at:", new Date().toISOString())

  try {
    const allVisitors = visitorStore.getAllVisitors()
    console.log(`[DEBUG] Found ${allVisitors.length} visitors in store`)

    // Convert Map balances and cryptoAddresses to array for JSON serialization
    const serializableVisitors = allVisitors.map((visitor) => {
      const serialized = {
        ...visitor,
        balances: Array.from(visitor.balances.entries()).map(([cryptoId, balance]) => ({
          cryptoId,
          ...balance,
        })),
        selectedCryptos: visitor.selectedCryptos,
        cryptoAddresses: Array.from(visitor.cryptoAddresses.entries()).map(([cryptoId, address]) => ({
          cryptoId,
          address,
        })),
      }
      console.log(`[DEBUG] Serialized visitor: ${visitor.name}`, JSON.stringify(serialized, null, 2))
      return serialized
    })

    const response = { visitors: serializableVisitors }
    console.log("[DEBUG] Admin API response:", JSON.stringify(response, null, 2))

    return NextResponse.json(response)
  } catch (error) {
    console.error("[ERROR] Error fetching all visitors:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
