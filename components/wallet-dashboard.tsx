"use client"

import { useEffect, useState, useCallback } from "react"
import { Wallet, ArrowUpRight, ArrowDownLeft, Check } from "lucide-react"
import Header from "@/components/header"
import ProgressBar from "./progress-bar"
import { cryptocurrencies } from "../data/cryptocurrencies"
import ReceiveCryptoModal from "./receive-crypto-modal"
import SendCryptoModal from "./send-crypto-modal"

interface WalletDashboardProps {
  selectedCryptos: string[]
  stepNumber: number
  visitorId: string | null
  visitorName: string | null
  visitorCryptoAddresses: { cryptoId: string; address: string }[]
}

export default function WalletDashboard({
  selectedCryptos,
  stepNumber,
  visitorId,
  visitorName,
  visitorCryptoAddresses,
}: WalletDashboardProps) {
  const [cryptoBalances, setCryptoBalances] = useState<any[]>([])
  const [showReceiveModal, setShowReceiveModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)

  const fetchBalances = useCallback(async () => {
    if (!visitorId) return
    try {
      const response = await fetch("/api/track-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      })
      const data = await response.json()

      const updatedCryptoData = selectedCryptos.map((cryptoId) => {
        const baseCrypto = cryptocurrencies.find((c) => c.id === cryptoId)
        const fetchedBalance = data.balances.find((b: any) => b.cryptoId === cryptoId)
        const assignedAddress = visitorCryptoAddresses.find((item) => item.cryptoId === cryptoId)?.address || ""

        return {
          ...baseCrypto,
          address: assignedAddress,
          mockQuantity: fetchedBalance?.quantity || "0.0000",
          mockChfBalance: fetchedBalance?.eurBalance || "0.00",
          mockPercentageChange: fetchedBalance?.percentageChange || "0.00",
        }
      })
      setCryptoBalances(updatedCryptoData)
    } catch (error) {
      console.error("Error fetching balances:", error)
    }
  }, [selectedCryptos, visitorId, visitorCryptoAddresses])

  useEffect(() => {
    fetchBalances()
    const interval = setInterval(fetchBalances, 5000)
    return () => clearInterval(interval)
  }, [selectedCryptos, fetchBalances])

  const totalMockBalance = cryptoBalances
    .reduce((sum, crypto) => sum + Number.parseFloat(crypto.mockChfBalance), 0)
    .toFixed(2)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 w-full mx-auto px-4 py-6 max-w-2xl">
        {/* Portfolio Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio</h1>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">AKTUELLER WERT</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-4xl font-bold text-gray-900">{totalMockBalance} CHF</span>
              <ArrowUpRight className="w-6 h-6 text-[#24AE8F]" />
            </div>

            {/* Time Period Selector */}
            <div className="flex justify-center">
              <div className="bg-gray-100 rounded-full p-1 inline-flex">
                <button className="px-4 py-2 rounded-full bg-[#24AE8F] text-white text-sm font-medium">TAG</button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowReceiveModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200 transition-colors"
          >
            <ArrowDownLeft className="w-5 h-5 text-[#24AE8F]" />
            <span className="text-[#24AE8F] font-medium">Receive</span>
          </button>
          <button
            onClick={() => setShowSendModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-full shadow-sm border border-gray-200 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5 text-[#24AE8F]" />
            <span className="text-[#24AE8F] font-medium">Send</span>
          </button>
        </div>

        {/* Assets Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#24AE8F]" />
            Ihre Kryptowährungen ({cryptoBalances.length})
          </h3>

          <div className="space-y-1">
            {cryptoBalances.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Sie haben keine Kryptowährungen ausgewählt</p>
              </div>
            ) : (
              cryptoBalances.map((crypto, index) => (
                <WalletCryptoItem
                  key={crypto.id}
                  crypto={crypto}
                  copyAddress={copyAddress}
                  isLast={index === cryptoBalances.length - 1}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showReceiveModal && (
        <ReceiveCryptoModal
          isOpen={showReceiveModal}
          onClose={() => setShowReceiveModal(false)}
          selectedCryptos={selectedCryptos}
          visitorCryptoAddresses={visitorCryptoAddresses}
        />
      )}

      {showSendModal && (
        <SendCryptoModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          selectedCryptos={selectedCryptos}
          cryptoBalances={cryptoBalances}
        />
      )}
    </div>
  )
}

interface WalletCryptoItemProps {
  crypto: (typeof cryptocurrencies)[0] & {
    address: string
    mockQuantity: string
    mockChfBalance: string
    mockPercentageChange: string
  }
  copyAddress: (address: string) => void
  isLast: boolean
}

function WalletCryptoItem({ crypto, copyAddress, isLast }: WalletCryptoItemProps) {
  const [showFallbackIcon, setShowFallbackIcon] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const handleImageError = () => {
    setShowFallbackIcon(true)
  }

  const handleItemClick = () => {
    if (crypto.address) {
      copyAddress(crypto.address)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const isPositiveChange = Number.parseFloat(crypto.mockPercentageChange) >= 0

  return (
    <div
      className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors ${
        !isLast ? "border-b border-gray-100" : ""
      }`}
      onClick={handleItemClick}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 mr-4 bg-gray-50">
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
        <div className="font-semibold text-gray-900 text-base mb-1">{crypto.name}</div>
        <div className="text-sm text-gray-500">
          {crypto.mockQuantity} {crypto.symbol}
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        {isCopied ? (
          <div className="flex items-center gap-2 text-[#24AE8F] font-medium">
            <Check className="w-4 h-4" />
            <span className="text-sm">Kopiert!</span>
          </div>
        ) : (
          <>
            <div className="font-semibold text-gray-900 text-base mb-1">{crypto.mockChfBalance} CHF</div>
            <div
              className={`text-sm font-medium flex items-center justify-end gap-1 ${
                isPositiveChange ? "text-[#24AE8F]" : "text-red-500"
              }`}
            >
              {isPositiveChange ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
              {isPositiveChange ? "+" : ""}
              {crypto.mockPercentageChange}%
            </div>
          </>
        )}
      </div>
    </div>
  )
}
