"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import Header from "@/components/header"
import ProgressBar from "./progress-bar"

interface LoadingStepProps {
  onNext: () => void
  stepNumber: number
}

export default function LoadingStep({ onNext, stepNumber }: LoadingStepProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext()
    }, 3000) // Simulate 3 seconds of loading
    return () => clearTimeout(timer)
  }, [onNext])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <Loader2 className="h-16 w-16 text-[#24AE8F] animate-spin mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bitte warten Sie</h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-md">
          Ihre KuCoin Web3 Wallet wird erstellt und die ausgewählten Kryptowährungen werden vorbereitet. Dies kann einen
          Moment dauern.
        </p>
      </div>
    </div>
  )
}
