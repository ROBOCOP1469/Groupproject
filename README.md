#Inventory Management System

This is a simple inventory management system built using **Node.js**, **Express**, **MongoDB Atlas**, and **EJS**. The system allows users to perform CRUD operations (Create, Read, Update, Delete) on inventory items and includes authentication for secure access.

---

## Features

- User login and authentication
- Hashed password stored in the database.
- Add new inventory items
- View inventory items in a styled table
- Edit existing inventory items
- Delete inventory items
- RESTful API endpoints for programmatic access
- Deployed using modern web technologies

---

## Running the Application
Start the Server:
- node server.js
- Access the Application:
- Open your browser and navigate to http://localhost:3000

---
## Create a User for the application with API Endpoint
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"username": "Sample", "password": "Sample"}'

---

## RESTful API Endpoints
Method: GET
- Endpoint: /api/inventory
- Description: Get all inventory items

Method: GET
- Endpoint: /api/inventory/:id
- Description: Get a specific item

Method: POST
- Endpoint: /api/inventory
- Description: Add a new inventory item

Method: PUT
- Endpoint: /api/inventory/:id
- Description: Update an inventory item by ID

Method: DELETE
- Endpoint: /api/inventory/:id
- Description: Delete an inventory item by ID

---

##File Structure
├── views/
│   ├── login.ejs          # Login page template
│   ├── inventory.ejs      # Inventory page template
├── models/
│   ├── user.js            # User schema
│   ├── item.js            # Inventory item schema
├── server.js              # Main server file
├── package.json           # Project metadata and dependencies
├── README.md              # Project documentation

##Technologies Used
- Node.js: Backend runtime
- Express: Web framework
- MongoDB Atlas: NoSQL database
- Mongoose: MongoDB ODM
- EJS: Template engine
- cURL/Postman: For testing API endpoints
