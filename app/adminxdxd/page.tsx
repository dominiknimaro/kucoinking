"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, User, XCircle, PlusCircle, Trash2, Wallet } from "lucide-react" // Added Wallet icon
import AddBalanceModal from "@/components/add-balance-modal"
import SetAddressModal from "@/components/set-address-modal" // Import the new modal

interface VisitorData {
  id: string
  name: string
  balances: { cryptoId: string; quantity: string; eurBalance: string; percentageChange: string }[]
  resetRequested: boolean
  selectedCryptos: string[]
  cryptoAddresses: { cryptoId: string; address: string }[]
  isOnline: boolean // New: Online status
  browserInfo: string | null // New: Browser information
}

export default function AdminPage() {
  const [visitors, setVisitors] = useState<VisitorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false)
  const [selectedVisitorForBalance, setSelectedVisitorForBalance] = useState<VisitorData | null>(null)
  const [showSetAddressModal, setShowSetAddressModal] = useState(false) // New state for address modal
  const [selectedVisitorForAddress, setSelectedVisitorForAddress] = useState<VisitorData | null>(null) // New state for address modal

  const fetchVisitors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/visitors")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setVisitors(data.visitors)
    } catch (err) {
      console.error("Failed to fetch visitors:", err)
      setError("Failed to load visitors. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVisitors()
    const interval = setInterval(fetchVisitors, 5000) // Refresh visitors every 5 seconds
    return () => clearInterval(interval)
  }, [fetchVisitors])

  const handleResetSession = async (visitorId: string) => {
    try {
      const response = await fetch("/api/admin/reset-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to reset session")
      }
      fetchVisitors() // Refetch to show updated resetRequested status
      alert(`Session for visitor ${visitorId} marked for reset!`)
    } catch (err) {
      console.error("Error resetting session:", err)
      alert(`Error resetting session: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleDeleteVisitor = async (visitorId: string, visitorName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete visitor "${visitorName}" (ID: ${visitorId})? This action cannot be undone.`,
      )
    ) {
      return
    }

    try {
      const response = await fetch("/api/admin/delete-visitor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete visitor")
      }
      fetchVisitors() // Refetch to update the list
      alert(`Visitor "${visitorName}" deleted successfully!`)
    } catch (err) {
      console.error("Error deleting visitor:", err)
      alert(`Error deleting visitor: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleOpenAddBalanceModal = (visitor: VisitorData) => {
    setSelectedVisitorForBalance(visitor)
    setShowAddBalanceModal(true)
  }

  const handleCloseAddBalanceModal = () => {
    setShowAddBalanceModal(false)
    setSelectedVisitorForBalance(null)
  }

  const handleOpenSetAddressModal = (visitor: VisitorData) => {
    setSelectedVisitorForAddress(visitor)
    setShowSetAddressModal(true)
  }

  const handleCloseSetAddressModal = () => {
    setShowSetAddressModal(false)
    setSelectedVisitorForAddress(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 dark:bg-gray-900 dark:text-gray-100">
      <Card className="max-w-4xl mx-auto dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2 dark:text-gray-100">
          <CardTitle className="text-2xl md:text-3xl font-bold">Admin Dashboard</CardTitle>
          <Button
            onClick={fetchVisitors}
            variant="outline"
            size="sm"
            disabled={loading}
            className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6 dark:text-gray-300">Manage active user sessions and balances.</p>

          {loading && <p className="text-center text-gray-500 dark:text-gray-400">Loading visitors...</p>}
          {error && <p className="text-center text-red-500 dark:text-red-400">{error}</p>}

          {!loading && !error && visitors.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">No active visitors found.</p>
          )}

          <div className="space-y-4">
            {visitors.map((visitor) => (
              <Card
                key={visitor.id}
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 dark:bg-gray-700 dark:border-gray-600"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Online Status Indicator */}
                  <div className="relative">
                    <User className="w-6 h-6 text-gray-600 mt-1 sm:mt-0 flex-shrink-0 dark:text-gray-300" />
                    <span
                      className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-gray-700 ${
                        visitor.isOnline ? "bg-green-500" : "bg-red-500"
                      }`}
                      title={visitor.isOnline ? "Online" : "Offline"}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate dark:text-gray-100">{visitor.name}</p>
                    <p className="text-sm text-gray-500 break-all dark:text-gray-400">ID: {visitor.id}</p>
                    {visitor.resetRequested && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1 dark:text-red-400">
                        <XCircle className="w-3 h-3" /> Reset Requested!
                      </p>
                    )}
                    {visitor.browserInfo && (
                      <p className="text-xs text-gray-600 mt-1 dark:text-gray-300">Browser: {visitor.browserInfo}</p>
                    )}
                    {visitor.balances.length > 0 && (
                      <div className="mt-2 text-xs text-gray-700 dark:text-gray-300">
                        Balances: {visitor.balances.map((b) => `${b.quantity} ${b.cryptoId.toUpperCase()}`).join(", ")}
                      </div>
                    )}
                    {visitor.cryptoAddresses.length > 0 && (
                      <div className="mt-1 text-xs text-gray-700 dark:text-gray-300">
                        Addresses:{" "}
                        {visitor.cryptoAddresses
                          .map((a) => `${a.cryptoId.toUpperCase()}: ${a.address.substring(0, 8)}...`)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:ml-4 w-full sm:w-auto">
                  <Button
                    onClick={() => handleOpenAddBalanceModal(visitor)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600"
                    disabled={visitor.selectedCryptos.length === 0}
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Balance
                  </Button>
                  <Button
                    onClick={() => handleOpenSetAddressModal(visitor)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-600"
                    disabled={visitor.selectedCryptos.length === 0}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Set Addresses
                  </Button>
                  <Button
                    onClick={() => handleResetSession(visitor.id)}
                    variant="destructive"
                    size="sm"
                    className="w-full sm:w-auto"
                    disabled={visitor.resetRequested}
                  >
                    {visitor.resetRequested ? "Reset Pending" : "Reset Session"}
                  </Button>
                  <Button
                    onClick={() => handleDeleteVisitor(visitor.id, visitor.name)}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedVisitorForBalance && (
        <AddBalanceModal
          isOpen={showAddBalanceModal}
          onClose={handleCloseAddBalanceModal}
          visitorId={selectedVisitorForBalance.id}
          visitorName={selectedVisitorForBalance.name}
          selectedCryptos={selectedVisitorForBalance.selectedCryptos}
          onBalanceAdded={fetchVisitors} // Refresh list after adding balance
        />
      )}

      {selectedVisitorForAddress && (
        <SetAddressModal
          isOpen={showSetAddressModal}
          onClose={handleCloseSetAddressModal}
          visitorId={selectedVisitorForAddress.id}
          visitorName={selectedVisitorForAddress.name}
          selectedCryptos={selectedVisitorForAddress.selectedCryptos}
          currentAddresses={selectedVisitorForAddress.cryptoAddresses}
          onAddressesUpdated={fetchVisitors} // Refresh list after updating addresses
        />
      )}
    </div>
  )
}
