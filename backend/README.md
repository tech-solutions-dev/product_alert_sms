# Product Alert SMS Backend – Technical Guide

Hey there! 👋  
Welcome to the backend of the Product Alert SMS system. This document is written for you, the frontend developer, to help you understand how to interact with the backend API, what endpoints are available, how authentication works, and what data you can expect. If you have any questions, just ping me!

---

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Products](#products)
  - [Categories](#categories)
  - [Reports](#reports)
  - [Backups](#backups)
  - [Dashboard](#dashboard)
  - [Barcode](#barcode)
  - [Uploads](#uploads)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [Other Notes](#other-notes)

---

## Getting Started

- **Base URL:**  
  All endpoints are prefixed with `/api`.  
  Example: `http://localhost:5000/api/products`

- **Environment:**  
  The backend runs on Node.js (Express) and uses MySQL via Sequelize ORM.

- **Authentication:**  
  Most endpoints require a JWT token (see [Authentication](#authentication)).

---

## Authentication

### Register

- **POST** `/api/auth/register`
- **Body:**  
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword",
    "role": "user" // optional, defaults to 'user'
  }
  ```
- **Response:**  
  User object (without password).

### Login

- **POST** `/api/auth/login`
- **Body:**  
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- **Response:**  
  ```json
  {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

### Get Profile

- **GET** `/api/auth/profile`
- **Headers:**  
  `Authorization: Bearer <JWT_TOKEN>`
- **Response:**  
  User object (without password).

---

## API Endpoints

### Users

> **Admin only** for most actions.

- **GET** `/api/users`  
  List all users.

- **GET** `/api/users/:id`  
  Get user by ID.

- **PUT** `/api/users/:id`  
  Update user.

- **DELETE** `/api/users/:id`  
  Delete user.

---

### Products

- **GET** `/api/products`  
  List all products (with category info).

- **GET** `/api/products/:id`  
  Get product by ID.

- **POST** `/api/products`  
  Create product.  
  **Body:**  
  ```json
  {
    "name": "Milk",
    "barcode": "1234567890",
    "expiryDate": "2024-07-01",
    "categoryId": 2,
    "quantity": 10
  }
  ```

- **PUT** `/api/products/:id`  
  Update product.

- **DELETE** `/api/products/:id`  
  Delete product.

---

### Categories

- **GET** `/api/categories`  
  List all categories.

- **GET** `/api/categories/:id`  
  Get category by ID.

- **POST** `/api/categories`  
  Create category.  
  **Body:**  
  ```json
  { "name": "Dairy" }
  ```

- **PUT** `/api/categories/:id`  
  Update category.

- **DELETE** `/api/categories/:id`  
  Delete category.

---

### Reports

- **GET** `/api/reports`  
  List all reports.

- **POST** `/api/reports/generate`  
  Generate a new report.  
  **Body:**  
  ```json
  { "type": "monthly" } // or "weekly"
  ```
  **Response:**  
  Contains lists of expired and expiring products.

- **GET** `/api/reports/:id`  
  Get report by ID.

---

### Backups

> **Admin only.**

- **GET** `/api/backups`  
  List all backups.

- **POST** `/api/backups/create`  
  Create a new database backup.

- **POST** `/api/backups/restore/:backupId`  
  Restore a backup by ID.

---

### Dashboard

- **GET** `/api/dashboard`  
  Returns an overview:  
  ```json
  {
    "totalProducts": 100,
    "expiringSoon": 5,
    "expired": 2,
    "categories": [ ... ]
  }
  ```

---

### Barcode

- **POST** `/api/barcode/scan`  
  **Body:**  
  ```json
  { "barcode": "1234567890" }
  ```
  **Response:**  
  Product object if found.

---

### Uploads

- **POST** `/api/uploads`  
  **Form Data:**  
  `file` (single file upload)
- **Response:**  
  `{ "file": "uploaded-filename.jpg" }`

---

## Data Models

### User

```json
{
  "id": 1,
  "name": "John",
  "email": "john@example.com",
  "role": "user"
}
```

### Product

```json
{
  "id": 1,
  "name": "Milk",
  "barcode": "1234567890",
  "expiryDate": "2024-07-01T00:00:00.000Z",
  "description": "Fresh milk",
  "quantity": 10,
  "imageUrl": null,
  "categoryId": 2,
  "Category": { ... }
}
```

### Category

```json
{
  "id": 2,
  "name": "Dairy"
}
```

### Report

```json
{
  "id": 1,
  "type": "monthly",
  "data": {
    "expired": [ ... ],
    "expiring": [ ... ]
  },
  "generatedAt": "2024-06-01T12:00:00.000Z"
}
```

---

## Error Handling

- All errors return a JSON response with a `message` and (optionally) an `error` field.
- Example:
  ```json
  { "message": "Product not found" }
  ```

---

## Other Notes

- **JWT Token:**  
  Send the token in the `Authorization` header as `Bearer <token>` for all protected routes.

- **Roles:**  
  - `admin`: Full access.
  - `manager`: Can manage products/categories/reports.
  - `user`: Limited access (mainly viewing).

- **Date Formats:**  
  Dates are in ISO 8601 format (e.g., `"2024-07-01T00:00:00.000Z"`).

- **File Uploads:**  
  Uploaded files are stored in `/uploads` directory.

- **Backups:**  
  Database backups are stored in `/backups`.

---
