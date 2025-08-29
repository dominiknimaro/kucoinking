"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"

interface Cryptocurrency {
  id: string
  name: string
  symbol: string
  icon: string
  color: string
  category: "major" | "defi" | "layer1" | "stablecoin" | "meme"
  price?: string
}

const cryptocurrencies: Cryptocurrency[] = [
  // Major Cryptocurrencies
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", icon: "₿", color: "#f7931a", category: "major", price: "$43,250" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", icon: "Ξ", color: "#627eea", category: "major", price: "$2,650" },
  { id: "bnb", name: "BNB", symbol: "BNB", icon: "⬢", color: "#f3ba2f", category: "major", price: "$315" },
  { id: "solana", name: "Solana", symbol: "SOL", icon: "◎", color: "#9945ff", category: "layer1", price: "$98" },
  { id: "xrp", name: "XRP", symbol: "XRP", icon: "✕", color: "#23292f", category: "major", price: "$0.52" },
  { id: "cardano", name: "Cardano", symbol: "ADA", icon: "₳", color: "#0033ad", category: "layer1", price: "$0.45" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", icon: "▲", color: "#e84142", category: "layer1", price: "$27" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", icon: "●", color: "#e6007a", category: "layer1", price: "$7.2" },
  { id: "polygon", name: "Polygon", symbol: "MATIC", icon: "⬟", color: "#8247e5", category: "layer1", price: "$0.85" },
  { id: "chainlink", name: "Chainlink", icon: "⬢", color: "#375bd2", category: "defi", price: "$14.5" },
  { id: "litecoin", name: "Litecoin", symbol: "LTC", icon: "Ł", color: "#bfbbbb", category: "major", price: "$73" },
  { id: "cosmos", name: "Cosmos", symbol: "ATOM", icon: "⚛", color: "#2e3148", category: "layer1", price: "$8.1" },
  { id: "algorand", name: "Algorand", symbol: "ALGO", icon: "◯", color: "#000000", category: "layer1", price: "$0.18" },
  { id: "tezos", name: "Tezos", symbol: "XTZ", icon: "ꜩ", color: "#2c7df7", category: "layer1", price: "$0.92" },
  { id: "stellar", name: "Stellar", symbol: "XLM", icon: "✦", color: "#7d00ff", category: "major", price: "$0.11" },

  // Stablecoins
  { id: "tether", name: "Tether", symbol: "USDT", icon: "₮", color: "#26a17b", category: "stablecoin", price: "$1.00" },
  { id: "usdc", name: "USD Coin", symbol: "USDC", icon: "$", color: "#2775ca", category: "stablecoin", price: "$1.00" },
  { id: "dai", name: "Dai", symbol: "DAI", icon: "◈", color: "#f5ac37", category: "stablecoin", price: "$1.00" },

  // DeFi Tokens
  { id: "uniswap", name: "Uniswap", symbol: "UNI", icon: "🦄", color: "#ff007a", category: "defi", price: "$7.8" },
  { id: "aave", name: "Aave", symbol: "AAVE", icon: "👻", color: "#b6509e", category: "defi", price: "$95" },
  { id: "compound", name: "Compound", symbol: "COMP", icon: "◉", color: "#00d395", category: "defi", price: "$52" },

  // Meme Coins
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", icon: "Ð", color: "#c2a633", category: "meme", price: "$0.08" },
  {
    id: "shiba",
    name: "Shiba Inu",
    symbol: "SHIB",
    icon: "🐕",
    color: "#ffa409",
    category: "meme",
    price: "$0.000009",
  },
]

const categories = {
  all: "Alle",
  major: "Hauptwährungen",
  layer1: "Layer 1",
  defi: "DeFi",
  stablecoin: "Stablecoins",
  meme: "Meme Coins",
}

export default function Component() {
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>("all")
  const [showCategories, setShowCategories] = useState(false)
  const [sortBy, setSortBy] = useState<"name" | "price">("name")

  const filteredCryptos = cryptocurrencies
    .filter((crypto) => {
      const matchesSearch =
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || crypto.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      }
      return 0 // Price sorting would need actual numeric values
    })

  const toggleCrypto = (cryptoId: string) => {
    setSelectedCryptos((prev) => (prev.includes(cryptoId) ? prev.filter((id) => id !== cryptoId) : [...prev, cryptoId]))
  }

  const selectAll = () => {
    setSelectedCryptos(filteredCryptos.map((crypto) => crypto.id))
  }

  const clearAll = () => {
    setSelectedCryptos([])
  }

  const selectByCategory = (category: keyof typeof categories) => {
    if (category === "all") {
      selectAll()
    } else {
      const categoryCoins = cryptocurrencies.filter((crypto) => crypto.category === category).map((crypto) => crypto.id)
      setSelectedCryptos((prev) => [...new Set([...prev, ...categoryCoins])])
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/kucoin-logo.png"
            alt="KuCoin Logo"
            width={200}
            height={50}
            className="h-12 w-auto"
            priority
          />
          <span className="text-2xl text-gray-600 ml-3">Web3 Wallet</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 mb-12">
        <div className="flex gap-2">
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kryptowährungen auswählen</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Wählen Sie aus, welche Kryptowährungen Sie in Ihrem Web3 Wallet transferieren möchten.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Kryptowährungen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-4 pr-12 text-base border-2 border-gray-300 rounded-lg focus:border-green-400 focus:ring-0"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="flex items-center justify-between w-full h-12 px-4 text-left border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-green-400 focus:outline-none"
            >
              <span>{categories[selectedCategory]}</span>
              {showCategories ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>

            {showCategories && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {Object.entries(categories).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key as keyof typeof categories)
                      setShowCategories(false)
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6 flex gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={selectAll} className="text-sm bg-transparent">
            Alle auswählen
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="text-sm bg-transparent">
            Alle abwählen
          </Button>
          <Button variant="outline" size="sm" onClick={() => selectByCategory("major")} className="text-sm">
            Top 10
          </Button>
          <Button variant="outline" size="sm" onClick={() => selectByCategory("stablecoin")} className="text-sm">
            Stablecoins
          </Button>
        </div>

        {/* Selection Counter */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">{selectedCryptos.length} cryptocurrencies selected</p>
          <p className="text-sm text-gray-500">
            {filteredCryptos.length} von {cryptocurrencies.length} angezeigt
          </p>
        </div>

        {/* Cryptocurrency List */}
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {filteredCryptos.map((crypto, index) => (
              <div
                key={crypto.id}
                className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedCryptos.includes(crypto.id) ? "bg-green-50 border-l-4 border-l-green-400" : ""
                } ${index !== filteredCryptos.length - 1 ? "border-b border-gray-200" : ""}`}
                onClick={() => toggleCrypto(crypto.id)}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 flex-shrink-0"
                  style={{ backgroundColor: crypto.color }}
                >
                  {crypto.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{crypto.name}</div>
                  <div className="text-sm text-gray-600">{crypto.symbol}</div>
                </div>
                <div className="text-right mr-4">
                  <div className="text-sm font-medium text-gray-900">{crypto.price}</div>
                  <div className="text-xs text-gray-500 capitalize">{crypto.category}</div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedCryptos.includes(crypto.id) ? "bg-green-400 border-green-400" : "border-gray-300"
                    }`}
                  >
                    {selectedCryptos.includes(crypto.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 0 01-1.414 0l-4-4a1 0 011.414-1.414L8 12.586l7.293-7.293a1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          className="w-full h-14 bg-green-200 hover:bg-green-300 text-gray-700 font-semibold text-lg rounded-lg"
          disabled={selectedCryptos.length === 0}
        >
          Fortfahren ({selectedCryptos.length} ausgewählt)
        </Button>
      </div>
    </div>
  )
}
