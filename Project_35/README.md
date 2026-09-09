# Workout Budyyy

MERN CRUD workout tracker matching the supplied screenshot.

## Requirements
- Node.js 18+
- MongoDB Atlas connection string

## Setup
1. Create `server/.env` from `server/.env.example`.
2. Put your MongoDB Atlas URI in `MONGO_URI`.
3. Run:
   ```bash
   npm install
   npm run install-all
   npm run dev
   ```
4. Open `http://localhost:5173`.

The Express API runs on `http://localhost:5000`.

## API
- GET `/api/workouts`
- POST `/api/workouts`
- DELETE `/api/workouts/:id`

Context + `useReducer` manages the frontend workout list and loading/errors.
