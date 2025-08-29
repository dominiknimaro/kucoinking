"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check, XCircle } from "lucide-react"
import { cryptocurrencies } from "../data/cryptocurrencies"

interface ReceiveCryptoModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCryptos: string[]
  visitorCryptoAddresses: { cryptoId: string; address: string }[] // New prop for actual addresses
}

export default function ReceiveCryptoModal({
  isOpen,
  onClose,
  selectedCryptos,
  visitorCryptoAddresses,
}: ReceiveCryptoModalProps) {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const availableCryptos = cryptocurrencies.filter((crypto) => selectedCryptos.includes(crypto.id))

  const handleCoinSelect = (cryptoId: string) => {
    setSelectedCoinId(cryptoId)
    setCopiedAddress(null) // Reset copied state when new coin is selected
  }

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(address)
    setTimeout(() => setCopiedAddress(null), 2000) // Reset after 2 seconds
  }

  const selectedCoinData = selectedCoinId ? availableCryptos.find((c) => c.id === selectedCoinId) : null
  // Use the actual address from visitorCryptoAddresses if available, otherwise fallback to mock
  const actualAddress = visitorCryptoAddresses.find((item) => item.cryptoId === selectedCoinId)?.address || ""

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Kryptowährung empfangen</DialogTitle>
          <DialogDescription className="text-gray-600">
            Wählen Sie eine Kryptowährung aus, um Ihre Empfangsadresse zu erhalten.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Coin Selection */}
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
            {availableCryptos.length === 0 ? (
              <p className="text-gray-600 text-center py-4">Keine Kryptowährungen ausgewählt.</p>
            ) : (
              availableCryptos.map((crypto) => (
                <div
                  key={crypto.id}
                  className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                    selectedCoinId === crypto.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                  } ${availableCryptos.indexOf(crypto) < availableCryptos.length - 1 ? "border-b border-gray-100" : ""}`}
                  onClick={() => handleCoinSelect(crypto.id)}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
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
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{crypto.name}</div>
                    <div className="text-sm text-gray-600">{crypto.symbol}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Address Display */}
          {selectedCoinId && selectedCoinData && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Empfangsadresse für {selectedCoinData.name}</h4>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  value={actualAddress || "Ihre neuen Adressen werden momentan erstellt."} // Display actual address or message
                  readOnly
                  className="flex-1 bg-white border-gray-300 text-gray-800 font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyAddress(actualAddress)}
                  className="flex-shrink-0"
                  disabled={!actualAddress} // Disable if no address is set
                >
                  {copiedAddress === actualAddress ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {copiedAddress === actualAddress && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Adresse kopiert!
                </p>
              )}
              {!actualAddress && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> No address set for this coin.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Senden Sie nur {selectedCoinData.symbol} an diese Adresse. Das Senden anderer Kryptowährungen kann zu
                Verlusten führen.
              </p>
            </div>
          )}
        </div>

        <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Schließen
        </Button>
      </DialogContent>
    </Dialog>
  )
}
