# Village Service Hub

Village Service Hub is a full-stack web application that connects customers with trusted local service professionals.

The platform allows users to discover services, register and log in, book services, track bookings, and manage their accounts. Professionals can manage customer service requests, while administrators can manage services, customers, professionals, and bookings.

---

## Project Overview

Village Service Hub is designed to make local home services easier to discover and book.

Customers can:

- Browse available services
- Search for services
- Register and log in
- Book a service
- Select a date and time
- Enter their service address
- View booking confirmation
- Track their bookings
- View booking status
- Manage their account

Professionals can:

- Log in securely
- View service requests
- Accept bookings
- Reject bookings
- Complete bookings
- View customer and service information

Administrators can:

- Log in to the admin dashboard
- View dashboard statistics
- Manage customers
- Manage professionals
- Manage bookings
- Update booking status
- Add services
- Delete services
- View available services

---

## Features

### Customer Features

- User registration
- Secure user login
- JWT-based authentication
- Protected customer routes
- Service browsing
- Service search
- Service categories
- Service ratings and reviews
- Service pricing
- Date and time selection
- Booking creation
- Booking confirmation
- My Bookings section
- Booking status tracking
- Customer account page

### Professional Features

- Professional login
- JWT authentication
- Protected professional dashboard
- View incoming bookings
- View customer details
- View service details
- Accept bookings
- Reject bookings
- Mark bookings as completed

### Admin Features

- Secure admin login
- Protected admin dashboard
- Dashboard statistics
- Customer management
- Professional management
- Booking management
- Booking status management
- Service management
- Add new services
- Delete services

---

## Technologies Used

### Frontend

- React.js
- Vite
- React Router DOM
- Lucide React
- JavaScript
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcrypt
- dotenv
- CORS

### Database

- MongoDB Atlas

---

## Project Structure

```text
village-service-hub/
│
├── src/
│   ├── pages/
│   │   ├── Account.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminLogin.jsx
│   │   ├── Booking.jsx
│   │   ├── BookingSuccess.jsx
│   │   ├── Login.jsx
│   │   ├── MyBookings.jsx
│   │   ├── ProfessionalDashboard.jsx
│   │   ├── ProfessionalLogin.jsx
│   │   ├── Register.jsx
│   │   └── Services.jsx
│   │
│   ├── App.jsx
│   ├── ProtectedRoute.jsx
│   └── ...
│
├── server/
│   ├── middleware/
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Professional.js
│   │   ├── Service.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── professionalRoutes.js
│   │   ├── serviceRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── seedServices.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── .env.example
│
├── public/
├── .gitignore
├── package.json
└── README.md