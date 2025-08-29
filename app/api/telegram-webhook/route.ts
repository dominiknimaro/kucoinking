// app/api/telegram-webhook/route.ts
import { NextResponse } from "next/server"
import { initTelegramBot } from "@/lib/telegram-bot"

export async function POST(request: Request) {
  try {
    // Use your bot token directly
    const botToken = "7611763835:AAHr7JLITT8QXliVhVwtOnegiyid0feeM6o"

    const update = await request.json()
    console.log("[TELEGRAM] Received update:", JSON.stringify(update, null, 2))

    const bot = initTelegramBot(botToken)
    await bot.handleUpdate(update)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[TELEGRAM] Error handling webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Telegram webhook is active",
    timestamp: new Date().toISOString(),
  })
}
