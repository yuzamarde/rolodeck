"use client"

interface ProductDetailsProps {
    product: {
        name: string
        oldPrice: number
        price: number
        colors: string[]
        description: string
        features: string[]
    }
    selectedColor: number
    onColorSelect: (index: number) => void
}

export default function ProductDetails({
    product,
    selectedColor,
    onColorSelect
}: ProductDetailsProps) {
    const discountPercentage = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)

    return (
        <div className="lg:pl-8 mb-18 py-8">
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
                                onClick={() => onColorSelect(index)}
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
                        One of the world&apos;s popular and well-recommended espresso machines for home use, the Barista Express is perfect for anyone wanting to get into coffee.
                    </p>
                    <p>
                        This semi-automatic machine balances simplicity and flexibility. With automated, low pressure pre-infusion and shot timers, you can pull espresso at just the press of a button. Hone your skills tamping, and experimenting with various beans, doses and grind sizes.
                    </p>
                    <p>
                        With an in-built grinder and steam wand, this all-in-one setup is all you need is freshly roasted coffee beans and a weighing scale, to take your espresso to the next level and make cafe-level, specialty coffee at home.
                    </p>
                </div>
            </div>

            {/* What&apos;s in the box */}
            <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">What&apos;s in the box</h3>
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
    )
} 