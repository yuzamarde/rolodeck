"use client"

interface PaymentFormFieldProps {
    id: string
    label: string
    type: string
    value: string
    placeholder: string
    onChange: (value: string) => void
    required?: boolean
}

export default function PaymentFormField({
    id,
    label,
    type,
    value,
    placeholder,
    onChange,
    required = false
}: PaymentFormFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                required={required}
            />
        </div>
    )
} 