# StudentOS AI Deployment Guide

This guide provides step-by-step instructions for deploying StudentOS AI to a production environment using **Render** for the backend, **Vercel** for the frontend, and **MongoDB Atlas** for the database.

## Architecture Overview
- **Database**: MongoDB Atlas (Cloud NoSQL Database)
- **Backend API**: Render (Node.js/Express Web Service)
- **Frontend App**: Vercel (React/Vite SPA)

---

## 1. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free cluster.
2. Under **Database Access**, create a new user with a secure password.
3. Under **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Render can connect to it.
4. Click **Connect -> Connect your application** and copy the Connection String.
5. Replace `<password>` in the connection string with the user password you created. Keep this URI handy.

---

## 2. Backend Deployment (Render)
We use the provided `render.yaml` for Blueprint deployment, or you can do it manually.

### Manual Approach:
1. Create an account on [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing the StudentOS code.
4. Configure the Web Service:
   - **Name**: `studentos-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: (Your MongoDB Atlas Connection String)
   - `JWT_SECRET`: (Generate a secure 64-character random string)
   - `CLIENT_URL`: `https://studentos-ai-frontend.vercel.app` (We will update this after deploying Vercel)
   - `GEMINI_API_KEY`: (Your Google Gemini API Key)
6. Click **Create Web Service**. Wait for the deployment to finish and copy the Render URL (e.g., `https://studentos-backend.onrender.com`).

---

## 3. Frontend Deployment (Vercel)
1. Create an account on [Vercel](https://vercel.com).
2. Click **Add New... -> Project**.
3. Import your GitHub repository.
4. Configure the Project:
   - **Project Name**: `studentos-ai-frontend`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
5. Open **Environment Variables** and add:
   - `VITE_API_URL`: `https://studentos-backend.onrender.com/api` (Use the Render URL you got from Step 2, appending `/api`)
6. Click **Deploy**.
7. Once deployed, Vercel will give you a public URL (e.g., `https://studentos-ai-frontend.vercel.app`).

---

## 4. Final Configuration Sync
1. Go back to your **Render Web Service** dashboard.
2. Navigate to **Environment**.
3. Update the `CLIENT_URL` to exactly match your new Vercel URL (e.g., `https://studentos-ai-frontend.vercel.app`). Do not include a trailing slash.
4. Save the changes (Render will automatically redeploy the backend with the updated CORS configuration).

---

## 5. Verification
- Open your Vercel URL in a browser.
- Attempt to register or log in using the Default Admin account (`admin@studentos.com` / `Admin123!`).
- Navigate to the AI Chatbot to verify the Gemini API connection.
- Verify file uploads (e.g., Resume builder) work correctly.
