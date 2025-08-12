import Navbar from '@/components/Navbar/page'

export default function ProductDetailSkeleton() {
    return (
        <div className="min-h-screen">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ gridTemplateColumns: '40% 60%' }}>

                    {/* Left Section - Image Gallery Skeleton (Sticky) */}
                    <div className="lg:sticky lg:top-24 self-start">
                        {/* Main Product Image Skeleton */}
                        <div className="relative h-120 rounded-xl overflow-hidden mb-4">
                            <div className="w-full h-full bg-gray-200 animate-pulse"></div>

                            {/* Navigation Arrows Skeleton */}
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>

                            {/* Image Counter Skeleton */}
                            <div className="absolute bottom-4 right-4 w-16 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        </div>

                        {/* Thumbnail Images Skeleton */}
                        <div className="flex justify-between gap-3 overflow-x-auto pb-2">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div key={item} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                            ))}
                        </div>
                    </div>

                    {/* Right Section - Product Details Skeleton */}
                    <div className="lg:pl-8 mb-18 py-8">
                        {/* Breadcrumbs Skeleton */}
                        <div className="mb-4">
                            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
                        </div>

                        {/* Product Name Skeleton */}
                        <div className="mb-3">
                            <div className="h-8 bg-gray-200 rounded w-80 animate-pulse"></div>
                        </div>

                        {/* Tagline Skeleton */}
                        <div className="mb-6">
                            <div className="h-6 bg-gray-200 rounded w-96 animate-pulse"></div>
                        </div>

                        {/* Price Information Skeleton */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
                                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                        </div>

                        {/* Color Options Skeleton */}
                        <div className="mb-8">
                            <div className="h-6 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                    <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                                </div>
                                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Product Description Skeleton */}
                        <div className="mb-8">
                            <div className="space-y-4">
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                            </div>
                        </div>

                        {/* What's in the box Skeleton */}
                        <div className="mb-8">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                            <ul className="space-y-2 mb-8">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                                    <li key={item} className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-80 animate-pulse"></div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Footer Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 z-50">
                <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="w-24 h-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                    <div className="w-32 h-12 bg-gray-200 rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    )
} 