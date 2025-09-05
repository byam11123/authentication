# Authentication System

A comprehensive Node.js/Express/MongoDB authentication system with secure user registration, email verification, and JWT-based authentication.

## Features

- User registration with email verification
- Secure password hashing using bcrypt
- JWT-based authentication with HTTP-only cookies
- Email verification using Mailtrap
- Welcome email after successful verification
- Protection against common security vulnerabilities
- RESTful API endpoints

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

### Additional Security Practices

- **Environment variables**: Sensitive data (database URLs, API keys, secrets) stored in environment variables
- **Input validation**: All required fields are validated before processing
- **Unique email constraint**: Prevents duplicate account creation
- **Verification tokens**: Email verification with expiration times

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
├── models/
│   └── user.model.js         # User data model
├── routes/
│   └── auth.route.js         # Authentication routes
└── utils/
    └── generateTokenAndSetCookie.js  # JWT utilities
```

## API Endpoints

- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/verify-email` - Email verification
- `POST /api/v1/auth/login` - User login (placeholder)
- `POST /api/v1/auth/logout` - User logout (placeholder)

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the required environment variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   MAILTRAP_TOKEN=your_mailtrap_token
   ```
4. Start the development server: `npm run dev`

## Environment Variables

- `PORT`: Port number for the server (defaults to 5000)
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for signing JWT tokens
- `MAILTRAP_TOKEN`: Mailtrap API token for sending verification emails

## Security Enhancements to Consider

- Implement rate limiting on authentication endpoints to prevent brute force attacks
- Add password complexity requirements
- Implement account lockout mechanisms after multiple failed login attempts
- Add additional security headers (HSTS, CSP, etc.)
- Implement proper session management with logout token invalidation
- Add rate limiting to email verification endpoint to prevent abuse

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- bcryptjs for password hashing
- jsonwebtoken for JWT implementation
- Mailtrap for email verification
- Dotenv for environment variable management
