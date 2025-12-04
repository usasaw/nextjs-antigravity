# Deployment Guide (Netlify)

This application is built with Next.js and uses Firebase Realtime Database. Because it uses Server-Side Rendering (SSR) and API routes, it requires a Node.js runtime, which Netlify supports.

## Prerequisites

1.  **Netlify Account**: [Sign up here](https://www.netlify.com/).
2.  **Firebase Project**: You need a Firebase project with Realtime Database enabled.
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project.
    *   Enable **Realtime Database** and **Authentication** (if used).
    *   Generate a **Service Account Private Key** from Project Settings > Service Accounts.

## Step 1: Set up Firebase

1.  Create a Firebase project if you haven't already.
2.  Get the configuration details:
    *   **Project ID**
    *   **Client Email**
    *   **Private Key**
    *   **Database URL**

## Step 2: Deploy to Netlify

1.  **Push your code to GitHub** (or GitLab/Bitbucket).
2.  Log in to Netlify and click **"Add new site"** > **"Import an existing project"**.
3.  Select your repository.
4.  **Build Settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
5.  **Environment Variables** (Click "Show advanced" or go to Site Settings > Environment variables after creation):
    *   Add the following variables matching your Firebase credentials:
        *   `FIREBASE_PROJECT_ID`
        *   `FIREBASE_CLIENT_EMAIL`
        *   `FIREBASE_PRIVATE_KEY`
        *   `FIREBASE_DATABASE_URL`
        *   `JWT_SECRET`: Set to a strong random string.

6.  Click **"Deploy site"**.

## Troubleshooting

*   **Database Connection Error**: Double-check your Environment Variables in Netlify. Ensure the private key is correctly formatted (newlines might need handling if pasted directly).
*   **Build Failed**: Check the Netlify deploy logs.
