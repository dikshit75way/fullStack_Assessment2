# 🚗 Modern Car Rental System

A complete full-stack vehicle rental platform built with the **MERN** stack (MongoDB, Express, React, Node.js), featuring real-time tracking, KYC verification, and dynamic booking management.

## 🌟 Key Features

### 👤 User & Authentication

- **Secure Auth**: JWT-based authentication with Access & Refresh tokens.
- **Role-Based Access Control (RBAC)**: Distinct portals for **Users** and **Admins**.
- **Profile Management**: User dashboard to manage bookings and personal info.

### 🛡️ KYC Verification System

- **Driver Validation**: Users must upload their Driver's License before booking.
- **Admin Approval**: Admins review and verify/reject KYC documents.
- **Booking Restriction**: Unverified users cannot make bookings.

### 🚙 Fleet Management (Admin)

- **CRUD Operations**: Add, Edit, Delete vehicles.
- **Image Upload**: Handle vehicle images with local storage serving.
- **Status Management**: Track vehicle availability (Available, Rented, Maintenance).

### 📅 Booking & Payments

- **Smart Scheduling**: Date picker with automatic conflict detection (prevents double bookings).
- **Payment Integration**: Mock payment gateway with "Pay Now" flow for pending bookings.
- **Auto-Cancellation**: Background cron job cancels "Pending" bookings incorrectly left unpaid for >15 mins.
- **Tiered Cancellation Policy**:
  - > 3 Days: **100% Refund**
  - 1-3 Days: **50% Refund**
  - < 24 Hours: **No Refund**

### 📍 Live Vehicle Tracking

- **Real-Time Simulation**: Dedicated tracking page for confirmed bookings.
- **Live Updates**: Simulates GPS movement with "jitter" logic, updating location every 5 seconds on an interactive map visualization.

---

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js & Express
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose Application)
- **Caching**: Redis (Optional/Planned for session management)
- **Validation**: Zod / Express-Validator
- **Task Scheduling**: Node-Cron

### Frontend

- **Framework**: React (Vite)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS & Lucide Icons
- **Router**: React Router v6

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas URL)
- Redis (Optional)

### Installation

1.  **Clone the Repository**

    ```bash
    git clone <repository_url>
    cd full_stack
    ```

2.  **Setup Backend**

    ```bash
    cd backend
    npm install
    cp .env.example .env.local  # Configure your ENV variables (PORT, MONGO_URI, etc.)
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    # Ensure api.ts points to your backend URL (default: http://localhost:8000)
    npm run dev
    ```

### 🔐 Default Credentials

- **Admin**: Register a new user, then manually set their role to `admin` in the database, OR use the `init-admin` script if available.
- **User**: Sign up via the `/register` page.

---

## 📂 Project Structure

```
full_stack/
├── backend/
│   ├── app/
│   │   ├── auth/         # Authentication Logic
│   │   ├── user/         # User & KYC Management
│   │   ├── vehicle/      # Fleet CRUD
│   │   ├── booking/      # Reservation System
│   │   ├── tracking/     # GPS Simulation
│   │   └── common/       # Middleware, Helpers, Services
│   ├── uploads/          # Static file storage (Images)
│   └── server.ts         # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI Components
│   │   ├── pages/        # Application Routes (Dashboard, Tracking, etc.)
│   │   ├── services/     # RTK Query API Definitions
│   │   ├── store/        # Redux Store Configuration
│   │   └── utils/        # Helpers (Image URL parsing, etc.)
│   └── index.css         # Tailwind directives
```

## 🧪 How It Works (User Flow)

1.  **Sign Up**: Create an account.
2.  **Verify Identity**: Go to Dashboard -> Complete Verification. Wait for Admin approval.
3.  **Rent a Car**: Browse the fleet, select dates, and book.
4.  **Payment**: Pay for the booking to confirm it.
5.  **Track**: Once confirmed, click "Track Vehicle" on the dashboard to see live location updates.
6.  **Return**: System handles completion (manual admin status update).

## ⚠️ Notes

- Images are stored locally in `backend/uploads`. Ensure this folder exists and has write permissions.
- The "Tracking" feature uses simulated data for demonstration purposes.
