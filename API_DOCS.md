# Technical & API Documentation

This document provides a detailed overview of the technical architecture, state management, and internal APIs for the **CampusDesk - Library Seat & Room Booking System**.

## 1. Architecture Overview
CampusDesk is built as a modern Single Page Application (SPA) using React 19 and Vite. The application does not rely on a traditional monolithic backend server for state storage; instead, it utilizes a hybrid architecture:
- **Global State Management:** `Zustand` (with LocalStorage persistence for session retention).
- **Authentication & Live Backend:** `Firebase Authentication` for real-time user verification and management.

## 2. State Management (Zustand Stores)

The application state is divided into three primary domain-driven stores:

### 2.1. `useAuthStore` (Authentication & User Sessions)
Manages user sessions, registration, and role-based access.

**State Variables:**
- `user` (Object | null): The currently authenticated user `{ id, name, email, role }`.
- `loading` (Boolean): Indicates active network requests.
- `error` (String | null): Holds the latest authentication error.

**Key Actions (API):**
- `loginWithEmail(email, password)`: Authenticates via Firebase. If Firebase is bypassed, checks local mock accounts.
- `registerWithEmail(name, email, password, role)`: Creates a new user in Firebase Auth.
- `logout()`: Clears the session via `signOut(auth)`.

### 2.2. `useBookingStore` (Booking Processes & Conflict Resolution)
Handles all business logic related to reserving rooms.

**State Variables:**
- `bookings` (Array of Objects): List of all historical and active bookings.

**Key Actions (API):**
- `addBooking(bookingObject)`: 
  - **Conflict Resolution Engine:** Before inserting a new booking, it checks the array of existing bookings for the requested `roomId` on the requested `date`. 
  - It converts time strings to `Date` objects and checks for overlaps using the algorithm: `(newStart < existingEnd && newEnd > existingStart)`.
  - Throws an error (`"This room is already booked for the selected time."`) if a conflict exists.
  - Returns the newly created booking object.
- `cancelBooking(bookingId)`: Updates a booking's status to `'cancelled'`, freeing up the slot for other users.
- `getBookingsByUser(userId)`: Returns filtered bookings for dashboard display.

### 2.3. `useRoomStore` (Room Data & Availability)
Stores static and dynamic metadata regarding library physical spaces.

**State Variables:**
- `rooms` (Array of Objects): The list of available spaces `{ id, name, type, capacity, amenities }`.

## 3. Booking Process Flow

1. **User Request:** The user selects a room from `Rooms.jsx` and submits the Date, Start Time, and End Time via a modal.
2. **Validation:** The modal performs basic client-side validation (e.g., end time must be after start time).
3. **Dispatch:** The component calls `addBooking(payload)` from `useBookingStore`.
4. **Conflict Check:** The store evaluates the time against existing bookings (see Conflict Resolution).
5. **Success/Failure:** 
   - On success, the state is mutated, persisted, and a success toast is shown.
   - On failure, an error is caught and a notification informs the user of the overlap.

## 4. Unit Testing
The business logic within the stores is isolated and verified using **Vitest**.

**Tested Scenarios in `bookingStore.test.js`:**
- ✅ Successful booking creation.
- ✅ Conflict detection (exact same time).
- ✅ Conflict detection (overlapping time ranges).
- ✅ Permitting simultaneous bookings in *different* rooms.
- ✅ Permitting bookings in the same room if times are distinct.
- ✅ Freeing up a time slot upon cancellation of a previous booking.

To run the unit tests, execute:
```bash
npm run test
```

## 5. Security & Data Integrity
- **Role-Based Access Control (RBAC):** UI elements (like cancellation buttons for all users) are conditionally rendered based on `user.role === 'manager' | 'librarian'`.
- **Firebase Security Rules:** Authentication data is secured on Google's cloud infrastructure. Client-side state is strictly meant for session persistence and UI rendering.
