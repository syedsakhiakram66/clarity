# IBM Watson Integration Guide

## Overview
CLARITY now uses IBM Watson's Granite 3 8B Instruct model instead of Anthropic's Claude API for repository analysis.

## Changes Made

### 1. Environment Configuration
- Created `.env` file with IBM Watson credentials
- Added `.env.example` as a template
- Updated `.gitignore` to exclude environment files

### 2. API Integration
- **Authentication**: Implemented OAuth 2.0 token exchange with IBM IAM
- **Endpoint**: `https://us-south.ml.cloud.ibm.com/ml/v1/text/chat`
- **Model**: `ibm/granite-3-8b-instruct`

### 3. Code Changes in `App.jsx`

#### Added IBM Watson Token Exchange
```javascript
async function getIBMAccessToken() {
  const response = await fetch(
    "https://iam.cloud.ibm.com/identity/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ibm:params:oauth:grant-type:apikey",
        apikey: import.meta.env.VITE_IBM_API_KEY,
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
}
```

#### Updated Analysis Function
- Replaced Anthropic API call with IBM Watson API
- Added token authentication step
- Updated request format to match IBM Watson's chat API
- Modified response parsing to handle IBM Watson's response structure

#### Enhanced Error Handling
- Added specific error messages for authentication failures
- Added project ID validation errors
- Added JSON parsing error handling

## Setup Instructions

### 1. Get IBM Watson Credentials

1. Go to [IBM Cloud](https://cloud.ibm.com/)
2. Create or access your Watson Studio project
3. Get your API key from [IAM API Keys](https://cloud.ibm.com/iam/apikeys)
4. Get your Project ID from Watson Studio project settings

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Update the values in `.env`:
```env
VITE_IBM_API_KEY=your-actual-api-key
VITE_IBM_PROJECT_ID=your-actual-project-id
```

### 3. Install Dependencies & Run

```bash
npm install
npm run dev
```

## API Request Flow

1. **User initiates analysis** → Frontend fetches GitHub repository data
2. **Token Exchange** → Frontend requests access token from IBM IAM using API key
3. **Analysis Request** → Frontend sends repository context to IBM Watson with access token
4. **Response Processing** → Parse JSON response and display results

## Response Format

IBM Watson returns responses in this format:
```json
{
  "choices": [
    {
      "message": {
        "content": "JSON string with analysis results"
      }
    }
  ]
}
```

The content is then parsed to extract the structured analysis data.

## Security Notes

⚠️ **Important**: The current implementation stores API keys in the frontend, which is **not secure for production**. 

### Recommended Next Steps:
1. Create a backend API service
2. Move IBM Watson API calls to the backend
3. Implement proper authentication for frontend users
4. Store IBM credentials securely on the server

## Troubleshooting

### "Authentication failed"
- Check that your `VITE_IBM_API_KEY` is correct
- Verify the API key has proper permissions in IBM Cloud

### "Invalid project ID"
- Ensure `VITE_IBM_PROJECT_ID` matches your Watson Studio project
- Verify the project has access to the Granite model

### "Failed to parse AI response"
- The model may not be returning valid JSON
- Check the console for the raw response
- May need to adjust the system prompts for better JSON formatting

## Model Information

- **Model**: IBM Granite 3 8B Instruct
- **Provider**: IBM Watson Machine Learning
- **Region**: US South
- **API Version**: 2023-05-29

## Support

For IBM Watson API issues, refer to:
- [IBM Watson Documentation](https://cloud.ibm.com/docs/watson)
- [IBM Cloud Support](https://cloud.ibm.com/unifiedsupport/supportcenter)