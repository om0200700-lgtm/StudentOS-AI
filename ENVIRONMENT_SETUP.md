# Environment Setup Guide

To ensure StudentOS AI runs correctly in production, you must set the following environment variables. Use `server/.env.example` and `client/.env.example` as templates.

## Backend Variables (`server/.env`)

| Variable | Description | Requirement | Example |
|---|---|---|---|
| `NODE_ENV` | Sets the application environment. Must be `production` to enable strict security (Helmet, Rate Limiting). | Required | `production` |
| `PORT` | The port the backend listens on. Provided automatically by Render. | Optional | `5000` |
| `MONGODB_URI` | The connection string for your MongoDB Atlas cluster. | Required | `mongodb+srv://user:pass@cluster0...` |
| `JWT_SECRET` | A highly secure, random string used to sign authentication tokens. Should be >= 64 characters. | Required | `a2b3c4d5e6f7g8h9...` |
| `CLIENT_URL` | The exact URL of your frontend application. Used to configure CORS safely. No trailing slash. | Required | `https://studentos.vercel.app` |
| `GEMINI_API_KEY` | Your Google Gemini API Key required for AI Assistant features. | Required | `AIzaSyB...` |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID for Google Sign In. | Optional | `12345.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret for Google Sign In. | Optional | `GOCSPX-...` |
| `SMTP_HOST` | Hostname for outgoing email server (e.g., SendGrid, Mailgun). | Optional | `smtp.mailtrap.io` |
| `ADMIN_EMAIL` | Default admin email to seed into the DB if no admin exists. | Optional | `admin@studentos.com` |

## Frontend Variables (`client/.env`)

| Variable | Description | Requirement | Example |
|---|---|---|---|
| `VITE_API_URL` | The URL pointing to your backend's `/api` route. No trailing slash. | Required | `https://api.studentos.com/api` |
| `VITE_GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID for frontend Google Sign In button. | Optional | `12345.apps.googleusercontent.com` |

## How to Obtain Keys

### 1. MongoDB URI
- Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
- Deploy a free cluster, create a database user, and click "Connect".
- Choose "Connect your application" and copy the Node.js connection string.

### 2. Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
- Click "Create API Key" and generate a new key.

### 3. Google OAuth Credentials
- Go to [Google Cloud Console](https://console.cloud.google.com/).
- Create a new project and configure the OAuth consent screen.
- Go to Credentials -> Create Credentials -> OAuth client ID.
- Choose "Web application". Add your `CLIENT_URL` to Authorized JavaScript origins.
