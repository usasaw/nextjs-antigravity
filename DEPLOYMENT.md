# Deployment Guide (Netlify)

This application is built with Next.js and uses Firebase Realtime Database and Authentication via the Client SDK. It can be deployed as a standard Next.js application.

## Prerequisites

1.  **Netlify Account**: [Sign up here](https://www.netlify.com/).
2.  **Firebase Project**: You need a Firebase project with Realtime Database and Authentication enabled.
    *   Go to [Firebase Console](https://console.firebase.google.com/).
    *   Create a new project.
    *   Enable **Authentication** (Email/Password provider).
    *   Enable **Realtime Database**.
    *   Update `app/firebaseConfig.js` with your project's configuration keys (API Key, Auth Domain, etc.).

## Step 1: Configure Firebase

Ensure your `app/firebaseConfig.js` contains the correct configuration from your Firebase project settings (General > Your apps > Web app).

## Step 2: Deploy to Netlify

1.  **Push your code to GitHub** (or GitLab/Bitbucket).
2.  Log in to Netlify and click **"Add new site"** > **"Import an existing project"**.
3.  Select your repository.
4.  **Build Settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
5.  **Environment Variables**:
    *   Since this app uses client-side Firebase configuration, you don't strictly need server-side environment variables for the database connection unless you refactor to use them during build time.
    *   Ensure your Firebase Security Rules allow access to authenticated users.

6.  Click **"Deploy site"**.

## Troubleshooting

*   **Database Permission Denied**: Check your Firebase Realtime Database Rules. They should allow read/write for authenticated users.
    ```json
    {
      "rules": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
    ```
*   **Build Failed**: Check the Netlify deploy logs.
