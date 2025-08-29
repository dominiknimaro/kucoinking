"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, Wallet, ArrowRight } from "lucide-react"
import Header from "./header"
import ProgressBar from "./progress-bar"
import { cryptocurrencies } from "../data/cryptocurrencies"

interface WalletCreatedStepProps {
  selectedCryptos: string[]
  stepNumber: number
}

export default function WalletCreatedStep({ selectedCryptos, stepNumber }: WalletCreatedStepProps) {
  const selectedCryptoData = cryptocurrencies.filter((crypto) => selectedCryptos.includes(crypto.id))

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 px-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wallet erfolgreich erstellt!</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Ihre Web3 Wallet wurde erfolgreich eingerichtet. Sie können jetzt Ihre ausgewählten Kryptowährungen
            verwalten und transferieren.
          </p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Ihre ausgewählten Kryptowährungen ({selectedCryptos.length})
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {selectedCryptoData.map((crypto) => (
              <div key={crypto.id} className="flex items-center gap-3 p-3 bg-white rounded border">
                <img
                  src={crypto.iconUrl || "/placeholder.svg"}
                  alt={crypto.name}
                  className="w-6 h-6"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    const fallback = target.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = "flex"
                  }}
                />
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs hidden"
                  style={{ backgroundColor: crypto.color }}
                >
                  {crypto.symbol.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm truncate">{crypto.name}</div>
                  <div className="text-xs text-gray-600">{crypto.symbol}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-2">Nächste Schritte</h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Laden Sie die KuCoin App herunter
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Importieren Sie Ihre Wallet mit der Sicherheitsphrase
            </li>
            <li className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Beginnen Sie mit dem Transfer Ihrer Kryptowährungen
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold text-lg rounded-lg">
            Zur KuCoin App
          </Button>

          <Button variant="outline" className="w-full h-12 font-semibold text-base rounded-lg bg-transparent">
            Wallet-Details anzeigen
          </Button>
        </div>
      </div>
    </div>
  )
}
