"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

interface SearchProduct {
    id: number
    slug: string
    name: string
    description: string
    price: number
    images: string[]
}

export default function Navbar() {
    const { getTotalItems } = useCart()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchProduct[]>([])
    const [showSearchResults, setShowSearchResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Search products as user types
    const handleSearch = async (query: string) => {
        setSearchQuery(query)

        if (query.trim().length < 2) {
            setSearchResults([])
            setShowSearchResults(false)
            return
        }

        try {
            const response = await fetch('/api/products')
            const products = await response.json()

            const filtered = products.filter((product: SearchProduct) =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.description.toLowerCase().includes(query.toLowerCase())
            )

            setSearchResults(filtered.slice(0, 5)) // Show max 5 results
            setShowSearchResults(filtered.length > 0)
        } catch (error) {
            console.error('Search failed:', error)
            setSearchResults([])
            setShowSearchResults(false)
        }
    }

    // Handle search submission (Enter key)
    const handleSearchSubmit = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setShowSearchResults(false)
            router.push('/product')
        }
    }

    // Handle search result click
    const handleResultClick = (productSlug: string) => {
        setShowSearchResults(false)
        setSearchQuery('')
        router.push(`/product/${productSlug}`)
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Links to Home */}
                    <Link href="/" className="flex-shrink-0">
                        <img src="/ROLO.svg" alt="Rolodech" className="h-8 w-auto" />
                    </Link>

                    {/* Right side elements */}
                    <div className="flex items-center space-x-4">
                        {/* Search Bar */}
                        <div className="relative" ref={searchRef}>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                onKeyDown={handleSearchSubmit}
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-xs leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />

                            {/* Search Results Dropdown */}
                            {showSearchResults && searchResults.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xs shadow-lg z-50 max-h-80 overflow-y-auto">
                                    {searchResults.map((product) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleResultClick(product.slug)}
                                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500 truncate">
                                                        ${product.price}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-100">
                                        Press Enter to see all results
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Filters Dropdown Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xs shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Filters
                                <svg className="ml-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-xs shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1" role="menu">
                                        <Link
                                            href="/product"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Products
                                        </Link>
                                        <Link
                                            href="/dashboard"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/test-api"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                            role="menuitem"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Test API
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart Button */}
                        <Link href="/cart">
                            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-xs shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative">
                                Your Cart
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </nav>
    )
} 