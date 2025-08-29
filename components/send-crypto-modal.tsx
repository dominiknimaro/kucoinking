"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, XCircle, Send } from "lucide-react"

interface SendCryptoModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCryptos: string[] // IDs of cryptos selected by this visitor
  cryptoBalances: {
    id: string
    name: string
    symbol: string
    iconUrl: string
    color: string
    mockQuantity: string
    mockChfBalance: string
  }[] // Current mock balances for display
}

export default function SendCryptoModal({ isOpen, onClose, selectedCryptos, cryptoBalances }: SendCryptoModalProps) {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedCoinId(null)
      setRecipientAddress("")
      setAmount("")
      setStatusMessage(null)
    }
  }, [isOpen])

  const availableCryptosWithBalances = cryptoBalances.filter((crypto) => selectedCryptos.includes(crypto.id))

  const handleCoinSelect = (cryptoId: string) => {
    setSelectedCoinId(cryptoId)
    setStatusMessage(null)
  }

  const handleAmountChange = (value: string) => {
    // Allow only numbers and a single decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (numericValue.split(".").length > 2) {
      return // Prevent multiple decimal points
    }
    setAmount(numericValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    if (!selectedCoinId) {
      setStatusMessage({ type: "error", message: "Please select a cryptocurrency." })
      setLoading(false)
      return
    }
    if (!recipientAddress.trim()) {
      setStatusMessage({ type: "error", message: "Recipient address cannot be empty." })
      setLoading(false)
      return
    }
    const parsedAmount = Number.parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setStatusMessage({ type: "error", message: "Please enter a valid positive amount." })
      setLoading(false)
      return
    }

    const selectedCrypto = availableCryptosWithBalances.find((c) => c.id === selectedCoinId)
    if (!selectedCrypto) {
      setStatusMessage({ type: "error", message: "Selected cryptocurrency not found." })
      setLoading(false)
      return
    }

    const currentBalanceQuantity = Number.parseFloat(selectedCrypto.mockQuantity)
    if (parsedAmount > currentBalanceQuantity) {
      setStatusMessage({
        type: "error",
        message: `Insufficient balance. Max: ${currentBalanceQuantity} ${selectedCrypto.symbol}`,
      })
      setLoading(false)
      return
    }

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setStatusMessage({
      type: "success",
      message: `Successfully sent ${parsedAmount} ${selectedCrypto.symbol} to ${recipientAddress.substring(0, 10)}...`,
    })
    setLoading(false)
    // In a real app, you'd call an API to process the transaction
    // and then potentially refresh the dashboard balances.
    setTimeout(onClose, 2000) // Close modal after success message
  }

  const selectedCryptoData = selectedCoinId ? availableCryptosWithBalances.find((c) => c.id === selectedCoinId) : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Kryptowährung senden</DialogTitle>
          <DialogDescription className="text-gray-600">
            Wählen Sie eine Kryptowährung aus und geben Sie die Empfängerdetails ein.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Coin Selection */}
          <div>
            <Label htmlFor="crypto-select" className="mb-2 block">
              Kryptowährung auswählen
            </Label>
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {availableCryptosWithBalances.length === 0 ? (
                <p className="text-gray-600 text-center py-4">Keine Kryptowährungen mit Guthaben verfügbar.</p>
              ) : (
                availableCryptosWithBalances.map((crypto) => (
                  <div
                    key={crypto.id}
                    className={`flex items-center p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedCoinId === crypto.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                    } ${availableCryptosWithBalances.indexOf(crypto) < availableCryptosWithBalances.length - 1 ? "border-b border-gray-100" : ""}`}
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
                      <div className="text-sm text-gray-600">
                        Balance: {crypto.mockQuantity} {crypto.symbol} ({crypto.mockChfBalance} CHF)
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {selectedCoinId && (
            <>
              {/* Recipient Address */}
              <div>
                <Label htmlFor="recipient-address" className="mb-2 block">
                  Empfängeradresse
                </Label>
                <Input
                  id="recipient-address"
                  type="text"
                  placeholder="Geben Sie die Empfängeradresse ein"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount" className="mb-2 block">
                  Betrag ({selectedCryptoData?.symbol})
                </Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="w-full"
                />
                {selectedCryptoData && (
                  <p className="text-xs text-gray-500 mt-1">
                    Verfügbar: {selectedCryptoData.mockQuantity} {selectedCryptoData.symbol}
                  </p>
                )}
              </div>
            </>
          )}

          {statusMessage && (
            <div
              className={`flex items-center gap-2 p-3 rounded-md ${
                statusMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {statusMessage.type === "success" ? <Check className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              <p className="text-sm">{statusMessage.message}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading || !selectedCoinId || !recipientAddress.trim() || !amount.trim()}
          >
            {loading ? "Senden..." : "Senden"}
            <Send className="w-4 h-4 ml-2" />
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full bg-transparent">
            Abbrechen
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
