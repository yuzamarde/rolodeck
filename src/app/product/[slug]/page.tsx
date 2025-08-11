"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [product, setProduct] = useState<Product | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)

    // Carousel state
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [currentTranslate, setCurrentTranslate] = useState(0)
    const [prevTranslate, setPrevTranslate] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (params.slug) {
            fetchProduct(params.slug as string)
        }
    }, [params.slug])

    const fetchProduct = async (slug: string) => {
        try {
            const response = await fetch('/api/products')
            const products = await response.json()
            const foundProduct = products.find((p: Product) => p.slug === slug)
            if (foundProduct) {
                setProduct(foundProduct)
            }
        } catch (error) {
            console.error('Failed to fetch product:', error)
        } finally {
            setLoading(false)
        }
    }

    // Carousel functions
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        setIsDragging(true)
        setStartX(e.touches[0].clientX)
        setPrevTranslate(currentTranslate)
    }, [currentTranslate])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging) return
        e.preventDefault()
        const currentX = e.touches[0].clientX
        const diff = currentX - startX
        setCurrentTranslate(prevTranslate + diff)
    }, [isDragging, startX, prevTranslate])

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return
        setIsDragging(false)

        const movedBy = currentTranslate - prevTranslate

        if (Math.abs(movedBy) > 100) {
            if (movedBy < 0 && selectedImage < (product?.images.length || 1) - 1) {
                setSelectedImage(selectedImage + 1)
            } else if (movedBy > 0 && selectedImage > 0) {
                setSelectedImage(selectedImage - 1)
            }
        }

        setCurrentTranslate(0)
        setPrevTranslate(0)
    }, [isDragging, currentTranslate, prevTranslate, selectedImage, product?.images.length])

    const nextImage = () => {
        if (product && selectedImage < product.images.length - 1) {
            setSelectedImage(selectedImage + 1)
        }
    }

    const prevImage = () => {
        if (selectedImage > 0) {
            setSelectedImage(selectedImage - 1)
        }
    }

    const addToCart = () => {
        // In a real app, you would add to cart state management
        // For now, we'll just navigate to the cart page
        router.push('/cart')
    }

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl text-gray-600">Loading product...</div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <div className="text-xl text-gray-600">Product not found</div>
                </div>
            </div>
        )
    }

    const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)

    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ gridTemplateColumns: '40% 60%' }}>

                    {/* Left Section - Image Gallery (Sticky) */}
                    <div className="lg:sticky lg:top-24 self-start">
                        {/* Main Product Image with Carousel */}
                        <div className="relative h-120 rounded-xl overflow-hidden mb-4">
                            <div
                                ref={carouselRef}
                                className="relative w-full h-full"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                style={{
                                    transform: `translateX(${currentTranslate}px)`,
                                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                                }}
                            >
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover select-none"
                                    draggable={false}
                                />
                            </div>

                            {/* Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                disabled={selectedImage === 0}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextImage}
                                disabled={selectedImage === product.images.length - 1}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                                {selectedImage + 1} / {product.images.length}
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex justify-between gap-3 overflow-x-auto pb-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? 'border-amber-500'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Product Details */}
                    <div className="lg:pl-8 mb-18 py-8 ">
                        {/* Breadcrumbs */}
                        <nav className="text-sm text-gray-500 mb-4">
                            Machines & Equipment &gt;&gt; Breville
                        </nav>

                        {/* Product Name */}
                        <h1 className="text-3xl font-medium text-gray-900 mb-3">
                            {product.name}
                        </h1>

                        {/* Tagline */}
                        <p className="text-lg text-gray-700 mb-6">
                            The best-selling, home espresso machine, with a built-in grinder
                        </p>

                        {/* Price Information */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl text-gray-400 line-through mr-2">
                                    ${product.oldPrice}
                                </span>
                                <span className="text-2xl font-medium text-gray-900">
                                    ${product.price}
                                </span>
                            </div>
                            <span className="text-sm text-gray-500">
                                {discountPercentage}% off, limited time offer
                            </span>
                        </div>

                        {/* Color Options */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Colour</h3>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    {product.colors.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedColor(index)}
                                            className={`w-8 h-8 rounded-lg border-2 transition-all ${selectedColor === index
                                                ? 'border-amber-500'
                                                : 'border-gray-200 hover:border-gray-300'
                                                } ${color === 'Black' ? 'bg-gray-800' : 'bg-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                    {product.colors[selectedColor]}
                                </span>
                            </div>
                        </div>

                        {/* Product Description */}
                        <div className="mb-8">
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    One of the world's popular and well-recommended espresso machines for home use, the Barista Express is perfect for anyone wanting to get into coffee.
                                </p>
                                <p>
                                    This semi-automatic machine balances simplicity and flexibility. With automated, low pressure pre-infusion and shot timers, you can pull espresso at just the press of a button. Hone your skills tamping, and experimenting with various beans, doses and grind sizes.
                                </p>
                                <p>
                                    With an in-built grinder and steam wand, this all-in-one setup is all you need is freshly roasted coffee beans and a weighing scale, to take your espresso to the next level and make cafe-level, specialty coffee at home.
                                </p>
                            </div>
                        </div>

                        {/* What's in the box */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">What's in the box</h3>
                            <ul className="space-y-2 mb-8">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <Button
                        onClick={() => router.push('/product')}
                        className="flex items-center gap-2 rounded-xs text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Button>

                    <div className="text-xl font-medium text-gray-900">
                        Total ${product.price}
                    </div>

                    <Button
                        onClick={addToCart}
                        className="bg-green-600 hover:bg-green-700 rounded-xs text-white px-8 py-3 flex items-center gap-2"
                    >
                        Add to Cart
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Button>
                </div>
            </div>
        </div>
    )
} 