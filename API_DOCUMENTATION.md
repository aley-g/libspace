# CampusDesk API Documentation

> **Note:** This documentation describes the RESTful API contract for the CampusDesk Library Booking System. Currently, the application uses local state management (Zustand) to simulate these endpoints.

---

## Base URL
`https://api.campusdesk.demo/v1`

---

## Authentication

### Login
Authenticates a user and returns a session token along with user details.

- **Endpoint:** `POST /api/auth/login`
- **Headers:** `Content-Type: application/json`

**Request Body:**
```json
{
  "email": "student@demo.com",
  "password": "password123"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5...",
  "user": {
    "id": "u1",
    "name": "Alex Student",
    "email": "student@demo.com",
    "role": "student"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid email or password."
}
```

---

## Rooms

### Get All Rooms
Retrieves a list of all library rooms, including their status and equipment.

- **Endpoint:** `GET /api/rooms`
- **Headers:** `Authorization: Bearer <token>`

**Success Response (200 OK):**
```json
{
  "data": [
    {
      "id": "r1",
      "name": "Study Room A",
      "type": "study",
      "capacity": 4,
      "equipment": ["Whiteboard", "Power Outlets"],
      "status": "active"
    },
    {
      "id": "r4",
      "name": "Computer Lab Alpha",
      "type": "lab",
      "capacity": 20,
      "equipment": ["PCs", "Dual Monitors", "High-Speed Internet"],
      "status": "maintenance"
    }
  ]
}
```

---

## Bookings

### Create a Booking
Creates a new reservation for a specific room.

- **Endpoint:** `POST /api/bookings`
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "u1",
  "roomId": "r1",
  "date": "2026-05-15",
  "startTime": "09:00",
  "endTime": "11:00"
}
```

**Success Response (201 Created):**
```json
{
  "message": "Booking created successfully.",
  "booking": {
    "id": "1674390123456",
    "roomId": "r1",
    "userId": "u1",
    "date": "2026-05-15",
    "startTime": "09:00",
    "endTime": "11:00",
    "status": "confirmed",
    "createdAt": "2026-05-10T12:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "This room is already booked for the selected time."
}
```

---

### Update Booking Status (Librarian/Admin Only)
Updates the status of a booking to handle cancellations, completions, or no-shows.

- **Endpoint:** `PATCH /api/bookings/:id/status`
- **Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "status": "no-show" 
  // Allowed values: "confirmed", "cancelled", "completed", "no-show"
}
```

**Success Response (200 OK):**
```json
{
  "message": "Booking status updated to no-show.",
  "bookingId": "1674390123456",
  "newStatus": "no-show"
}
```

**Error Response (403 Forbidden):**
```json
{
  "error": "You do not have permission to modify this booking."
}
```
