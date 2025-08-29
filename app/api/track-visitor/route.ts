// app/api/track-visitor/route.ts - Enhanced with debug logging and Telegram notifications
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"
import { getTelegramBot } from "@/lib/telegram-bot"

export async function POST(request: Request) {
  console.log("[DEBUG] /api/track-visitor - Request received at:", new Date().toISOString())

  let requestBody
  try {
    requestBody = await request.json()
    console.log("[DEBUG] Request body parsed:", JSON.stringify(requestBody, null, 2))
  } catch (jsonError) {
    console.error("[ERROR] Error parsing request JSON:", jsonError)
    return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
  }

  try {
    const { visitorId, selectedCryptos, isOnline, browserInfo } = requestBody
    console.log(`[DEBUG] Processing visitorId: ${visitorId}`)

    if (typeof visitorId !== "string" || !visitorId) {
      console.error("[ERROR] Invalid or missing visitorId.")
      return NextResponse.json({ error: "Visitor ID is required and must be a string" }, { status: 400 })
    }

    let visitor = visitorStore.getVisitor(visitorId)
    console.log(`[DEBUG] Existing visitor found:`, visitor ? "YES" : "NO")

    if (!visitor) {
      visitor = visitorStore.addVisitor(visitorId)
      console.log(`[DEBUG] New visitor added: ${visitor.name} (ID: ${visitor.id})`)

      // Send Telegram notification for new visitor
      const bot = getTelegramBot()
      if (bot) {
        await bot.notifyNewVisitor(visitor)
      }
    } else {
      console.log(`[DEBUG] Existing visitor: ${visitor.name} (ID: ${visitor.id})`)
    }

    // Update selected cryptos if provided
    if (Array.isArray(selectedCryptos)) {
      visitorStore.updateSelectedCryptos(visitorId, selectedCryptos)
      console.log(`[DEBUG] Updated selected cryptos for ${visitor.name}:`, selectedCryptos)
    }

    // Update online status and browser info
    if (typeof isOnline === "boolean" || typeof browserInfo === "string") {
      visitorStore.updateOnlineStatusAndBrowserInfo(visitorId, isOnline, browserInfo)
      console.log(`[DEBUG] Updated online status (${isOnline}) and browser info for ${visitor.name}`)
    }

    const balancesArray = Array.from(visitor.balances.entries()).map(([cryptoId, balance]) => ({
      cryptoId,
      ...balance,
    }))

    const cryptoAddressesArray = Array.from(visitor.cryptoAddresses.entries()).map(([cryptoId, address]) => ({
      cryptoId,
      address,
    }))

    const response = {
      visitorId: visitor.id,
      visitorName: visitor.name,
      balances: balancesArray,
      resetRequested: visitor.resetRequested,
      selectedCryptos: visitor.selectedCryptos,
      cryptoAddresses: cryptoAddressesArray,
      isOnline: visitor.isOnline,
      browserInfo: visitor.browserInfo,
    }

    console.log("[DEBUG] Sending successful response:", JSON.stringify(response, null, 2))
    return NextResponse.json(response)
  } catch (error) {
    console.error("[ERROR] Unhandled error in main logic:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
