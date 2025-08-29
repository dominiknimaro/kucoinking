"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, Copy, RefreshCw, Shield, AlertTriangle } from "lucide-react"

export default function WalletSetupStep3() {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [confirmedBackup, setConfirmedBackup] = useState(false)
  const [confirmedSecurity, setConfirmedSecurity] = useState(false)
  const [confirmedResponsibility, setConfirmedResponsibility] = useState(false)

  // Mock seed phrase - in real app this would be generated securely
  const seedPhrase = [
    "abandon",
    "ability",
    "able",
    "about",
    "above",
    "absent",
    "absorb",
    "abstract",
    "absurd",
    "abuse",
    "access",
    "accident",
  ]

  const copySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase.join(" "))
    // Show toast notification in real app
  }

  const regenerateSeedPhrase = () => {
    // In real app, generate new seed phrase
    console.log("Regenerating seed phrase...")
  }

  const canContinue = confirmedBackup && confirmedSecurity && confirmedResponsibility

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-semibold text-gray-900">bitpanda</span>
          <span className="text-lg text-gray-600 ml-2">Web3 Wallet</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 mb-12">
        <div className="flex gap-2">
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-green-400 rounded-full flex-1"></div>
          <div className="h-1 bg-gray-200 rounded-full flex-1"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sicherheitsphrase erstellen</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Ihre Sicherheitsphrase ist der Schlüssel zu Ihrer Wallet. Bewahren Sie diese sicher auf - ohne sie können
            Sie nicht auf Ihre Kryptowährungen zugreifen.
          </p>
        </div>

        {/* Warning Box */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Wichtiger Sicherheitshinweis</h3>
              <ul className="text-red-800 text-sm space-y-1">
                <li>• Teilen Sie Ihre Sicherheitsphrase niemals mit anderen</li>
                <li>• Bitpanda wird Sie niemals nach Ihrer Sicherheitsphrase fragen</li>
                <li>• Bewahren Sie sie offline und sicher auf</li>
                <li>• Bei Verlust sind Ihre Kryptowährungen unwiederbringlich verloren</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Seed Phrase Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Ihre Sicherheitsphrase</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateSeedPhrase}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="w-4 h-4" />
                Neu generieren
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                className="flex items-center gap-2"
              >
                {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showSeedPhrase ? "Verbergen" : "Anzeigen"}
              </Button>
            </div>
          </div>

          <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
            {showSeedPhrase ? (
              <div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {seedPhrase.map((word, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white rounded border">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <span className="font-mono font-medium">{word}</span>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={copySeedPhrase}
                  className="w-full flex items-center gap-2 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                  Sicherheitsphrase kopieren
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Klicken Sie auf "Anzeigen" um Ihre Sicherheitsphrase zu sehen</p>
              </div>
            )}
          </div>
        </div>

        {/* Confirmation Checkboxes */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="backup-confirmed"
              checked={confirmedBackup}
              onChange={(e) => setConfirmedBackup(e.target.checked)}
              className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="backup-confirmed" className="text-gray-700 cursor-pointer">
              Ich habe meine Sicherheitsphrase sicher gespeichert und verstehe, dass ich ohne sie nicht auf meine Wallet
              zugreifen kann.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="security-confirmed"
              checked={confirmedSecurity}
              onChange={(e) => setConfirmedSecurity(e.target.checked)}
              className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="security-confirmed" className="text-gray-700 cursor-pointer">
              Ich werde meine Sicherheitsphrase niemals mit anderen teilen oder online speichern.
            </label>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="responsibility-confirmed"
              checked={confirmedResponsibility}
              onChange={(e) => setConfirmedResponsibility(e.target.checked)}
              className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="responsibility-confirmed" className="text-gray-700 cursor-pointer">
              Ich verstehe, dass ich allein für die Sicherheit meiner Sicherheitsphrase verantwortlich bin.
            </label>
          </div>
        </div>

        {/* Continue Button */}
        <Button
          className="w-full h-14 bg-green-200 hover:bg-green-300 text-gray-700 font-semibold text-lg rounded-lg disabled:opacity-50"
          disabled={!canContinue}
        >
          Wallet erstellen
        </Button>
      </div>
    </div>
  )
}
