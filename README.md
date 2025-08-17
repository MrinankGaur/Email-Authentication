# Email Authentication System

A full-stack email authentication system built with Next.js frontend and Node.js backend, featuring secure user registration, login, email verification, and password reset functionality.

## 🚀 Features

- **User Authentication**
  - User registration with email verification
  - Secure login with JWT tokens
  - Password change functionality
  - Forgot password with email reset
  - Protected routes with middleware

- **Security Features**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Email verification tokens
  - Password reset tokens
  - CORS protection
  - Cookie-based token storage

- **Email Services**
  - Email verification on registration
  - Password reset emails
  - Handlebars email templates
  - Nodemailer integration

## 🏗️ Project Structure

```
Email-Authentication/
├── auth-kit-client/          # Next.js Frontend
│   ├── app/                  # App router components
│   ├── Components/           # Reusable UI components
│   ├── context/              # React context providers
│   ├── hooks/                # Custom React hooks
│   └── providers/            # Context providers
├── Backend/                  # Node.js Server
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── db/              # Database connection
│   │   ├── helpers/          # Utility functions
│   │   ├── middleware/       # Authentication middleware
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   └── views/            # Email templates
│   └── server.js             # Main server file
└── README.md                 # This file
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Handlebars** - Email templates

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB database
- Email service (Gmail, SendGrid, etc.)

## 🚀 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Email-Authentication
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com
```

### 3. Frontend Setup
```bash
cd auth-kit-client
npm install
```

Create a `.env.local` file in the auth-kit-client directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Start the Development Servers

**Backend:**
```bash
cd Backend
npm start
```
Server will run on http://localhost:5000

**Frontend:**
```bash
cd auth-kit-client
npm run dev
```
Frontend will run on http://localhost:3000

## 🔧 Available Scripts

### Backend
- `npm start` - Start development server with nodemon

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/forgot-password` - Send password reset email
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/change-password` - Change password (authenticated)
- `GET /api/auth/me` - Get current user info

## 🔐 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `EMAIL_USER` - Email service username
- `EMAIL_PASS` - Email service password
- `EMAIL_FROM` - Sender email address

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL` - Backend API URL

## 🎨 UI Components

The frontend includes reusable components:
- `LoginForm` - User login interface
- `RegisterForm` - User registration interface
- `ForgotPasswordForm` - Password reset request
- `ChangePasswordForm` - Password change interface
- `EmailVerification` - Email verification page
- `PasswordReset` - Password reset page

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Email Verification** - Required email verification on registration
- **Token Expiration** - Automatic token expiration for security
- **CORS Protection** - Cross-origin resource sharing protection
- **Input Validation** - Server-side input validation
- **Rate Limiting** - Protection against brute force attacks

## 📧 Email Templates

The system uses Handlebars templates for:
- Email verification emails
- Password reset emails

Templates are located in `Backend/src/views/`

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables on your hosting platform
2. Ensure MongoDB is accessible
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting service
3. Update environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error logs and steps to reproduce

## 🔄 Updates

Stay updated with the latest changes by:
- Watching the repository
- Checking the releases page
- Following the commit history

---

**Built with ❤️ using Next.js and Node.js**
