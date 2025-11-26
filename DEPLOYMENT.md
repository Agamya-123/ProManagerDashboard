# Deployment Guide

This guide will help you deploy the **ProManager** application to the web. We will use **Render** for the backend (Node.js + SQLite) and **Netlify** for the frontend (React).

## Prerequisites
- A GitHub account.
- The project code pushed to a GitHub repository.

---

## Part 1: Backend Deployment (Render)

Render is a great platform for hosting Node.js applications.

1.  **Sign Up/Login**: Go to [render.com](https://render.com/) and log in with your GitHub account.
2.  **New Web Service**: Click **"New +"** and select **"Web Service"**.
3.  **Connect Repository**: Select your `proU` repository.
4.  **Configure Service**:
    - **Name**: `promanager-api` (or similar)
    - **Region**: Choose the one closest to you.
    - **Branch**: `main`
    - **Root Directory**: `server` (Important! Our backend is in the `server` folder)
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables**:
    - Scroll down to "Environment Variables".
    - Add `NODE_ENV` with value `production`.
    - (Optional) If you were using a cloud database like PostgreSQL, you would add the connection string here. Since we are using SQLite for this demo, the database file will be created on the disk. **Note:** On Render's free tier, the disk is ephemeral, meaning data resets on redeploy. For persistent data, use Render's **Disks** feature (paid) or a cloud database like **Supabase** or **Neon**.
6.  **Deploy**: Click **"Create Web Service"**.
7.  **Copy URL**: Once deployed, copy the URL (e.g., `https://promanager-api.onrender.com`). You will need this for the frontend.

---

## Part 2: Frontend Deployment (Netlify)

Netlify is excellent for hosting static sites and React apps.

1.  **Sign Up/Login**: Go to [netlify.com](https://www.netlify.com/) and log in.
2.  **New Site**: Click **"Add new site"** -> **"Import from existing project"**.
3.  **Connect GitHub**: Authorize Netlify to access your GitHub repositories.
4.  **Select Repository**: Choose your `proU` repository.
5.  **Configure Build**:
    - **Base directory**: `client` (Important! Our frontend is in the `client` folder)
    - **Build command**: `npm run build`
    - **Publish directory**: `dist` (Vite builds to `dist` by default)
6.  **Environment Variables**:
    - Click **"Show advanced"** -> **"New Variable"**.
    - Key: `VITE_API_URL`
    - Value: The **Render Backend URL** you copied earlier (e.g., `https://promanager-api.onrender.com/api`). **Note:** Make sure to append `/api` if your axios setup expects it, or just the base URL depending on your `client/src/api/index.js` configuration.
        - *Current Code Check*: Our `api/index.js` uses `baseURL: 'http://localhost:5000/api'`. So set `VITE_API_URL` to `https://promanager-api.onrender.com/api`.
        - *Code Update Needed*: You need to update `client/src/api/index.js` to use this variable:
          ```javascript
          const API = axios.create({
              baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
          });
          ```
7.  **Deploy**: Click **"Deploy site"**.

---

## Part 3: Final Polish

1.  **Update API Config**: Ensure your `client/src/api/index.js` is updated to use the environment variable as shown above.
2.  **Push Changes**: Commit and push this change to GitHub. Netlify will automatically redeploy the frontend.
3.  **Test**: Open your Netlify URL. You should be able to login and see data fetched from your Render backend!

**Enjoy your deployed application!** 🚀
