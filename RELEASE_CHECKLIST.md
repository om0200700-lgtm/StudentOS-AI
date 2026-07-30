# Pre-Release Production Checklist

Before officially launching StudentOS AI to real users, complete every item on this checklist.

## 1. Infrastructure & Databases
- [ ] **MongoDB Atlas**: Ensure IP Access List allows the backend IP (or `0.0.0.0/0` if using dynamic IPs).
- [ ] **MongoDB Atlas**: Verify database user has correct read/write permissions.
- [ ] **MongoDB Atlas**: Backup configuration is enabled.

## 2. Security Configuration
- [ ] **JWT Secret**: Ensure `JWT_SECRET` is a cryptographically secure random string (not the default development key).
- [ ] **CORS**: Verify `CLIENT_URL` in the backend exactly matches the frontend Vercel production URL (no trailing slash).
- [ ] **NODE_ENV**: Verify `NODE_ENV=production` is set in the backend to enable Helmet and Express Rate Limiting.
- [ ] **Rate Limiting**: Confirm the auth rate limit (20 requests/15 mins) works correctly in production to prevent brute force attacks.

## 3. Environment Variables
- [ ] **Frontend**: `VITE_API_URL` points to the production backend URL (e.g., `https://my-backend.onrender.com/api`).
- [ ] **Backend**: `GEMINI_API_KEY` is present and valid.
- [ ] **Backend**: Default `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set securely. (Change the password immediately after first login).

## 4. Feature Verification (Post-Deployment)
- [ ] **Authentication**: Register a new user and log in successfully.
- [ ] **File Uploads**: Upload a profile picture or assignment file and verify it persists.
- [ ] **AI Assistant**: Open the AI Chatbot and verify it responds (validates Gemini API).
- [ ] **Emails**: Trigger a password reset to verify SMTP is working.

## 5. Performance & Health
- [ ] **Health Endpoint**: Ping `https://<your-backend-url>/api/health` and expect a 200 OK status.
- [ ] **Vercel Caching**: Verify frontend static assets are being cached by checking the Network tab for `Cache-Control: public, max-age=31536000, immutable`.
