// lib/mock-crypto-prices.ts

// This function simulates fetching current cryptocurrency prices.
// In a real application, you would integrate with a cryptocurrency market data API (e.g., CoinGecko, CoinMarketCap).
export function getMockCryptoPrices(): Map<string, number> {
  const prices = new Map<string, number>()

  // Realistic-looking mock prices in CHF
  prices.set("bitcoin", 45000)
  prices.set("ethereum", 2800)
  prices.set("bnb", 320)
  prices.set("solana", 100)
  prices.set("xrp", 0.55)
  prices.set("cardano", 0.48)
  prices.set("avalanche", 30)
  prices.set("polkadot", 7.5)
  prices.set("polygon", 0.9)
  prices.set("chainlink", 15)
  prices.set("litecoin", 75)
  prices.set("cosmos", 8.5)
  prices.set("algorand", 0.2)
  prices.set("tezos", 0.95)
  prices.set("stellar", 0.12)
  prices.set("tether", 1.0) // Stablecoin
  prices.set("usdc", 1.0) // Stablecoin
  prices.set("dai", 1.0) // Stablecoin
  prices.set("uniswap", 8.0)
  prices.set("aave", 100)
  prices.set("compound", 55)
  prices.set("dogecoin", 0.09)
  prices.set("shiba", 0.00001)

  return prices
}
