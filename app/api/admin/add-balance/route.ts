// app/api/admin/add-balance/route.ts
import { NextResponse } from "next/server"
import { visitorStore } from "@/lib/visitor-store"
import { cryptocurrencies } from "@/data/cryptocurrencies"
import { getMockCryptoPrices } from "@/lib/mock-crypto-prices" // Import mock prices

export async function POST(request: Request) {
  try {
    const { visitorId, cryptoId, quantity } = await request.json()

    if (!visitorId || !cryptoId || typeof quantity !== "number" || quantity <= 0) {
      return NextResponse.json(
        { error: "Invalid input: visitorId, cryptoId, and a positive quantity are required." },
        { status: 400 },
      )
    }

    const visitor = visitorStore.getVisitor(visitorId)
    if (!visitor) {
      return NextResponse.json({ error: `Visitor with ID ${visitorId} not found.` }, { status: 404 })
    }

    const crypto = cryptocurrencies.find((c) => c.id === cryptoId)
    if (!crypto) {
      return NextResponse.json({ error: `Cryptocurrency with ID ${cryptoId} not found.` }, { status: 404 })
    }

    const mockPrices = getMockCryptoPrices()
    const currentPrice = mockPrices.get(cryptoId)

    if (currentPrice === undefined) {
      return NextResponse.json({ error: `Price for ${crypto.name} not found.` }, { status: 404 })
    }

    // Calculate CHF balance based on quantity and mock current price
    const chfBalance = (quantity * currentPrice).toFixed(2)
    const percentageChange = "0.00" // Percentage change is for market movement, not admin additions

    const updatedVisitor = visitorStore.updateBalance(
      visitorId,
      cryptoId,
      quantity.toFixed(8), // Store quantity with more precision
      chfBalance, // Use chfBalance here
      percentageChange,
    )

    if (updatedVisitor) {
      console.log(
        `Admin: Added ${quantity} ${crypto.symbol} (approx. ${chfBalance} CHF) to visitor ${visitor.name} (${visitorId}).`,
      )
      return NextResponse.json({ success: true, message: `Balance added for ${crypto.name}.` })
    } else {
      return NextResponse.json({ success: false, message: "Failed to update balance." }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in admin add balance API:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
