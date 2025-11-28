# Hospital Management Backend API

Backend server with JWT authentication and MongoDB integration for the Hospital Management System.

## Features

- 🔐 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 📊 MongoDB with Mongoose ODM
- 🛡️ Protected routes with middleware
- ✅ Input validation
- 🔄 CORS enabled for frontend integration
- 📝 Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)

## Installation

```bash
npm install
```

## Environment Setup

The `.env` file is already configured with:

```env
MONGODB_URI=mongodb://localhost:27017/hospital
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=3000
NODE_ENV=development
```

> ⚠️ **Important**: Change the `JWT_SECRET` to a secure random string in production!

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Protected Endpoints (Require JWT Token)

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <your_jwt_token>
```

#### Get Current User Profile
```http
GET /api/auth/me
Authorization: Bearer <your_jwt_token>
```

### Utility Endpoints

#### Health Check
```http
GET /api/health
```

#### API Info
```http
GET /
```

## Project Structure

```
backend/
├── models/
│   └── User.js              # User model with password hashing
├── routes/
│   └── auth.js              # Authentication routes
├── middleware/
│   └── auth.js              # JWT verification middleware
├── .env                     # Environment variables
├── index.js                 # Main server file
├── package.json             # Dependencies
└── README.md                # This file
```

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (development only)"
}
```

## Database Schema

### User Model

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ JWT tokens expire after 7 days
- ✅ Email uniqueness enforced
- ✅ Password never included in API responses
- ✅ Protected routes require valid JWT token
- ✅ Input validation on all endpoints

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify token (replace TOKEN with actual token from login)
curl http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer TOKEN"

# Get profile
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using the Frontend API Service

The frontend already has an API service configured at `../Opd_flow/src/services/api.js`:

```javascript
import authAPI from './services/api';

// Register
await authAPI.register({ name, email, password });

// Login
await authAPI.login({ email, password });

// Get profile
await authAPI.getProfile();

// Verify token
await authAPI.verify();

// Logout
authAPI.logout();

// Check authentication
if (authAPI.isAuthenticated()) {
  const user = authAPI.getCurrentUser();
}
```

## Error Codes

- `200` - Success
- `201` - Created (registration successful)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials or token)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **jsonwebtoken** - JWT implementation
- **bcryptjs** - Password hashing
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload

### Adding New Routes

1. Create route file in `routes/` folder
2. Import in `index.js`
3. Mount with `app.use('/api/path', routeHandler)`

### Adding Authentication to Routes

Use the auth middleware:

```javascript
const auth = require('../middleware/auth');

router.get('/protected-route', auth, async (req, res) => {
  // req.user contains authenticated user data
  // req.userId contains user ID
});
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongosh`
- Check connection string in `.env`

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### JWT Token Error
- Ensure `JWT_SECRET` is set in `.env`
- Check token expiration (default: 7 days)

## License

ISC

## Author

Hospital Management System Backend Team
