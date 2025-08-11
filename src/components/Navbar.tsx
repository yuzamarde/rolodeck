import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Navbar() {
    return (
        <nav className="fixed top-0 left-2 right-2 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center">
                            <Image src="/ROLO.svg" alt="Rolodech" width={100} height={100} />
                        </Link>
                    </div>

                    {/* Navigation Links - Center */}
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-8">
                            <Link
                                href="/product"
                                className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Product
                            </Link>
                            <Link
                                href="/search"
                                className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Search
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Cart */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/cart"
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Your Cart
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
} 