# CampusDesk - Library Seat & Room Booking System

## Overview
CampusDesk is a modern, fully-featured reservation system designed specifically for university study spaces. It allows students to easily find and book study rooms, while providing librarians and facility managers with powerful tools to manage usage, track attendance, and oversee maintenance.

This project was developed for the **MIS2006** course, strictly following all academic requirements including advanced state management, conflict resolution algorithms, unit testing, and API documentation.

## Features & User Roles

### 🎓 Student Role
- **Browse Rooms:** View all available study rooms, meeting rooms, and computer labs.
- **Book Slots:** Real-time availability checks with strict conflict resolution to prevent double-booking.
- **Booking Limits:** Enforced daily limits (max 2 bookings per day) to ensure fair usage.
- **Manage Bookings:** View upcoming reservations and cancel them if necessary.

### 📚 Librarian Role
- **All Bookings Overview:** Complete visibility into every reservation made in the system.
- **Attendance Tracking:** Mark past bookings as **Completed** or **No-Show**.
- **Analytics Dashboard:** 
  - Peak Booking Times (Area Chart)
  - Room Utilization (Bar Chart)
  - Attendance & No-Show Rates (Pie Chart)
- **Export Data:** Download comprehensive CSV reports of all booking data.

### 🛠️ Facility Manager Role
- **Manage Rooms:** Add new rooms or edit existing capacities and equipment.
- **Maintenance Control:** Instantly toggle rooms into "Maintenance" mode, removing them from the student booking pool.
- **System Alerts:** Receive in-app notifications for maintenance updates.

## Technical Architecture

- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + Lucide React Icons
- **Global State Management:** Zustand (with LocalStorage persistence to simulate database persistence)
- **Data Visualization:** Recharts
- **Third-Party Integrations:** EmailJS (for automated booking confirmations and cancellation emails)
- **Unit Testing:** Vitest

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone or download the repository.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

### Test Accounts
You can log into the system using the following pre-configured demo accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `student@demo.com` | `student123` |
| **Librarian** | `librarian@demo.com` | `admin123` |
| **Facility Manager**| `manager@demo.com` | `admin123` |

## Documentation & Testing
- **API Documentation:** Please refer to `API_DOCUMENTATION.md` for details on the simulated RESTful endpoints.
- **Unit Tests:** Run `npm run test` to execute the Vitest test suites, which validate the core booking algorithms and time verification logic.
