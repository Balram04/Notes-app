# Complete Vercel Deployment Guide for Notes App

This guide will walk you through deploying your Next.js notes application to Vercel, including database setup, environment configuration, and troubleshooting.

## 📋 Prerequisites

Before deploying, ensure you have:
- A GitHub account
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- MongoDB Atlas account or another MongoDB hosting service
- SMTP email service (Gmail, SendGrid, or similar)

## 🚀 Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
```

### 1.2 Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/yourusername/your-repo-name.git
git branch -M main
git push -u origin main
```

### 1.3 Create Environment Variables Template
Create a `.env.example` file to document required environment variables:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
MONGODB_DB=auth_app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_COOKIE_NAME=session
JWT_COOKIE_MAX_DAYS=7

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com

# Application URL (will be set automatically by Vercel)
APP_BASE_URL=https://your-app.vercel.app

# Environment
NODE_ENV=production
```

## 🗄️ Step 2: Set Up MongoDB Atlas

### 2.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (select the free tier)

### 2.2 Configure Database Access
1. Go to "Database Access" in the sidebar
2. Click "Add New Database User"
3. Create a user with "Read and write to any database" privileges
4. Note down the username and password

### 2.3 Configure Network Access
1. Go to "Network Access" in the sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment
4. Confirm the change

### 2.4 Get Connection String
1. Go to "Clusters" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your preferred database name (e.g., `notes_app`)

## 📧 Step 3: Set Up Email Service

### Option A: Gmail App Password
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account settings > Security > App passwords
3. Generate an app password for "Mail"
4. Use this password in `SMTP_PASS`

### Option B: SendGrid (Recommended for production)
1. Sign up for [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Use these settings:
   - `SMTP_HOST`: smtp.sendgrid.net
   - `SMTP_PORT`: 587
   - `SMTP_USER`: apikey
   - `SMTP_PASS`: your-sendgrid-api-key

## 🚢 Step 4: Deploy to Vercel

### 4.1 Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `notes` folder as the root directory if prompted

### 4.2 Configure Build Settings
Vercel should automatically detect your Next.js app. If needed, configure:
- **Framework Preset**: Next.js
- **Root Directory**: `notes` (if your app is in a subdirectory)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 4.3 Add Environment Variables
In the Vercel project settings, add all environment variables:

1. Go to your project dashboard on Vercel
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/notes_app
MONGODB_DB = notes_app
JWT_SECRET = your-super-secret-jwt-key-minimum-32-characters-long
JWT_COOKIE_NAME = session
JWT_COOKIE_MAX_DAYS = 7
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your-email@gmail.com
SMTP_PASS = your-app-password
SMTP_FROM = your-email@gmail.com
NODE_ENV = production
```

**Important**: Make sure to set these variables for all environments (Production, Preview, Development).

### 4.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project-name.vercel.app`

## ⚙️ Step 5: Post-Deployment Configuration

### 5.1 Update APP_BASE_URL
1. After deployment, update the `APP_BASE_URL` environment variable
2. Set it to your actual Vercel URL: `https://your-project-name.vercel.app`
3. Redeploy the application

### 5.2 Test Your Application
1. Visit your deployed URL
2. Test user registration with email verification
3. Test login/logout functionality
4. Test note creation, editing, and deletion

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. MongoDB Connection Issues
**Error**: "MongoError: Authentication failed"
- Check your MongoDB username and password
- Ensure the user has proper permissions
- Verify the connection string format

#### 2. Email Not Sending
**Error**: "SMTP Authentication failed"
- For Gmail: Ensure you're using an app password, not your regular password
- Check that 2FA is enabled on your Gmail account
- Verify SMTP settings are correct

#### 3. JWT Secret Errors
**Error**: "JWT Secret not found"
- Ensure `JWT_SECRET` is set in Vercel environment variables
- Use a strong secret (minimum 32 characters)
- Redeploy after adding the variable

#### 4. Build Failures
**Error**: "Module not found" or TypeScript errors
- Check that all dependencies are in `package.json`
- Verify TypeScript configuration
- Check for any missing imports

#### 5. Session Issues
**Error**: "Session not working"
- Ensure `JWT_SECRET` is the same across all deployments
- Check cookie settings in production
- Verify that `APP_BASE_URL` is correctly set

### Environment Variable Checklist
Make sure all these variables are set in Vercel:
- ✅ `MONGODB_URI`
- ✅ `MONGODB_DB`
- ✅ `JWT_SECRET`
- ✅ `JWT_COOKIE_NAME`
- ✅ `JWT_COOKIE_MAX_DAYS`
- ✅ `SMTP_HOST`
- ✅ `SMTP_PORT`
- ✅ `SMTP_USER`
- ✅ `SMTP_PASS`
- ✅ `SMTP_FROM`
- ✅ `APP_BASE_URL`
- ✅ `NODE_ENV`

## 🔄 Continuous Deployment

Your app is now set up for continuous deployment. Any push to your main branch will automatically trigger a new deployment.

### Setting Up Development/Staging Environments
1. Create branches for `development` and `staging`
2. In Vercel, you can create preview deployments for these branches
3. Use different environment variables for each environment

## 📈 Monitoring and Analytics

### Vercel Analytics
1. Enable Vercel Analytics in your project settings
2. Add the analytics package to your app:
```bash
npm install @vercel/analytics
```

### Error Monitoring
Consider adding error monitoring services like:
- Sentry
- LogRocket
- Bugsnag

## 🚀 Performance Optimization

### Image Optimization
Your app already has image domain configuration in `next.config.ts`. Make sure to use Next.js Image component for better performance.

### Caching
Vercel automatically handles caching for your static assets and API routes.

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files to your repository
- Use strong, unique secrets for production
- Regularly rotate API keys and passwords

### Database Security
- Regularly update MongoDB Atlas IP whitelist
- Use strong database passwords
- Enable MongoDB Atlas security features

## 📞 Support

If you encounter issues during deployment:
1. Check Vercel's deployment logs
2. Review MongoDB Atlas logs
3. Test environment variables locally
4. Check the Vercel documentation
5. Contact support if needed

## 🎉 Success!

Your Notes app should now be successfully deployed on Vercel with:
- ✅ User authentication with email verification
- ✅ Secure session management
- ✅ Database connectivity
- ✅ Email notifications
- ✅ Responsive UI
- ✅ Production-ready configuration

Visit your deployed app and start taking notes! 📝
