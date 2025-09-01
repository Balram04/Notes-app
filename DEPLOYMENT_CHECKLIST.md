# Vercel Deployment Checklist ✅

Use this checklist to ensure a smooth deployment of your Notes app to Vercel.

## Pre-Deployment Checklist

### Repository Setup
- [ ] Git repository initialized
- [ ] Code committed to GitHub
- [ ] `.gitignore` includes `.env*` files
- [ ] `.env.example` file created with all required variables

### Database Setup (MongoDB Atlas)
- [ ] MongoDB Atlas account created
- [ ] Database cluster created (free tier is sufficient)
- [ ] Database user created with read/write permissions
- [ ] Network access configured (allow 0.0.0.0/0 for Vercel)
- [ ] Connection string obtained and tested

### Email Service Setup
- [ ] SMTP service configured (Gmail App Password or SendGrid)
- [ ] SMTP credentials tested locally
- [ ] Email templates verified

### Local Testing
- [ ] App runs successfully with `npm run dev`
- [ ] Database connection working
- [ ] Email verification working
- [ ] All features tested (signup, login, notes CRUD)

## Vercel Deployment Steps

### Project Setup
- [ ] Vercel account created
- [ ] GitHub repository connected to Vercel
- [ ] Project imported (select `notes` folder as root if needed)

### Environment Variables Configuration
Add all these variables in Vercel Project Settings > Environment Variables:

#### Database
- [ ] `MONGODB_URI` - Your MongoDB Atlas connection string
- [ ] `MONGODB_DB` - Database name (e.g., "notes_app")

#### Authentication
- [ ] `JWT_SECRET` - Strong secret (min 32 characters)
- [ ] `JWT_COOKIE_NAME` - Cookie name (e.g., "session")
- [ ] `JWT_COOKIE_MAX_DAYS` - Cookie expiration (e.g., "7")

#### Email
- [ ] `SMTP_HOST` - SMTP server hostname
- [ ] `SMTP_PORT` - SMTP port (usually 587)
- [ ] `SMTP_USER` - SMTP username/email
- [ ] `SMTP_PASS` - SMTP password/API key
- [ ] `SMTP_FROM` - From email address

#### Application
- [ ] `NODE_ENV` - Set to "production"
- [ ] `APP_BASE_URL` - Your Vercel domain (update after first deploy)

### Deployment
- [ ] Initial deployment triggered
- [ ] Build completed successfully
- [ ] App accessible at Vercel URL

## Post-Deployment Checklist

### Verification
- [ ] App loads without errors
- [ ] User registration works
- [ ] Email verification received
- [ ] Login/logout functionality works
- [ ] Notes can be created, edited, and deleted
- [ ] Session persistence works across page refreshes

### Configuration Updates
- [ ] `APP_BASE_URL` updated with actual Vercel domain
- [ ] Redeployment triggered after URL update

### Production Optimization
- [ ] Custom domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Error monitoring setup (optional)

## Troubleshooting Quick Fixes

### Common Issues
- **MongoDB connection fails**: Check connection string and IP whitelist
- **Email not sending**: Verify SMTP credentials and app passwords
- **JWT errors**: Ensure JWT_SECRET is set and consistent
- **Build failures**: Check for TypeScript errors and missing dependencies
- **Session issues**: Verify all JWT-related environment variables

### Debug Steps
1. Check Vercel deployment logs
2. Test environment variables locally
3. Verify MongoDB Atlas configuration
4. Test SMTP settings with a simple email test

## Success Criteria
- ✅ App deployed and accessible
- ✅ User authentication working
- ✅ Email verification functional
- ✅ Database operations successful
- ✅ All environment variables properly configured
- ✅ No console errors in production

---

**Note**: Keep this checklist handy for future deployments and team members!
