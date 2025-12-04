# Deployment Guide (Netlify)

This application is built with Next.js and uses a MySQL database. Because it uses Server-Side Rendering (SSR) and API routes, it requires a Node.js runtime, which Netlify supports.

## Prerequisites

1.  **Netlify Account**: [Sign up here](https://www.netlify.com/).
2.  **Cloud MySQL Database**: Since Netlify cannot access your `localhost`, you need a cloud-hosted database.
    *   **Options**:
        *   [PlanetScale](https://planetscale.com/) (Recommended for MySQL)
        *   [Aiven](https://aiven.io/mysql)
        *   [AWS RDS](https://aws.amazon.com/rds/)
        *   [DigitalOcean Managed Databases](https://www.digitalocean.com/products/managed-databases-mysql)

## Step 1: Set up your Cloud Database

1.  Create a MySQL database instance on your chosen provider.
2.  Get the connection details:
    *   **Host** (e.g., `aws.connect.psdb.cloud`)
    *   **User**
    *   **Password**
    *   **Database Name**
    *   **Port** (usually 3306)
3.  **Important**: If your provider requires SSL (most do), ensure you have the option enabled. This app is configured to enable SSL if `DB_SSL=true` is set.

## Step 2: Initialize the Cloud Database

You need to create the tables (`users`, `tasks`) in your new cloud database.

1.  Update your local `.env` file temporarily to point to your **Cloud Database** (or create a separate script).
2.  Run the init script locally:
    ```bash
    npx tsx scripts/init-db.ts
    ```
    *Note: This will connect to the cloud DB and create the tables.*

## Step 3: Deploy to Netlify

1.  **Push your code to GitHub** (or GitLab/Bitbucket).
2.  Log in to Netlify and click **"Add new site"** > **"Import an existing project"**.
3.  Select your repository.
4.  **Build Settings**:
    *   **Build command**: `npm run build`
    *   **Publish directory**: `.next`
5.  **Environment Variables** (Click "Show advanced" or go to Site Settings > Environment variables after creation):
    *   Add the following variables matching your Cloud DB credentials:
        *   `DB_HOST`
        *   `DB_USER`
        *   `DB_PASSWORD`
        *   `DB_NAME`
        *   `DB_PORT`
        *   `DB_SSL`: Set to `true`
        *   `JWT_SECRET`: Set to a strong random string (e.g., generated via `openssl rand -base64 32`).

6.  Click **"Deploy site"**.

## Troubleshooting

*   **Database Connection Error**: Double-check your Environment Variables in Netlify. Ensure `DB_SSL` is set to `true` if using a provider like PlanetScale or Aiven.
*   **Build Failed**: Check the Netlify deploy logs. Common issues include missing dependencies or linting errors (which should be caught locally).
