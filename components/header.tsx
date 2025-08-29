import Image from "next/image"

const Header = () => {
  return (
    <header className="bg-white p-8 flex items-center justify-between border-b border-gray-100">
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
      {/* rest of code here */}
    </header>
  )
}

export default Header
