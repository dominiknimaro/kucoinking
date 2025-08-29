"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, XCircle } from "lucide-react"
import { cryptocurrencies } from "../data/cryptocurrencies"

interface SetAddressModalProps {
  isOpen: boolean
  onClose: () => void
  visitorId: string
  visitorName: string
  selectedCryptos: string[] // IDs of cryptos selected by this visitor
  currentAddresses: { cryptoId: string; address: string }[] // Current addresses for this visitor
  onAddressesUpdated: () => void // Callback to refresh visitor list
}

export default function SetAddressModal({
  isOpen,
  onClose,
  visitorId,
  visitorName,
  selectedCryptos,
  currentAddresses,
  onAddressesUpdated,
}: SetAddressModalProps) {
  const [addresses, setAddresses] = useState<Record<string, string>>({}) // { cryptoId: addressString }
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    if (isOpen) {
      // Initialize addresses with current values when modal opens
      const initialAddresses: Record<string, string> = {}
      currentAddresses.forEach((item) => {
        initialAddresses[item.cryptoId] = item.address
      })
      setAddresses(initialAddresses)
      setStatusMessage(null) // Clear previous status messages
    }
  }, [isOpen, currentAddresses])

  const availableCryptos = cryptocurrencies.filter((crypto) => selectedCryptos.includes(crypto.id))

  const handleAddressChange = (cryptoId: string, value: string) => {
    setAddresses((prev) => ({ ...prev, [cryptoId]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatusMessage(null)

    const updates = Object.entries(addresses).filter(([, address]) => address.trim() !== "")

    if (updates.length === 0) {
      setStatusMessage({ type: "error", message: "Please enter at least one address." })
      setLoading(false)
      return
    }

    try {
      for (const [cryptoId, address] of updates) {
        const response = await fetch("/api/admin/update-address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, cryptoId, address }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Failed to update address for ${cryptoId}`)
        }
      }
      setStatusMessage({ type: "success", message: "Addresses updated successfully!" })
      onAddressesUpdated() // Refresh parent list
      setTimeout(onClose, 1500) // Close modal after a short delay
    } catch (err) {
      console.error("Error updating addresses:", err)
      setStatusMessage({ type: "error", message: `Error: ${err instanceof Error ? err.message : String(err)}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Set Wallet Addresses for {visitorName}</DialogTitle>
          <DialogDescription className="text-gray-600">
            Enter the wallet addresses for the cryptocurrencies selected by this visitor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {availableCryptos.length === 0 ? (
            <p className="text-gray-600 text-center py-4">This visitor has no cryptocurrencies selected.</p>
          ) : (
            <div className="max-h-60 overflow-y-auto pr-2">
              {availableCryptos.map((crypto) => (
                <div key={crypto.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-b-0">
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
                    <Label htmlFor={`address-${crypto.id}`} className="font-medium text-gray-900">
                      {crypto.name} ({crypto.symbol})
                    </Label>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Input
                      id={`address-${crypto.id}`}
                      type="text"
                      value={addresses[crypto.id] || ""}
                      onChange={(e) => handleAddressChange(crypto.id, e.target.value)}
                      placeholder={`Enter ${crypto.symbol} address`}
                      className="w-48 text-right"
                    />
                  </div>
                </div>
              ))}
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
            {loading ? "Saving..." : "Save Addresses"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="w-full bg-transparent">
            Cancel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
