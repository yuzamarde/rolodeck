# Vercel Deployment Guide

## Prerequisites
- Vercel account
- GitHub repository with your Next.js project
- Stripe account (for payment processing)
- Google Cloud Platform account (for Google Sheets integration)

## Step 1: Environment Variables Setup

### Create `.env.local` file in your project root:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key

# Google Sheets API Configuration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key content\n-----END PRIVATE KEY-----"
GOOGLE_SPREADSHEET_ID=your_actual_google_sheet_id
```

### Important Notes:
- **STRIPE_SECRET_KEY**: Must start with `sk_test_` for test mode or `sk_live_` for production
- **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**: Must start with `pk_test_` for test mode or `pk_live_` for production
- **GOOGLE_PRIVATE_KEY**: Must include the entire private key including BEGIN and END markers
- **GOOGLE_SPREADSHEET_ID**: Extract from your Google Sheets URL

## Step 2: Vercel Environment Variables

### In your Vercel dashboard:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each environment variable:

| Name | Value | Environment |
|------|-------|-------------|
| `STRIPE_SECRET_KEY` | `sk_test_...` | Production, Preview, Development |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Production, Preview, Development |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `email@project.iam.gserviceaccount.com` | Production, Preview, Development |
| `GOOGLE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----` | Production, Preview, Development |
| `GOOGLE_SPREADSHEET_ID` | `your_sheet_id` | Production, Preview, Development |

### Important:
- **Production**: Used for your live site
- **Preview**: Used for pull request previews
- **Development**: Used for local development

## Step 3: Deploy to Vercel

### Option 1: Git Integration (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel will automatically deploy on every push to main branch
3. Environment variables will be automatically available

### Option 2: Manual Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts

## Step 4: Verify Deployment

### Check API Routes:
- `/api/products` - Should return product data
- `/api/checkout` - Should work with Stripe (if configured)
- `/api/customer` - Should work with Google Sheets (if configured)

### Test Payment Flow:
1. Add items to cart
2. Proceed to checkout
3. Verify Stripe integration works

## Troubleshooting

### Common Issues:

#### 1. "Neither apiKey nor config.authenticator provided"
- **Cause**: Missing environment variables
- **Solution**: Ensure all environment variables are set in Vercel dashboard

#### 2. "Stripe is not configured"
- **Cause**: Missing STRIPE_SECRET_KEY
- **Solution**: Add STRIPE_SECRET_KEY to Vercel environment variables

#### 3. "Google Sheets is not configured"
- **Cause**: Missing Google Sheets credentials
- **Solution**: Add GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, and GOOGLE_SPREADSHEET_ID

#### 4. Build Fails
- **Cause**: Environment variables not available during build
- **Solution**: Ensure environment variables are set for all environments (Production, Preview, Development)

### Environment Variable Validation:

```typescript
// Add this to your API routes to debug
console.log('Environment variables check:', {
    hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
    hasGoogleEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    hasGoogleKey: !!process.env.GOOGLE_PRIVATE_KEY,
    hasGoogleSheet: !!process.env.GOOGLE_SPREADSHEET_ID
})
```

## Security Best Practices

1. **Never commit `.env.local` to Git**
2. **Use test keys for development**
3. **Rotate production keys regularly**
4. **Limit API key permissions**
5. **Monitor API usage**

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Test API routes locally first
4. Check Stripe and Google Cloud Console for errors 