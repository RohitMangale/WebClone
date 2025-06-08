# Orchids Challenge Project

This is a full-stack web application built for the Orchids Challenge, featuring a FastAPI backend and a Next.js frontend.

## Project Structure

The project is organized into two main directories:
- `frontend/`: Next.js application with TypeScript
- `backend/`: FastAPI Python application

## Features

### Backend (FastAPI)
- RESTful API endpoints for CRUD operations
- CORS middleware enabled for cross-origin requests
- Health check endpoint
- In-memory data storage (can be extended to use a database)
- API documentation available at `/docs` when running

### Frontend (Next.js)
- Modern React application with TypeScript
- Built with Next.js framework
- Responsive design
- Component-based architecture

## Prerequisites

- Python 3.8+ (for backend)
- Node.js 16+ (for frontend)
- npm or yarn (for frontend package management)

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the backend server:
   ```bash
   python hello.py
   ```
   The server will start at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The frontend will be available at `http://localhost:3000`

## API Endpoints

The backend provides the following endpoints:

- `GET /`: Root endpoint
- `GET /health`: Health check endpoint
- `GET /items`: Get all items
- `GET /items/{item_id}`: Get item by ID
- `POST /items`: Create new item
- `PUT /items/{item_id}`: Update item
- `DELETE /items/{item_id}`: Delete item

## Development

- Backend API documentation is available at `http://localhost:8000/docs` when the server is running
- Frontend hot-reloading is enabled for development
- CORS is configured to allow all origins in development (should be restricted in production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is part of the Orchids Challenge and is subject to its terms and conditions.
