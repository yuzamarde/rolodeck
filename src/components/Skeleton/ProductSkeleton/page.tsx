interface ProductSkeletonProps {
    count?: number
}

export default function ProductSkeleton({ count = 4 }: ProductSkeletonProps) {
    return (
        <>
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            </div>

            {/* Products Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(count)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Skeleton Image */}
                        <div className="aspect-square bg-gray-200 animate-pulse"></div>

                        {/* Skeleton Product Info */}
                        <div className="p-4">
                            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-20 mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded animate-pulse w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
} 