# 📚 Role-Based Library Management System (MERN Stack)

<!-- 
README.md for GitHub repository
Tech Stack: MongoDB, Express.js, React.js, Node.js
-->

A **Role-Based Library Management System** built using the **MERN stack**.  
The system supports **Admin** and **Student** roles, providing controlled access to features using **JWT-based authentication** and **role-based authorization**.

---

## 📝 Project Description

This project is a full-stack web application designed to manage library operations digitally.  
It allows administrators to manage books and users, while students can search, issue, and return books.

The project demonstrates:
- MERN stack architecture
- RESTful API design
- Role-Based Access Control (RBAC)
- Secure authentication using JWT
- Real-world CRUD operations

---

## 👥 User Roles & Permissions

### 🔑 Admin
- Add new books
- Update book details
- Delete books
- View all books
- View all issued books
- Manage student accounts

### 🎓 Student
- View available books
- Search books by title or author
- Issue books
- Return books
- View issued book history

---

## ⚙️ Core Features

- Role-based authentication & authorization
- Secure login & signup using JWT
- Book management (CRUD)
- Book issue & return workflow
- Protected routes (backend + frontend)
- MongoDB-based persistent storage

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM
- HTML, CSS, JavaScript

### Backend
- Node.js
- Express.js
- JWT (JSON Web Token)
- bcrypt (password hashing)

### Database
- MongoDB
- Mongoose

---

## 🗂️ Project Structure

```text
library-management-system
│
├── backend
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   └── student.controller.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   └── student.routes.js
│   │
│   ├── models
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── IssuedBook.js
│   │
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── config
│   │   └── db.js
│   │
│   ├── server.js
│   └── .env
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.js
│   └── package.json
│
├── README.md
└── package.json
