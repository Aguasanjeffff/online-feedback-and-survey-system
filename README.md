# 📊 Online Survey & Feedback System

A full-stack web application for creating surveys, collecting responses, and analyzing results.

## 🚀 Features

- **Creator Account System**
  - User registration and login with JWT authentication
  - Secure password hashing

- **Survey Creation**
  - Dynamic question builder
  - Multiple question types:
    - Multiple choice
    - Short answer
    - Rating scale (1-5)
  - Add/remove questions on the fly

- **Public Survey Sharing**
  - Unique public links for each survey
  - No account required for respondents
  - Open/close survey functionality

- **Response Collection**
  - View all responses
  - Track total respondents
  - Real-time response submission

- **Analytics Dashboard**
  - Automatic result summaries
  - Most selected options for multiple choice
  - Average ratings for rating questions
  - Visual data representation with charts

## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Chart.js** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Online-Feedback-and-Survey-System
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Set MongoDB URI and JWT secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### 1. Start MongoDB
Make sure MongoDB is running on your system.

### 2. Start Backend Server
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

### 3. Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
Online-Feedback-and-Survey-System/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── models/      # Mongoose models
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Custom middleware
│   │   ├── utils/       # Utility functions
│   │   └── server.js    # Entry point
│   └── package.json
│
├── frontend/            # Vue.js application
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── views/       # Page components
│   │   ├── router/      # Vue Router config
│   │   ├── services/    # API services
│   │   └── main.js      # Entry point
│   └── package.json
│
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Surveys
- `POST /api/surveys` - Create survey (protected)
- `GET /api/surveys` - Get user's surveys (protected)
- `GET /api/surveys/:id` - Get survey details (protected)
- `PUT /api/surveys/:id` - Update survey (protected)
- `PATCH /api/surveys/:id/status` - Toggle survey status (protected)
- `DELETE /api/surveys/:id` - Delete survey (protected)
- `GET /api/surveys/public/:publicLink` - Get public survey

### Responses
- `POST /api/responses/public/:publicLink` - Submit response
- `GET /api/responses/survey/:id` - Get survey responses (protected)
- `GET /api/responses/survey/:id/analytics` - Get analytics (protected)

## 📚 Learning Outcomes

This project covers:
- ✅ Vue.js dynamic forms and components
- ✅ Vue Router with dynamic routes
- ✅ Axios for API requests
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Protected routes (frontend & backend)
- ✅ MongoDB schema relationships
- ✅ Mongoose models and validation
- ✅ MongoDB aggregation pipelines
- ✅ Public vs private endpoints
- ✅ Data visualization basics

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📝 License

MIT License

## 👨‍💻 Author

Your Name