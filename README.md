# Boat Rental REST API

## Description
This is a RESTful API for a Boat Rental System built with Node.js, Express.js, and MongoDB. It supports user registration and login with JWT authentication, boat browsing, and booking management with constraints to prevent double bookings.

## Features
- User registration and login with JWT authentication
- View list of boats and boat details
- Authenticated users can create, update, and delete their own bookings
- Prevent double booking of boats for overlapping time periods
- Input validation and proper error handling
- Environment variables for configuration

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd boat-rental-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   MONGO_URI=mongodb://localhost:27017/Boat-rental
   JWT_SECRET=BoatRentalSecretKey2024
   PORT=5000
   ```

4. Start the server:
   - For development with auto-reload:
     ```
     npm run dev
     ```
   - For production:
     ```
     npm start
     ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Boats
- `GET /api/boats` - Get all boats
- `GET /api/boats/:id` - Get boat details by ID

### Bookings (Authenticated)
- `POST /api/bookings` - Create a booking
- `GET /api/bookings` - Get all bookings of logged-in user
- `PUT /api/bookings/:id` - Update a booking (only by owner)
- `DELETE /api/bookings/:id` - Delete a booking (only by owner)

## Testing the API
Use the provided Postman collection to test all API endpoints.

## Credentials
No default credentials. Register a new user via the API.

## Postman Collection
The Postman collection file `BoatRentalAPI.postman_collection.json` is included in the repository.

## Notes
- Ensure MongoDB is running and accessible via the connection string.
- Use the JWT token returned on login in the `x-auth-token` header for authenticated routes.
