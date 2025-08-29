export interface Cryptocurrency {
  id: string
  name: string
  symbol: string
  color: string
  category: "major" | "defi" | "layer1" | "stablecoin" | "meme"
  price: string
  iconUrl: string
}

export const cryptocurrencies: Cryptocurrency[] = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    color: "#f7931a",
    category: "major",
    price: "$43,250",
    iconUrl: "/images/bitcoin-logo.png", // Updated to use the local image
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    color: "#627eea",
    category: "major",
    price: "$2,650",
    iconUrl: "/images/ethereum-logo.png", // Updated iconUrl
  },
  {
    id: "bnb",
    name: "BNB",
    symbol: "BNB",
    color: "#f3ba2f",
    category: "major",
    price: "$315",
    iconUrl: "/images/bnb-logo.png", // Updated iconUrl
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    color: "#9945ff",
    category: "layer1",
    price: "$98",
    iconUrl: "/images/solana-logo.png", // Updated iconUrl
  },
  {
    id: "xrp",
    name: "XRP",
    symbol: "XRP",
    color: "#23292f",
    category: "major",
    price: "$0.52",
    iconUrl: "/images/xrp-logo.png", // Updated iconUrl
  },
  {
    id: "cardano",
    name: "Cardano",
    symbol: "ADA",
    color: "#0033ad",
    category: "layer1",
    price: "$0.45",
    iconUrl: "/images/cardano-logo.png", // Updated iconUrl
  },
  {
    id: "avalanche",
    name: "Avalanche",
    symbol: "AVAX",
    color: "#e84142",
    category: "layer1",
    price: "$27",
    iconUrl: "/images/avalanche-logo.png", // Updated iconUrl
  },
  {
    id: "polkadot",
    name: "Polkadot",
    symbol: "DOT",
    color: "#e6007a",
    category: "layer1",
    price: "$7.2",
    iconUrl: "/images/polkadot-logo.png", // Updated iconUrl
  },
  {
    id: "polygon",
    name: "Polygon",
    symbol: "MATIC",
    color: "#8247e5",
    category: "layer1",
    price: "$0.85",
    iconUrl: "/images/polygon-logo.png", // Updated iconUrl
  },
  {
    id: "chainlink",
    name: "Chainlink",
    symbol: "LINK",
    color: "#375bd2",
    category: "defi",
    price: "$14.5",
    iconUrl: "/images/chainlink-logo.png", // Updated iconUrl
  },
  {
    id: "litecoin",
    name: "Litecoin",
    symbol: "LTC",
    color: "#bfbbbb",
    category: "major",
    price: "$73",
    iconUrl: "/images/litecoin-logo.png", // Updated iconUrl
  },
  {
    id: "cosmos",
    name: "Cosmos",
    symbol: "ATOM",
    color: "#2e3148",
    category: "layer1",
    price: "$8.1",
    iconUrl: "/images/cosmos-logo.png", // Updated iconUrl
  },
  {
    id: "algorand",
    name: "Algorand",
    symbol: "ALGO",
    color: "#000000",
    category: "layer1",
    price: "$0.18",
    iconUrl: "/images/algorand-logo.png", // Updated iconUrl
  },
  {
    id: "tezos",
    name: "Tezos",
    symbol: "XTZ",
    color: "#2c7df7",
    price: "$0.92",
    iconUrl: "/images/tezos-logo.png", // Updated iconUrl
  },
  {
    id: "stellar",
    name: "Stellar",
    symbol: "XLM",
    color: "#7d00ff",
    category: "major",
    price: "$0.11",
    iconUrl: "/images/stellar-logo.png", // Updated iconUrl
  },
  // Stablecoins
  {
    id: "tether",
    name: "Tether",
    symbol: "USDT",
    color: "#26a17b",
    category: "stablecoin",
    price: "$1.00",
    iconUrl: "/images/tether-logo.png", // Updated iconUrl
  },
  {
    id: "usdc",
    name: "USD Coin",
    symbol: "USDC",
    color: "#2775ca",
    category: "stablecoin",
    price: "$1.00",
    iconUrl: "/images/usd-coin-logo.png", // Updated iconUrl
  },
  {
    id: "dai",
    name: "Dai",
    symbol: "DAI",
    color: "#f5ac37",
    category: "stablecoin",
    price: "$1.00",
    iconUrl: "/images/dai-logo.png", // Updated iconUrl
  },
  // DeFi Tokens
  {
    id: "uniswap",
    name: "Uniswap",
    symbol: "UNI",
    color: "#ff007a",
    category: "defi",
    price: "$7.8",
    iconUrl: "/images/uniswap-logo.png", // Updated iconUrl
  },
  {
    id: "aave",
    name: "Aave",
    symbol: "AAVE",
    color: "#b6509e",
    category: "defi",
    price: "$95",
    iconUrl: "/images/aave-logo.png", // Updated iconUrl
  },
  {
    id: "compound",
    name: "Compound",
    symbol: "COMP",
    color: "#00d395",
    category: "defi",
    price: "$52",
    iconUrl: "/images/compound-logo.png", // Updated iconUrl
  },
  // Meme Coins
  {
    id: "dogecoin",
    name: "Dogecoin",
    symbol: "DOGE",
    color: "#c2a633",
    category: "meme",
    price: "$0.08",
    iconUrl: "/images/dogecoin-logo.png", // Updated iconUrl
  },
  {
    id: "shiba",
    name: "Shiba Inu",
    symbol: "SHIB",
    color: "#ffa409",
    category: "meme",
    price: "$0.000009",
    iconUrl: "/images/shiba-inu-logo.png", // Updated iconUrl
  },
]

export const categories = {
  all: "Alle",
  major: "Hauptwährungen",
  layer1: "Layer 1",
  defi: "DeFi",
  stablecoin: "Stablecoins",
  meme: "Meme Coins",
}
