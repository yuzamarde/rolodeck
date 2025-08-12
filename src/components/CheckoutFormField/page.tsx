"use client"

interface CheckoutFormFieldProps {
    id: string
    label: string
    type: string
    value: string
    placeholder: string
    required?: boolean
    optional?: boolean
    error?: string
    onChange: (value: string) => void
}

export default function CheckoutFormField({
    id,
    label,
    type,
    value,
    placeholder,
    required = false,
    optional = false,
    error,
    onChange
}: CheckoutFormFieldProps) {
    const hasError = !!error
    const borderColor = hasError ? 'border-red-300' : 'border-gray-300'

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500">*</span>}
                {optional && <span className="text-gray-400 font-normal">Optional</span>}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${borderColor}`}
                required={required}
            />
            {hasError && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    )
} 