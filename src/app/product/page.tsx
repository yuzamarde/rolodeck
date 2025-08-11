"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'

interface Product {
    id: number
    slug: string
    name: string
    oldPrice: number
    price: number
    colors: string[]
    description: string
    features: string[]
    images: string[]
}

export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products')
            const data = await response.json()
            setProducts(data)
        } catch (error) {
            console.error('Failed to fetch products:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <h1 className="text-4xl sm:px-12 lg:px-10 font-medium text-gray-900 mt-24">Breville</h1>

                {/* Skeleton Loading Grid */}
                <div className="w-full mx-auto sm:px-12 lg:px-10 mt-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Skeleton Image */}
                                <div className="relative h-100 overflow-hidden">
                                    <div className="w-full h-full bg-gray-200 animate-pulse border-2 border-gray-200 rounded-xl"></div>
                                </div>

                                {/* Skeleton Product Info */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                        <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                                    </div>

                                    {/* Skeleton Description */}
                                    <div className="space-y-2 mb-6">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <h1 className="text-4xl sm:px-12 lg:px-10 font-medium text-gray-900 mt-24">Breville</h1>

            {/* Product Grid */}
            <div className="w-full mx-auto sm:px-12 lg:px-10 mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map((product) => (
                        <Link key={product.id} href={`/product/${product.slug}`}>
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2">
                                {/* Product Image */}
                                <div className="relative h-100 overflow-hidden">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-300 border-2 border-gray-200 rounded-xl"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-normal text-gray-900">
                                            {product.name}
                                        </h3>
                                        <span className="text-xl font-normal">
                                            ${product.price}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-400 mb-6 line-clamp-2">
                                        {product.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
