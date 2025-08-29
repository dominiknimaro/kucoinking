"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, XCircle } from "lucide-react"
import { cryptocurrencies } from "../data/cryptocurrencies"
import { getMockCryptoPrices } from "@/lib/mock-crypto-prices" // Import mock prices

interface AddBalanceModalProps {
  isOpen: boolean
  onClose: () => void
  visitorId: string
  visitorName: string
  selectedCryptos: string[] // IDs of cryptos selected by this visitor
  onBalanceAdded: () => void // Callback to refresh visitor list
}

export default function AddBalanceModal({
  isOpen,
  onClose,
  visitorId,
  visitorName,
  selectedCryptos,
  onBalanceAdded,
}: AddBalanceModalProps) {
  const [quantities, setQuantities] = useState<Record<string, string>>({}) // { cryptoId: quantityString }
  const [mockPrices, setMockPrices] = useState<Map<string, number>>(new Map()) // State for mock prices
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    // Fetch mock prices when the modal opens
    setMockPrices(getMockCryptoPrices())
  }, [])

  const availableCryptos = cryptocurrencies.filter((crypto) => selectedCryptos.includes(crypto.id))

  const handleQuantityChange = (cryptoId: string, value: string) => {
    // Allow only numbers and a single decimal point
    const numericValue = value.replace(/[^0-9.]/g, "")
    if (numericValue.split(".").length > 2) {
      return // Prevent multiple decimal points
    }
    setQuantities((prev) => ({ ...prev, [cryptoId]: numericValue }))
  }

  const calculateChfValue = (cryptoId: string, quantityStr: string): string => {
    const quantity = Number.parseFloat(quantityStr)
    const price = mockPrices.get(cryptoId)
    if (isNaN(quantity) || !price) {
      return "0.00"
    }
    return (quantity * price).toFixed(2)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    const updates = Object.entries(quantities)
      .filter(([, quantity]) => Number.parseFloat(quantity) > 0)
      .map(([cryptoId, quantity]) => ({
        cryptoId,
        quantity: Number.parseFloat(quantity),
      }))

    if (updates.length === 0) {
      setStatusMessage({ type: "error", message: "Please enter a quantity for at least one coin." })
      setLoading(false)
      return
    }

    try {
      for (const update of updates) {
        const response = await fetch("/api/admin/add-balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, ...update }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to add balance for ${update.cryptoId}`)
        }
      }
      setStatusMessage({ type: "success", message: "Balances updated successfully!" })
      setQuantities({}) // Clear form
      onBalanceAdded() // Refresh parent list
      setTimeout(onClose, 1500) // Close modal after a short delay
    } catch (err) {
      console.error("Error adding balance:", err)
      setStatusMessage({ type: "error", message: `Error: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[475px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Balance to {visitorName}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter quantities for the selected cryptocurrencies to add to this visitor&apos;s wallet.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {availableCryptos.length === 0 ? (
            <p className="text-gray-600 text-center py-4">This visitor has no cryptocurrencies selected.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto pr-2">
              {availableCryptos.map((crypto) => {
                const currentPrice = mockPrices.get(crypto.id)
                const currentQuantity = quantities[crypto.id] || ""
                const calculatedValue = calculateChfValue(crypto.id, currentQuantity) // Use calculateChfValue

                return (
                  <div
                    key={crypto.id}
                    className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
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
                    <div className="flex-1 min-w-0">
                      <Label htmlFor={`quantity-${crypto.id}`} className="font-medium text-gray-900">
                        {crypto.name} ({crypto.symbol})
                      </Label>
                      {currentPrice !== undefined && (
                        <p className="text-xs text-gray-500">Current Price: {currentPrice.toFixed(2)} CHF</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Input
                        id={`quantity-${crypto.id}`}
                        type="text" // Use text to allow partial input like "0."
                        inputMode="decimal"
                        value={currentQuantity}
                        onChange={(e) => handleQuantityChange(crypto.id, e.target.value)}
                        placeholder="0.00"
                        className="w-28 text-right"
                      />
                      <p className="text-xs text-gray-600">Total: {calculatedValue} CHF</p>
                    </div>
                  </div>
                )
              })}
            </div>
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

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
            {loading ? "Adding..." : "Add Balance"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full bg-transparent">
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
