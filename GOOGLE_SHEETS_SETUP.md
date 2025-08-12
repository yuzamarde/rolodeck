# Google Sheets API Setup Guide

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create credentials (API Key)
5. Copy your API Key

## 2. Google Sheets Setup

### Products Sheet (existing)
- Sheet name: `products-template`
- Range: `A:J`
- Columns: ID, Slug, Name, Old Price, Price, Colors, Description, Features, Images

### Orders Sheet (new)
- Sheet name: `Orders`
- Range: `A:L`
- Columns:
  - A: Order ID
  - B: Order Date
  - C: Customer Name
  - D: Email
  - E: Street Address
  - F: House Number
  - G: Postal Code
  - H: Product Name
  - I: Product Price
  - J: Quantity
  - K: Color
  - L: Total Amount

## 3. Environment Variables

Create `.env.local` file in your project root:

```bash
# For server-side API routes (existing)
GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here

# For client-side checkout (new)
NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here
NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
```

## 4. Spreadsheet ID

1. Open your Google Sheet
2. Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`
3. Paste it in your `.env.local` file

## 5. Permissions

Make sure your Google Sheet is accessible:
- Option 1: Make it "Anyone with the link can view"
- Option 2: Share with your service account email

## 6. Testing

1. Start your development server: `npm run dev`
2. Add products to cart
3. Go through checkout process
4. Check your Google Sheets Orders tab for new entries

## Troubleshooting

### Common Issues:
- **403 Permission Denied**: Check sheet permissions and API key restrictions
- **404 Not Found**: Verify spreadsheet ID and sheet names
- **API Key Issues**: Ensure Google Sheets API is enabled in Cloud Console

### Security Notes:
- `NEXT_PUBLIC_` variables are exposed to the browser
- For production, consider using server-side API routes instead
- Restrict your API key to only Google Sheets API access 