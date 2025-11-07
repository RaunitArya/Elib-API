# Elib-API

A library management system API built with modern web technologies.

## Features

- User authentication and authorization
- Book catalog management
- Search and filtering capabilities
- RESTful API design

## Project Structure

```
elib-apis/
├── src/
│   ├── config/        # Configuration files (database, cloudinary, etc.)
│   ├── middlewares/   # Custom middleware (auth, error handling)
│   ├── book/          # books related functions and endpoints
│   ├── users/         # users related functions and endpoints
│   └── app.ts         # Express app setup
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
├── package.json      # Project dependencies
└── tsconfig.json     # TypeScript configuration
```

## Installation

```bash
npm install
```

## Cloudinary 
Setup account in Cloudinary and generate api key
https://console.cloudinary.com/app/c-231e8b553ff7308266ed5341c01012/image/getting-started

## Configuration

Create a `.env` file in the root directory:

```env
PORT='port for the server to listen on'
NODE_ENV='production|development'
MONGODB_URI='mongodb connection uri'
JWT_SECRET='your_secret'
CLOUDINARY_CLOUD='cloudinary cloud name'
CLOUDINARY_API_KEY='cloudinary api key'
CLOUDINARY_SECRET='cloudinary api secret'
```

## Usage

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:bookId` - Get book by ID
- `POST /api/books` - Add or Create new book
- `PATCH /api/books/:bookId` - Update book
- `DELETE /api/books/:bookId` - Delete book

## Tech Stack

- Node.js
- Express.js
- MongoDB & Cloudinary
- JWT for authentication