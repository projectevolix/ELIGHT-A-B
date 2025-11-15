# Ayurvedic Resort - Backend API

A comprehensive backend system for managing an Ayurvedic resort, including user management, treatment booking, therapist/doctor management, and cabin reservations.

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [User Roles](#user-roles)
- [Available Scripts](#available-scripts)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

## About

This is the backend API for an Ayurvedic Resort management system built with Node.js, Express, TypeScript, and MongoDB. It provides a complete RESTful API for managing bookings, treatments, staff (doctors/therapists), cabins, and user authentication with role-based access control.

## Features

- **Authentication & Authorization**
  - JWT-based authentication (access & refresh tokens)
  - Google OAuth 2.0 integration
  - Role-based access control (User, Admin, Therapist, Doctor)
  - Password reset functionality

- **User Management**
  - CRUD operations for users
  - Profile management
  - Multi-role support

- **Booking System**
  - Create and manage bookings
  - Check-in/check-out management
  - Booking status tracking (Pending, Accepted, Rejected, Cancelled)
  - User-specific booking history
  - Doctor view for checked-in patients

- **Treatment Management**
  - Treatment catalog with descriptions, duration, and benefits
  - Treatment plan creation and tracking
  - Treatment session management
  - Image upload support via Cloudinary

- **Staff Management**
  - Doctor profile management
  - Therapist profile management
  - Staff assignment to treatments

- **Cabin Management**
  - Cabin availability tracking
  - Cabin details and pricing

- **File Upload**
  - Cloudinary integration for image uploads
  - Secure file handling

- **Logging & Monitoring**
  - Winston logger with daily rotate file
  - HTTP request logging with Morgan
  - Error tracking and handling

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: 
  - Passport.js (Google OAuth)
  - JWT (jsonwebtoken)
  - bcryptjs for password hashing
- **File Upload**: 
  - Multer
  - Cloudinary
- **Email**: Nodemailer
- **Logging**: Winston & Morgan
- **Development**: 
  - Nodemon (auto-reload)
  - ts-node (TypeScript execution)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher)
- **npm** (v9.x or higher) or **yarn**
- **MongoDB** (v6.x or higher) - Local installation or MongoDB Atlas account
- **Git**

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vidurapriyadarshana/Ayurvedic-Resort.git
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual values
   # Use your preferred text editor
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Server Configuration
```env
PORT=8080
NODE_ENV=development
SERVER_URL=http://localhost:8080
CLIENT_URL=http://localhost:5173
```

### Database Configuration
```env
# Local MongoDB
DB_URI=mongodb://127.0.0.1:27017/ayurvedic_resort

# MongoDB Atlas (Production)
DB_URI=mongodb+srv://username:password@cluster.mongodb.net/ayurvedic_resort?retryWrites=true&w=majority
```

### JWT Configuration
```env
# Generate secure random strings (32+ characters recommended)
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key_min_32_chars
JWT_REFRESH_EXPIRES_IN=7d
```

### Google OAuth Configuration
Get credentials from [Google Cloud Console](https://console.cloud.google.com/):
1. Create a new project
2. Enable Google+ API
3. Create OAuth 2.0 credentials
4. Add authorized redirect URIs

```env
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### SMTP Configuration (for email notifications)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
```

**Note for Gmail**: Enable 2-factor authentication and generate an [App Password](https://support.google.com/accounts/answer/185833)

### Cloudinary Configuration (for image uploads)
Get credentials from [Cloudinary](https://cloudinary.com/):
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Application

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
# Build TypeScript to JavaScript
npm run build

# Start the compiled application
npm start
```

### Environment Management
```bash
# Interactive environment variable manager
npm run env
```

The server will start on `http://localhost:8080` (or your configured PORT).

## API Documentation

### Base URL
```
http://localhost:8080/api
```

### Health Check
```http
GET /api/health
```

### Main Endpoints

#### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with email/password
- `GET /google` - Initiate Google OAuth
- `GET /google/callback` - Google OAuth callback
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token

#### Users (`/api/users`)
- `GET /` - Get all users (Admin only)
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (Admin only)
- `GET /me` - Get current user profile

#### Bookings (`/api/bookings`)
- `POST /` - Create new booking
- `GET /` - Get all bookings (Admin only)
- `GET /my-bookings` - Get current user's bookings
- `GET /checked-in` - Get checked-in bookings (Doctor only)
- `PUT /:bookingId` - Update booking details
- `PATCH /:bookingId/status` - Update booking status
- `DELETE /:bookingId` - Delete booking

#### Treatments (`/api/treatments`)
- `GET /` - Get all treatments
- `GET /:id` - Get treatment by ID
- `POST /` - Create treatment (Admin only)
- `PUT /:id` - Update treatment (Admin only)
- `DELETE /:id` - Delete treatment (Admin only)

#### Therapists (`/api/therapists`)
- `GET /` - Get all therapists
- `GET /:id` - Get therapist by ID
- `POST /` - Create therapist (Admin only)
- `PUT /:id` - Update therapist (Admin only)
- `DELETE /:id` - Delete therapist (Admin only)

#### Doctors (`/api/doctors`)
- `GET /` - Get all doctors
- `GET /:id` - Get doctor by ID
- `POST /` - Create doctor (Admin only)
- `PUT /:id` - Update doctor (Admin only)
- `DELETE /:id` - Delete doctor (Admin only)

#### Cabins (`/api/cabins`)
- `GET /` - Get all cabins
- `GET /:id` - Get cabin by ID
- `POST /` - Create cabin (Admin only)
- `PUT /:id` - Update cabin (Admin only)
- `DELETE /:id` - Delete cabin (Admin only)

#### Image Upload (`/api/uploads`)
- `POST /image` - Upload image to Cloudinary

### Postman Collection
Import the Postman collection from `/collection/Aurvedic.postman_collection.json` for detailed API testing.

## Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.config.ts
│   │   ├── env.config.ts
│   │   ├── logger.config.ts
│   │   └── passport.config.ts
│   ├── constants/           # Application constants
│   │   ├── booking.constants.ts
│   │   └── roles.constants.ts
│   ├── controllers/         # Request handlers
│   ├── database/            # Database connection
│   ├── middleware/          # Express middlewares
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── types/               # TypeScript types/interfaces
│   ├── utils/               # Utility functions
│   ├── app.ts               # Express app setup
│   └── index.ts             # Entry point
├── collection/              # Postman collections
├── logs/                    # Application logs (auto-generated)
├── .env.example             # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## User Roles

The system supports four user roles with different permissions:

### 1. **USER** (Default)
- Create and manage own bookings
- View treatments
- Update own profile
- View own booking history

### 2. **ADMIN**
- Full system access
- Manage all users, bookings, treatments
- Create/update/delete therapists, doctors, cabins
- View system-wide reports

### 3. **THERAPIST**
- View assigned treatments
- Update treatment sessions
- View client information

### 4. **DOCTOR**
- View checked-in patients
- Create treatment plans
- Manage treatment sessions
- Access patient medical information

## Available Scripts

```bash
# Development
npm run dev           # Start development server with auto-reload

# Production
npm run build         # Compile TypeScript to JavaScript
npm start             # Start production server

# Utilities
npm run env           # Interactive environment variable manager
npm test              # Run tests (to be implemented)
```

## Development

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules (configuration to be added)
- Use async/await for asynchronous operations
- Implement proper error handling with custom error classes

### Adding New Features
1. Create model in `/src/models`
2. Define types in `/src/types`
3. Implement service logic in `/src/services`
4. Create controller in `/src/controllers`
5. Add routes in `/src/routes`
6. Update middleware if needed

### Database Models
- **User**: User accounts with role-based access
- **Booking**: Reservation management
- **Treatment**: Treatment catalog
- **TreatmentPlan**: Patient treatment plans
- **TreatmentSession**: Individual treatment sessions
- **Cabin**: Accommodation management

### Authentication Flow
1. User registers or logs in (email/password or Google OAuth)
2. Server generates JWT access token (15min) and refresh token (7 days)
3. Access token sent in Authorization header: `Bearer <token>`
4. Refresh token stored as httpOnly cookie
5. When access token expires, use refresh token to get new access token

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: MongooseServerSelectionError
```
**Solution**: 
- Ensure MongoDB is running: `mongod --dbpath /path/to/data`
- Check DB_URI in `.env` file
- For Atlas, check IP whitelist and credentials

**2. Google OAuth Not Working**
```
Error: invalid_client
```
**Solution**:
- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
- Check authorized redirect URIs in Google Console
- Ensure callback URL matches: `${SERVER_URL}/api/auth/google/callback`

**3. Cloudinary Upload Failed**
```
Error: Invalid cloud_name
```
**Solution**:
- Verify Cloudinary credentials in `.env`
- Check API key and secret
- Ensure cloud name is correct (no spaces)

**4. Port Already in Use**
```
Error: EADDRINUSE
```
**Solution**:
```bash
# Find process using port 8080
netstat -ano | findstr :8080    # Windows
lsof -i :8080                   # Mac/Linux

# Kill the process or change PORT in .env
```

**5. JWT Token Errors**
```
Error: JsonWebTokenError: invalid signature
```
**Solution**:
- Regenerate JWT_SECRET and JWT_REFRESH_SECRET
- Use long random strings (32+ characters)
- Clear browser cookies and login again

### Logs
Application logs are stored in `/logs` directory:
- `application-%DATE%.log` - All logs
- `error-%DATE%.log` - Error logs only

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

ISC

## Support

For issues and questions:
- GitHub Issues: https://github.com/vidurapriyadarshana/Ayurvedic-Resort/issues
- Repository: https://github.com/vidurapriyadarshana/Ayurvedic-Resort

---

**Built with love for Ayurvedic wellness**
