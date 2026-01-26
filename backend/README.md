# TaskHub Backend

Clean authentication backend with signup, login, and token verification.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize the database:**
   ```bash
   psql postgres://postgres:divine@localhost:5432/taskhub -f config/init.sql
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   Or for development with hot reload:
   ```bash
   npm run dev
   ```

## Environment Variables

Create or update `.env`:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://postgres:divine@localhost:5432/taskhub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

## API Endpoints

### Authentication

- **POST** `/api/auth/signup` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```

- **POST** `/api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST** `/api/auth/verify-token` - Verify token validity
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

- **GET** `/api/auth/me` - Get current user (requires Bearer token)
  ```
  Headers:
  Authorization: Bearer <token>
  ```

## Response Format

Success Response:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token"
  }
}
```

Error Response:
```json
{
  "success": false,
  "message": "Error message",
  "error": "detailed error"
}
```

## Directory Structure

```
backend/
├── config/
│   ├── database.js      # Database connection
│   └── init.sql         # Database initialization
├── middleware/
│   └── auth.js          # JWT authentication
├── routes/
│   └── auth.js          # Auth endpoints
├── server.js            # Express app
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- All passwords are never returned in responses
- CORS is enabled for frontend communication
