# Movie Platform

A full-stack web application for managing and organizing your movie watchlist. Built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Search movies using TMDB API
- Create custom movie lists
- Add/remove movies from lists
- Responsive design with modern UI

## Tech Stack

### Frontend
- React
- TypeScript
- Framer Motion (animations)
- Axios (API calls)

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- TMDB API Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TMDB API Key

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
TMDB_API_KEY=your_tmdb_api_key

# Frontend
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-platform.git
cd movie-platform
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

## Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 