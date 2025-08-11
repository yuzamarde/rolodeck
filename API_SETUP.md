# API Routes Setup Guide

## Overview
This project includes three main API routes:
- `/api/products` - Product data endpoint
- `/api/checkout` - Stripe payment processing
- `/api/customer` - Google Sheets customer data storage

## Environment Variables
Create a `.env.local` file in your project root with the following variables:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

## Setup Instructions

### 1. Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env.local`

### 2. Google Sheets Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a Service Account
5. Download the JSON credentials file
6. Share your Google Sheet with the service account email
7. Add credentials to `.env.local`

### 3. API Usage Examples

#### Products API
```typescript
// GET /api/products
const response = await fetch('/api/products')
const products = await response.json()
```

#### Checkout API
```typescript
// POST /api/checkout
const response = await fetch('/api/checkout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { id: 1, name: 'Barista Express', price: 798, quantity: 1 }
    ],
    customerEmail: 'customer@example.com'
  })
})
const { clientSecret } = await response.json()
```

#### Customer API
```typescript
// POST /api/customer
const response = await fetch('/api/customer', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'Interested in coffee machines',
    productInterest: 'Barista Express'
  })
})
const result = await response.json()
```

## File Structure
```
src/app/api/
├── products/
│   └── route.ts      # GET /api/products
├── checkout/
│   └── route.ts      # POST /api/checkout
└── customer/
    └── route.ts      # POST /api/customer
```

## Dependencies
- `stripe` - Payment processing
- `googleapis` - Google Sheets integration
- `next/server` - Next.js API utilities

## Testing
Test your API routes using tools like:
- Postman
- Thunder Client (VS Code extension)
- Browser Developer Tools
- curl commands

## Security Notes
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Implement proper authentication for production use
- Validate all input data
- Handle errors gracefully 