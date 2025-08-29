"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight } from "lucide-react"
import Header from "@/components/header"
import ProgressBar from "./progress-bar"
import { cryptocurrencies } from "../data/cryptocurrencies"

interface WalletSummaryStepProps {
  onNext: () => void
  stepNumber: number
  selectedCryptos: string[]
}

export default function WalletSummaryStep({ onNext, stepNumber, selectedCryptos }: WalletSummaryStepProps) {
  const selectedCryptoData = cryptocurrencies.filter((crypto) => selectedCryptos.includes(crypto.id))

  const handleContinue = () => {
    onNext()
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 px-4 md:px-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Willkommen in Ihrer KuCoin Web3 Wallet!</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Ihre Wallet ist fast bereit. Hier ist eine Übersicht der Kryptowährungen, die Sie ausgewählt haben.
          </p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Ihre ausgewählten Kryptowährungen ({selectedCryptoData.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {selectedCryptoData.length === 0 ? (
              <p className="text-gray-600 text-center py-4 col-span-full">
                Sie haben keine Kryptowährungen ausgewählt.
              </p>
            ) : (
              selectedCryptoData.map((crypto) => <CryptoSummaryItem key={crypto.id} crypto={crypto} />)
            )}
          </div>
        </div>
        <div className="bg-[#E8F5F2] border border-[#24AE8F] rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#1E9B7A] mb-2">Nächste Schritte</h3>
          <ul className="text-[#1E9B7A] text-sm space-y-2">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Klicken Sie auf "Zur Wallet", um Ihre Wallet zu sehen.
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Sie können später weitere Kryptowährungen hinzufügen.
            </li>
          </ul>
        </div>
        <Button
          onClick={handleContinue}
          className="w-full h-14 bg-[#24AE8F] hover:bg-[#1E9B7A] text-white font-semibold text-lg rounded-lg"
        >
          Zur Wallet
        </Button>
      </div>
    </div>
  )
}

interface CryptoSummaryItemProps {
  crypto: (typeof cryptocurrencies)[0]
}

function CryptoSummaryItem({ crypto }: CryptoSummaryItemProps) {
  const [showFallbackIcon, setShowFallbackIcon] = useState(false)

  const handleImageError = () => {
    console.error(`Failed to load image for ${crypto.name} from ${crypto.iconUrl}. Showing fallback.`)
    setShowFallbackIcon(true)
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded border">
      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
        {!showFallbackIcon ? (
          <img
            src={crypto.iconUrl || "/placeholder.svg"}
            alt={crypto.name}
            className="w-6 h-6"
            onError={handleImageError}
          />
        ) : (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: crypto.color }}
          >
            {crypto.symbol.charAt(0)}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 text-sm truncate">{crypto.name}</div>
        <div className="text-xs text-gray-600">{crypto.symbol}</div>
      </div>
    </div>
  )
}
