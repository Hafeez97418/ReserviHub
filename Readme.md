# ReserviHub

ReserviHub is a comprehensive reservation management system designed to streamline bookings and scheduling processes. The project consists of a frontend and backend, providing an efficient and seamless experience for users.

## Features
- User authentication and session management
- Reservation management with CRUD functionality
- Secure payment gateway integration
- Cloud storage for media uploads
- AI-powered assistance for automated responses

---

## Project Structure

```
root/
│-- frontend/    # Frontend source code (HTML, CSS, JavaScript, TypeScript)
│-- backend/     # Backend source code (Node.js, Express, Database)
│-- README.md    # Project documentation
```

---

## Frontend

The frontend is built using modern web technologies.

### Features

- Responsive UI
- Fetch API for communication with the backend
- User authentication
- Interactive dashboard

### Setup

1. Navigate to the `frontend` directory:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install -g pnpm@latest-10
   pnpm i
   ```
3. Start the development server:
   ```sh
   pnpm dev
   ```

### Build for Production

```sh
pnpm build
```

---

## Backend

The backend is built using Node.js and Express.

### Features

- RESTful API endpoints
- User authentication (JWT-based)
- CRUD operations for reservations
- Database integration with MySQL
- Secure email notifications
- Cloud storage support
- Payment gateway integration

### Setup

1. Navigate to the `backend` directory:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install -g pnpm@latest-10
   pnpm install 
   ```
3. Configure environment variables in `.env` file:
   ```sh
   DATABASE_NAME = "db name"
   DATABASE_USER = "db user name"
   DATABASE_PASSWORD = "db password"
   DATABASE_HOST = "db host"
   SERVER_EMAIL="server email"
   SERVER_EMAIL_PASS="server email password"
   JWT_SECRET = "jwt secret"
   SESSION_SECRET = "express session secret"
   CLOUDINARY_NAME = "cloudinary name"
   CLOUDINARY_API_KEY = "cloudinary api key"
   CLOUDINARY_API_SECRET = "cloudinary api secret"
   GATEWAY_CLIENT_ID = "cashfree-pg id"
   GATEWAY_SECRET = "cashfree-pg secret"
   GATEWAY_BASE_URL = "https://sandbox.cashfree.com"
   FRONTEND_BASE_URL = "http://localhost" #only for development
   AI_API_KEY = "gemini ai api key"
   PORT= 80
   ```
4. Start the server:
   ```sh
   pnpm prod:serve
   ```

### API Endpoints

Full API documentation can be found here:
[Postman Documentation](https://documenter.getpostman.com/view/27655998/2sB2cRCPpT)

## License

This project is open-source and available under the MIT License.

