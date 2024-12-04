# Voting Application

This is a backend application for a voting system where users can vote for candidates. It provides functionalities for user authentication, candidate management, and voting.

---

## Features

- **User Sign Up and Login**: Users can sign up and log in using their Aadhar Card Number and password.
- **View Candidates**: Users can view the list of available candidates.
- **Vote for Candidates**: Users can vote for a candidate (only once).
- **Admin Management**:
  - Admins can add, update, or delete candidates.
  - Admins are not allowed to vote.

---

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JSON Web Tokens (JWT)** for authentication

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Prince-1501/voting_app.git
   ```

# API Endpoints

## Authentication

### **Sign Up**
- **POST** `/signup`: Sign up a user

### **Login**
- **POST** `/login`: Login a user

---

## Candidates

### **Get Candidates**
- **GET** `/candidates`: Get the list of candidates

### **Add Candidate**
- **POST** `/candidates`: Add a new candidate (Admin only)

### **Update Candidate**
- **PUT** `/candidates/:id`: Update a candidate by ID (Admin only)

### **Delete Candidate**
- **DELETE** `/candidates/:id`: Delete a candidate by ID (Admin only)

---

## Voting

### **Get Vote Count**
- **GET** `/candidates/vote/count`: Get the count of votes for each candidate

### **Vote for Candidate**
- **POST** `/candidates/vote/:id`: Vote for a candidate (User only)

---

## User Profile

### **Get Profile**
- **GET** `/users/profile`: Get user profile information

### **Change Password**
- **PUT** `/users/profile/password`: Change user password
