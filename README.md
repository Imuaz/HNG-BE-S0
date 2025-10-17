# HNG Stage 0 - Dynamic Profile API

A RESTful API endpoint that returns user profile information along with random cat facts from an external API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
```bash
cd HNG-BE-S0
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
   - Copy or create a `.env` file in the root directory
   - Update with your information:
```env
PORT=3000
USER_EMAIL=your.email@example.com
USER_NAME=Your Full Name
USER_STACK=Node.js/Express
```

4. **Start the server**
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

5. **Test the endpoint**
```bash
# In a new terminal
npm test
```

Or visit: http://localhost:3000/me

## 📍 API Endpoint

### GET /me

Returns user profile with a random cat fact.

**Response:**
```json
{
  "status": "success",
  "user": {
    "email": "your.email@example.com",
    "name": "Your Full Name",
    "stack": "Node.js/Express"
  },
  "timestamp": "2025-10-16T12:34:56.789Z",
  "fact": "Cats sleep 70% of their lives."
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - If cat facts API fails (returns fallback)

## 🏗️ Project Structure

```
hng-stage0-profile-api/
├── .env                    # Environment variables (DO NOT COMMIT)
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── server.js              # Main application entry point
├── test.js                # Simple test script
└── src/
    ├── routes/
    │   └── profile.js     # /me endpoint route handler
    └── services/
        └── catFactService.js  # Cat Facts API integration
```

## 🔧 Technologies Used

- **Express.js** - Web framework
- **Axios** - HTTP client for external API calls
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## ✅ Features

- ✅ RESTful API design
- ✅ Dynamic timestamp (updates on each request)
- ✅ External API integration (Cat Facts)
- ✅ Proper error handling with fallback
- ✅ Environment variable configuration
- ✅ CORS enabled
- ✅ Request logging
- ✅ Timeout handling (5s)
- ✅ ISO 8601 timestamp format
- ✅ Proper HTTP status codes

## 🧪 Testing

### Manual Testing
```bash
curl http://localhost:3000/me
```

### Automated Testing
```bash
npm test
```

### Using Postman or Thunder Client
- Method: GET
- URL: http://localhost:3000/me
- No headers or body required

## 🌐 Deployment

### Deploy to Render/Railway/Vercel

1. Push code to GitHub (ensure `.env` is in `.gitignore`)
2. Connect your repository
3. Add environment variables in the platform's dashboard
4. Deploy!

### Environment Variables for Production
```
USER_EMAIL=your.email@example.com
USER_NAME=Your Full Name
USER_STACK=Node.js/Express
```

## 📝 Notes

- The `/me` endpoint fetches a new cat fact on every request
- Timestamp is always in UTC (ISO 8601 format)
- If Cat Facts API fails, a fallback fact is returned
- Request timeout is set to 5 seconds

## 🤝 HNG Internship

This project is part of the HNG Internship program.
Learn more: https://hng.tech/internship

## 📄 License

MIT