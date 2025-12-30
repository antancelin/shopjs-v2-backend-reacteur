# ShopJS v2 Backend API

REST API for the ShopJS v2 e-commerce project, built with Node.js, Express, and MongoDB.

## Overview

This API provides:

- User signup/login (token-based authentication)
- Products catalog (with a basic search)
- Orders creation and administration

## Tech stack

- Node.js, Express
- MongoDB, Mongoose
- dotenv (environment variables)
- cors (CORS policy)
- crypto-js + uid2 (password hashing + token generation)

## Project structure

```
index.js                # Server entrypoint
models/                 # Mongoose models
routes/                 # API routes
middlewares/            # Auth / admin middlewares
assets/products.json    # Seed data (development only)
.env.example            # Environment variables template
```

## Requirements

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Yarn or npm

## Getting started (local)

Install dependencies:

```bash
yarn install
```

Create your local env file:

```bash
cp .env.example .env
```

Start the server:

```bash
yarn dev
```

Default local URL: `http://localhost:4000`.

## Environment variables

The server uses these variables:

- `MONGODB_URI` (required): MongoDB connection string
- `NODE_ENV` (optional): `development` (default) or `production`
- `PORT` (optional): defaults to `4000` (local)
- `CORS_ORIGINS` (production required): comma-separated list of allowed origins

Example (local):

```dotenv
MONGODB_URI=mongodb://localhost:27017/DATABASE_NAME
NODE_ENV=development
PORT=4000
CORS_ORIGINS=http://localhost:3000
```

Example (production):

```dotenv
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/DATABASE_NAME
NODE_ENV=production
CORS_ORIGINS=https://{YOUR_DEPLOYED_URL}
```

## API endpoints

Health:

- `GET /` returns a JSON status payload

Auth:

- `POST /user/signup`
- `POST /user/login`

Products:

- `GET /products?search=term`
- `GET /products/:id`

Orders (requires `Authorization: Bearer <token>`):

- `POST /orders` (authenticated users)
- `GET /orders` (admin only)
- `PUT /orders/mark-delivered/:id` (admin only)

Development-only seed route:

- `POST /create-db` resets the products collection using `assets/products.json`
- Disabled in production (returns `404`)

## Notes for a public deployment

- The `/create-db` route is intentionally disabled in production.
- The `GET /orders` response only populates safe owner fields (no token/hash/salt/email).

## Security notes

This project is educational. Passwords are hashed using SHA256 + a per-user salt. For production-grade systems, use a dedicated password hashing algorithm such as bcrypt or argon2.

## Deployment notes (Northflank)

On Northflank, define environment variables in the UI:

- `MONGODB_URI` (your MongoDB Atlas URL)
- `NODE_ENV=production`
- `CORS_ORIGINS` (your frontend origin, for example `https://{YOUR_DEPLOYED_URL}`)

Northflank manages `PORT` automatically.

## Links

- Frontend: [ShopJS v2 Frontend](https://shopjsv2-frontend.vercel.app)
