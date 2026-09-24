cat > README.md <<'EOF'
# Feedants Competition App

A full-stack competition details module built as part of the Feedants Full Stack Development Internship Technical Assignment.

## Features

- Competition details fetched dynamically from MongoDB
- Competition status based on start/end dates
- Available and registered spots
- User registration for a competition
- Duplicate registration prevention
- Competition full-state handling
- Backend validation for registration
- REST APIs using Node.js and Express.js
- MongoDB database using Mongoose
- React Native frontend

## Tech Stack

### Frontend
- React Native
- TypeScript
- React Native StyleSheet

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB Atlas

## Project Structure

```text
feedants-competition-app/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── android/
│   ├── ios/
│   ├── App.tsx
│   └── package.json
│
└── README.md
