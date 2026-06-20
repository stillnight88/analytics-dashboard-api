# Analytics Dashboard API

A backend API built with Node.js, Express, and MongoDB for collecting user activity events and exposing analytics data through administrative dashboard endpoints.

This project was created while learning backend development concepts such as event tracking, analytics aggregation, rate limiting, authentication, authorization, and dashboard-oriented API design.

---

## Project Context

The primary goal of this project was exploring how analytics systems collect and process user activity data.

The application allows authenticated users to submit activity events while administrators can access aggregated analytics data through protected dashboard endpoints.

Key concepts explored include:

* Event logging
* User activity tracking
* Analytics reporting
* Dashboard APIs
* JWT authentication
* Role-based authorization
* Rate limiting
* MongoDB aggregation workflows

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes

### Event Tracking

* Activity event logging
* Event validation
* User-associated events
* Event metadata support

### Analytics Dashboard

* Event summaries
* User activity timelines
* Top user analytics
* Administrative reporting endpoints

### Security

* JWT authentication
* Role-based access control
* Admin-only dashboard access
* Event ingestion rate limiting

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### Rate Limiting

* express-rate-limit

### Data Export

* json2csv

### Validation

* validator.js

### Templating

* EJS

---

## Project Structure

```text
controllers/      Authentication, event, and dashboard logic
middleware/       Authentication, authorization, and rate limiting
models/           User and event schemas
routes/           Authentication, event, and dashboard routes
utils/            Validation and response helpers
views/            EJS templates
public/           Static assets
app.js            Application entry point
```

---

## Installation

### Prerequisites

* Node.js
* MongoDB Atlas account or local MongoDB instance

### Clone the Repository

```bash
git clone <repository-url>
cd analytics-dashboard-api
```

### Install Dependencies

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values as needed for your environment.

Refer to `.env.example` for the complete list of configuration variables.

### Start the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Analytics Workflow

The application follows a simple analytics pipeline:

```text
Authenticated User
          ↓
     Log Event
          ↓
     Store Event
          ↓
   Analytics Queries
          ↓
 Admin Dashboard APIs
```

Users generate activity events which are stored in MongoDB.

Administrators can then access aggregated analytics data through dedicated dashboard endpoints.

---

## Authorization Model

### User

Authenticated users can:

* Submit activity events

### Admin

Administrators can:

* View analytics summaries
* View user activity timelines
* View top user reports

Dashboard endpoints are protected through role-based authorization.

---

## API Overview

### Authentication Routes

```http
POST /auth/signup
POST /auth/login
```

### Event Routes

```http
POST /api/events
```

### Dashboard Routes

```http
GET /api/dashboard/summary
GET /api/dashboard/user/:userId
GET /api/dashboard/top-users
```

---

## Rate Limiting

Event ingestion endpoints are protected using request rate limiting to reduce abuse and excessive event creation.

The limiter is applied before event creation and operates on authenticated users.

---

## Limitations

This repository reflects an early learning project and intentionally focuses on analytics-related backend concepts.

Current limitations include:

* No automated test suite
* No API documentation (Swagger/OpenAPI)
* No background processing pipeline
* No event batching
* No real-time analytics
* No multi-tenant support
* No CI/CD pipeline
* Limited production hardening

---

## Repository Status

This repository is preserved as a learning project demonstrating:

* Event tracking systems
* Analytics dashboard APIs
* JWT authentication
* Role-based authorization
* Request rate limiting
* MongoDB data modeling
* Activity reporting workflows

The project is not actively maintained and primarily serves as a reference for the backend concepts explored during development.
