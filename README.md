# Dental Clinic & Lab Management System

<p align="center">
  <strong>A full-stack MERN application designed to streamline the workflow between dental clinics and laboratories.</strong>
</p>

<p align="center">
  <a href="#-key-features">Features</a> •
  <a href="#-technologies-used">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Setup</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-future-roadmap">Roadmap</a>
</p>

---

## 📜 Project Overview

This project is a full-stack web application built to digitize and automate the workflow between dentists and dental fabrication labs. The system allows dentists to create detailed medical cases, attach 3D design files (e.g., STL, PLY ), and submit them as orders to labs. In turn, labs can manage these incoming orders, update their statuses, and set delivery dates, creating an efficient and organized communication channel between both parties.

---

## ✨ Key Features

### 👨‍⚕️ **Doctor Portal**
- **Authentication:** Secure user registration and login.
- **Patient Management:** Add and track patient information.
- **Medical Case Creation:**
    - An interactive UI to select teeth and assign specific treatments.
    - Upload 3D design files (STL/PLY).
    - Add detailed notes and comments.
- **Order Management:**
    - Submit cases as orders to specific labs.
    - Track order statuses (Pending, Accepted, Finished, etc.).
    - View a filterable and searchable list of all submitted orders.
- **Calendar View:** A calendar to visualize expected delivery dates for all active orders.
- **Reviews & Ratings:** Ability to rate and review a lab's service upon order completion.

### 🔬 **Lab Portal**
- **Authentication:** Secure user registration and login.
- **Order Queue Management:**
    - View a dashboard of all incoming orders from dentists.
    - Review order details and download attached design files.
    - Accept or deny new orders.
- **Status Updates:** Progress orders through their lifecycle (e.g., Accepted → In Progress → Finished).
- **Delivery Date Assignment:** Set an estimated delivery date upon accepting an order.
- **Performance & Reviews:** View ratings and feedback received from doctors.

---

## 💻 Technologies Used

### **Backend**
- **[Node.js](https://nodejs.org/ ):** JavaScript runtime environment.
- **[Express.js](https://expressjs.com/ ):** Web framework for building the API.
- **[MongoDB](https://www.mongodb.com/ ):** NoSQL database for data storage.
- **[Mongoose](https://mongoosejs.com/ ):** ODM library for modeling and interacting with MongoDB.
- **[JSON Web Tokens (JWT)](https://jwt.io/ ):** For managing authentication and securing routes.
- **[Bcrypt.js](https://github.com/dcodeIO/bcrypt.js ):** For hashing user passwords.
- **[Multer](https://github.com/expressjs/multer ):** Middleware for handling `multipart/form-data`, used for file uploads.
- **[Dotenv](https://github.com/motdotla/dotenv ):** For loading environment variables from a `.env` file.

### **Frontend**
- **[React.js](https://reactjs.org/ ):** Library for building user interfaces.
- **[Vite](https://vitejs.dev/ ):** A fast, modern build tool for an enhanced development experience.
- **[React Router](https://reactrouter.com/ ):** For client-side routing and navigation.
- **[Axios](https://axios-http.com/ ):** For making HTTP requests to the backend API.
- **[Context API](https://reactjs.org/docs/context.html ):** For global state management (e.g., authentication state).
- **[CSS Modules / Styled Components](https://styled-components.com/ ):** For scoped and organized component styling.

---

## 📂 Project Structure

The project is organized into two main directories: `backend` and `frontend`.
```
/dental-system
|
├── /backend
|   ├── /config         # DB connection, file upload settings
|   ├── /controllers    # Business logic for each route
|   ├── /middleware     # Custom middleware (auth, error handling)
|   ├── /models         # Mongoose schemas for the database
|   ├── /routes         # API route definitions
|   ├── /uploads        # Directory for storing uploaded files
|   ├── node_modules
|   ├── .env            # Environment variables (gitignored)
|   └── server.js       # Server entry point
|
└── /frontend
├── /src
|   ├── /assets     # Images, icons, and global CSS
|   ├── /components # Reusable UI components (buttons, tables, etc.)
|   ├── /context    # Global state providers (e.g., AuthContext)
|   ├── /hooks      # Custom React hooks
|   ├── /layouts    # Page layouts (Dashboard, AuthLayout)
|   ├── /pages      # Components representing full pages
|   ├── /services   # API interaction logic (api.js, caseService.js)
|   └── App.jsx     # Main component managing routing
|   └── main.jsx    # React application entry point
├── .env.local      # Environment variables for the frontend
└── package.json
```


---

## 🚀 Getting Started

To run this project on your local machine, follow these steps.

### **Prerequisites**
- **Node.js:** Version 16 or later.
- **MongoDB:** A local instance or a cloud-hosted database from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas ) (recommended).

### **1. Backend Setup**

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Create a .env file in the backend root and add the following variables
# Replace <your_mongodb_connection_string> with your actual connection string
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

# 4. Start the server
npm start
``` 
The backend server should now be running on http://localhost:5000.

### **2. Frontend Setup**
```bash
# 1. Open a new terminal and navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. (Optional ) Create a .env.local file to specify the API URL
VITE_API_URL=http://localhost:5000/api

# 4. Start the development server
npm run dev
```

The React application should now be running on http://localhost:5173 (or another port specified by Vite )


---

## 🌐 API Endpoints
Here is a summary of the main API endpoints.
| Endpoint                     | Method | Description                                   | Access      |
| ---------------------------- | ------ | --------------------------------------------- | ----------- |
| `POST /api/auth/register`    | `POST` | Register a new user (Doctor or Lab)           | Public      |
| `POST /api/auth/login`       | `POST` | Log in a user                                 | Public      |
| `GET /api/cases`             | `GET`  | Get all cases for the logged-in doctor        | Doctor Only |
| `POST /api/cases`            | `POST` | Create a new medical case (with file upload)  | Doctor Only |
| `GET /api/orders`            | `GET`  | Get all orders for the logged-in user         | Doctor/Lab  |
| `POST /api/orders`           | `POST` | Create a new order from a medical case        | Doctor Only |
| `PUT /api/orders/:id/status` | `PUT`  | Update an order's status (accept, deny, etc.) | Lab Only    |
| `GET /api/labs`              | `GET`  | Get a list of all registered labs             | Doctor Only |
| `GET /api/calendar`          | `GET`  | Get calendar events (delivery dates)          | Doctor Only |
| `POST /api/reviews`          | `POST` | Add a new review for a completed order        | Doctor Only |

---


## 🗺️ Future Roadmap

This project has great potential for expansion. Here are some ideas for future features:

- **Real-time Notifications:** Implement WebSockets to send instant notifications for order status updates.
- **Admin Dashboard:** A dedicated portal for administrators to manage users and monitor system activity.
- **Chat System:** A direct messaging feature for doctors and labs to communicate about specific orders.
- **Payment Gateway Integration:** To manage invoices and payments between clinics and labs.
- **Analytics & Reports:** Display statistics on case volume, average completion time, lab performance, etc.
- **UI/UX Enhancements:** Convert the case creation page into a multi-step wizard for a better user experience.

We hope this project serves as a useful starting point for more complex applications. Contributions and suggestions are always welcome!
