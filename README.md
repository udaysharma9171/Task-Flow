# TaskFlow - MERN Stack Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication with JWT
- Task creation, editing, and deletion
- Task filtering and sorting capability
- Responsive design
- Dashboard with task statistics
- Form validation

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose ORM
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or Atlas connection)

### Installation

1. Clone the repository

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server
```
npm run dev:all
```

This will run both the React frontend and Node.js backend concurrently.

## API Endpoints

### Auth
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile

### Tasks
- `GET /api/tasks` - Get all tasks for logged-in user
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task