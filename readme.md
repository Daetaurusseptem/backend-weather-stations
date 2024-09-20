# Climate Project - Backend

This project is the backend for a climate monitoring system. It provides a RESTful API for managing stations, sensors, and their real-time data using **Node.js**, **Express**, **MongoDB**, and **Socket.IO** for real-time data updates.

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (Local or cloud-based, such as MongoDB Atlas)
- **npm** (v6 or higher)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/climate-backend.git
   cd climate-backend
Install dependencies:

bash
Copiar código
npm install
Create a .env file in the root of the project with the following settings:

bash
Copiar código
PORT=3000
MONGO_URI=mongodb://localhost:27017/climate
JWT_SECRET=your_jwt_secret
Start the server:

bash
Copiar código
npm start
The server will be running on http://localhost:3000.

API Documentation
This backend integrates with Swagger for API documentation.

Access the documentation at http://localhost:3000/api-docs.

Main Endpoints
Authentication
POST /api/auth/login - Login and obtain a JWT token.
GET /api/auth/validate-token - Validate if a token is valid.
Stations
GET /api/stations - Retrieve all stations.
POST /api/stations - Create a new station.
GET /api/stations/:id - Retrieve a station by ID.
PUT /api/stations/:id - Update a station.
DELETE /api/stations/:id - Delete a station.
Sensors
GET /api/sensors/:id - Retrieve sensor data for a specific station.
POST /api/sensors/:id - Create new sensor data for a station.
PUT /api/sensors/data/:sensorId - Update a sensor data entry.
DELETE /api/sensors/data/:sensorId - Delete a sensor data entry.
Sockets
The backend also includes Socket.IO for real-time updates of sensor and station data.

Sensor update event: newSensorUpdate
Sensor deletion event: deleteSensor
Station update event: updateStation
Project Structure
bash
Copiar código
src/
│
├── controllers/        # API Controllers
│   ├── authController.ts
│   ├── stationController.ts
│   ├── sensorController.ts
│
├── middleware/         # Authentication and Error Handling Middleware
│   ├── authMiddleware.ts
│   └── errorMiddleware.ts
│
├── models/             # Mongoose Models
│   ├── station.ts
│   ├── sensor.ts
│   └── user.ts
│
├── routes/             # API Routes
│   ├── authRoutes.ts
│   ├── stationRoutes.ts
│   └── sensorRoutes.ts
│
└── server.ts           # Main server and Socket.IO configuration
Development and Contribution
Create a new branch for your feature or bugfix:

bash
Copiar código
git checkout -b my-feature
Make your changes and commit:

bash
Copiar código
git commit -m "Added a new feature"
Push your changes:

bash
Copiar código
git push origin my-feature
Create a pull request from GitHub.

License
This project is licensed under the MIT License. See the LICENSE file for more details.

css
Copiar código

This README provides clear instructions for setting up, running, and contributing to the backend, and includes all relevant information about API routes, real-time socket integration, and more.

Would you like to adjust anything in the README?