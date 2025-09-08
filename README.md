# Authentication System

A comprehensive Node.js/Express/MongoDB authentication system with secure user registration, email verification, and JWT-based authentication.

## Features

- User registration with email verification
- Secure password hashing using bcrypt
- JWT-based authentication with HTTP-only cookies
- Email verification using Mailtrap
- Welcome email after successful verification
- Password reset functionality with email
- Password reset success notifications
- Protected routes using middleware
- Last login tracking
- Session management with logout
- Protection against common security vulnerabilities
- RESTful API endpoints
- Frontend state management with Zustand
- React-based user interface

## Security Measures

### XSS (Cross-Site Scripting) Protection

- **HTTP-only cookies**: JWT tokens are stored in HTTP-only cookies, preventing client-side JavaScript from accessing them
- **Response sanitization**: Passwords are explicitly excluded from API responses to clients

### CSRF (Cross-Site Request Forgery) Protection

- **SameSite cookies**: Cookies are set with `sameSite: "strict"` attribute, ensuring they're only sent with requests originating from the same site

### SQL/NoSQL Injection Prevention

- **Parameterized queries**: Using Mongoose ODM ensures all database queries are properly parameterized
- **Schema validation**: Strict data type enforcement and validation rules
- **Input validation**: Required fields are validated before database operations

### Password Security

- **Strong hashing**: Passwords are hashed using bcrypt with 10 salt rounds
- **Unique salts**: Each password gets a unique random salt automatically
- **No plain text storage**: Only hashed passwords are stored in the database
- **Response sanitization**: Passwords are never returned in API responses

### JWT Security

- **Strong secrets**: JWTs are signed using secrets stored in environment variables
- **Limited lifetime**: Tokens expire after 7 days to minimize risk if compromised
- **Secure storage**: Tokens are stored in HTTP-only, secure cookies
- **Minimal payload**: Only essential user ID is stored in tokens

### Email Verification Security

- **Time-limited tokens**: Verification tokens expire after 24 hours
- **One-time use**: Tokens are cleared after successful verification
- **Expiration validation**: Only non-expired tokens are accepted
- **Secure random tokens**: 6-digit numeric verification codes

### Password Reset Security

- **Time-limited reset tokens**: Password reset tokens expire after 1 hour
- **One-time use**: Reset tokens are cleared after successful password reset
- **Secure random tokens**: Cryptographically secure random tokens for password resets
- **Confirmation emails**: Success notification after password reset

### Authentication Middleware

- **Token verification**: Middleware to verify JWT tokens on protected routes
- **Request augmentation**: Adds userId to request object for authorized access
- **Error handling**: Proper error responses for unauthorized access

### Additional Security Practices

- **Environment variables**: Sensitive data (database URLs, API keys, secrets) stored in environment variables
- **Input validation**: All required fields are validated before processing
- **Unique email constraint**: Prevents duplicate account creation
- **Verification tokens**: Email verification with expiration times
- **Last login tracking**: Records last login time for security monitoring
- **Secure session management**: Proper cookie clearing on logout

## Project Structure

```
backend/
├── index.js                  # Main application entry point
├── controllers/
│   └── auth.controller.js    # Authentication logic
├── db/
│   └── connectDB.js          # Database connection
├── mailtrap/
│   ├── emails.js             # Email sending functions
│   ├── emailTemplates.js     # HTML email templates
│   └── mailtrap.config.js    # Mailtrap configuration
├── middleware/
│   └── verifyToken.js        # Authentication middleware
├── models/
│   └── user.model.js         # User data model
├── routes/
│   └── auth.route.js         # Authentication routes
└── utils/
    └── generateTokenAndSetCookie.js  # JWT utilities

frontend/
└── src/
    ├── components/
    │   └── Input.jsx         # Reusable input component
    ├── pages/
    │   └── LoginPage.tsx     # Login form with validation
    └── store/
        └── authStore.js      # Zustand store for authentication state
```

## API Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password/:token` - Reset password with token
- `GET /api/v1/auth/check-auth` - Check authentication status (protected route)

## Frontend Integration

The frontend is built with React and uses Zustand for state management. Key components include:

### State Management

- **authStore.js**: Centralized authentication state with:
  - **State**: user data, authentication status, loading states, and error handling
  - **Actions**: signup, login, verifyEmail, checkAuth, and logout functions
  - **API Integration**: Axios configured to include credentials (cookies) with requests
  - **Authentication Flow**: Seamless integration with backend JWT authentication

Key features of the authStore:

- Automatic credential inclusion with `axios.defaults.withCredentials = true`
- Loading states for better UX during API calls
- Error handling for all authentication operations
- Persistent authentication status checking

### UI Components

- **LoginPage.tsx**: Secure login form with email/password validation
- **Input Component**: Reusable input field with icon support
- **Animations**: Smooth transitions using Framer Motion
- **Responsive Design**: Mobile-friendly layout

## Setup

1. Clone the repository
2. Install backend dependencies: `npm install`
3. Navigate to frontend and install dependencies: `cd frontend && npm install`
4. Create a `.env` file in the root with the required environment variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAILTRAP_TOKEN=your_mailtrap_token
   CLIENT_URL=http://localhost:5173  # Frontend URL for password reset links
   ```
5. Start the backend development server: `npm run dev`
6. In a separate terminal, start the frontend: `cd frontend && npm run dev`

## Environment Variables

- `PORT`: Port number for the server (defaults to 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens
- `MAILTRAP_TOKEN`: Mailtrap API token for sending verification emails
- `CLIENT_URL`: Frontend URL for password reset links (e.g., http://localhost:5173)

## Security Enhancements to Consider

- Implement rate limiting on authentication endpoints to prevent brute force attacks
- Add password complexity requirements
- Implement account lockout mechanisms after multiple failed login attempts
- Add additional security headers (HSTS, CSP, etc.)
- Implement proper session management with logout token invalidation
- Add rate limiting to email verification endpoint to prevent abuse

## Technologies Used

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- jsonwebtoken for JWT implementation
- cookie-parser for handling cookies
- Mailtrap for email verification
- Crypto for generating secure random tokens
- Dotenv for environment variable management

### Frontend

- React.js
- Zustand for state management
- Axios for API requests
- Framer Motion for animations
- Lucide React for icons
- React Router DOM for navigation
