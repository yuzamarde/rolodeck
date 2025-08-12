"use client"

import { useState, useRef, useCallback } from 'react'

interface ProductImageGalleryProps {
    images: string[]
    productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [startX, setStartX] = useState(0)
    const [currentTranslate, setCurrentTranslate] = useState(0)
    const [prevTranslate, setPrevTranslate] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null)

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
            if (movedBy < 0 && selectedImage < images.length - 1) {
                setSelectedImage(selectedImage + 1)
            } else if (movedBy > 0 && selectedImage > 0) {
                setSelectedImage(selectedImage - 1)
            }
        }

        setCurrentTranslate(0)
        setPrevTranslate(0)
    }, [isDragging, currentTranslate, prevTranslate, selectedImage, images.length])

    const nextImage = () => {
        if (selectedImage < images.length - 1) {
            setSelectedImage(selectedImage + 1)
        }
    }

    const prevImage = () => {
        if (selectedImage > 0) {
            setSelectedImage(selectedImage - 1)
        }
    }

    return (
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
                        src={images[selectedImage]}
                        alt={productName}
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
                    disabled={selectedImage === images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex justify-between gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
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
                            alt={`${productName} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    )
} 