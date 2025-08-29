// app/api/telegram-setup/route.ts - Helper to set webhook
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { webhookUrl } = await request.json()
    const botToken = "7611763835:AAHr7JLITT8QXliVhVwtOnegiyid0feeM6o"

    if (!webhookUrl) {
      return NextResponse.json({ error: "webhookUrl is required" }, { status: 400 })
    }

    // Set the webhook
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
      }),
    })

    const result = await response.json()

    if (result.ok) {
      return NextResponse.json({
        success: true,
        message: "Webhook set successfully",
        webhook_url: webhookUrl,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.description,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error setting webhook:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const botToken = "7611763835:AAHr7JLITT8QXliVhVwtOnegiyid0feeM6o"

    // Get webhook info
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const result = await response.json()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error getting webhook info:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
