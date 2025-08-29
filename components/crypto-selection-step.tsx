"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Header from "@/components/header"
import ProgressBar from "./progress-bar"
import { cryptocurrencies } from "../data/cryptocurrencies"

interface CryptoSelectionStepProps {
  onNext: () => void
  selectedCryptos: string[]
  onSelectionChange: (selected: string[]) => void
  stepNumber: number
}

export default function CryptoSelectionStep({
  onNext,
  selectedCryptos,
  onSelectionChange,
  stepNumber,
}: CryptoSelectionStepProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const filteredCryptos = cryptocurrencies.filter((crypto) => {
    const matchesSearch =
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const toggleCrypto = (cryptoId: string) => {
    const newSelection = selectedCryptos.includes(cryptoId)
      ? selectedCryptos.filter((id) => id !== cryptoId)
      : [...selectedCryptos, cryptoId]
    onSelectionChange(newSelection)
  }

  const selectAll = () => {
    onSelectionChange(filteredCryptos.map((crypto) => crypto.id))
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  const handleContinue = async () => {
    onNext()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 px-4 md:px-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Kryptowährungen auswählen</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Wählen Sie aus, welche Kryptowährungen Sie in Ihrer KuCoin Web3 Wallet verwalten möchten.
          </p>
        </div>
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Kryptowährungen suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-4 pr-12 text-base border-2 border-gray-300 rounded-lg focus:border-[#24AE8F] focus:ring-0"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="mb-6 flex gap-3 flex-wrap">
          <Button variant="outline" size="sm" onClick={selectAll}>
            Alle auswählen
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            Alle abwählen
          </Button>
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-600">{selectedCryptos.length} cryptocurrencies selected</p>
        </div>
        <div className="mb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden max-h-96 overflow-y-auto">
            {filteredCryptos.map((crypto, index) => (
              <CryptoIconItem
                key={crypto.id}
                crypto={crypto}
                isSelected={selectedCryptos.includes(crypto.id)}
                toggleCrypto={toggleCrypto}
                isLast={index === filteredCryptos.length - 1}
              />
            ))}
          </div>
        </div>
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-[#24AE8F] hover:bg-[#1E9B7A] text-white font-semibold text-lg rounded-lg"
          disabled={selectedCryptos.length === 0}
        >
          Fortfahren ({selectedCryptos.length} ausgewählt)
        </Button>
      </div>
    </div>
  )
}

// New component for rendering crypto icon and details
interface CryptoIconItemProps {
  crypto: (typeof cryptocurrencies)[0]
  isSelected: boolean
  toggleCrypto: (id: string) => void
  isLast: boolean
}

function CryptoIconItem({ crypto, isSelected, toggleCrypto, isLast }: CryptoIconItemProps) {
  const [showFallbackIcon, setShowFallbackIcon] = useState(false)

  const handleImageError = () => {
    console.error(`Failed to load image for ${crypto.name} from ${crypto.iconUrl}. Showing fallback.`)
    setShowFallbackIcon(true)
  }

  return (
    <div
      className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? "bg-[#E8F5F2] border-l-4 border-l-[#24AE8F]" : ""
      } ${!isLast ? "border-b border-gray-200" : ""}`}
      onClick={() => toggleCrypto(crypto.id)}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
        {!showFallbackIcon ? (
          <img
            src={crypto.iconUrl || "/placeholder.svg"}
            alt={crypto.name}
            className="w-8 h-8"
            onError={handleImageError}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: crypto.color }}
          >
            {crypto.symbol.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate">{crypto.name}</div>
        <div className="text-sm text-gray-600">{crypto.symbol}</div>
      </div>
      <div className="ml-4 flex-shrink-0">
        {/* Custom Toggle Icon */}
        <div
          className={`w-10 h-6 rounded-md border-2 flex items-center p-0.5 transition-colors duration-200 ease-in-out ${
            isSelected ? "bg-[#24AE8F] border-[#24AE8F]" : "bg-gray-200 border-gray-300"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-sm transition-transform duration-200 ease-in-out ${
              isSelected ? "bg-white translate-x-4" : "bg-gray-400 translate-x-0"
            }`}
          />
        </div>
      </div>
    </div>
  )
}
