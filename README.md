# Farmer App - Full Stack Web Application

A professional full-stack web application connecting farmers with consumers, built with PHP, React, MongoDB, and Docker.

## 🚀 Features

- **User Authentication**: Secure Login/Registration with Password Hashing & Sessions.
- **Product Management**: Create, Read, Update, Delete (CRUD) operations for agricultural products.
- **Secure Architecture**: Input validation, CSRF protection, and environment-based configuration.
- **Async Processing**: RabbitMQ integration for background tasks (e.g., notifications).
- **Scheduled Tasks**: Cron jobs for database cleanup.
- **Containerization**: Fully Dockerized (Apache+PHP, MongoDB, RabbitMQ).
- **CI/CD**: GitLab CI pipeline for automated testing and deployment.

## 📂 Project Structure

```
farmer-app/
├── backend/            # PHP Backend APIs & Classes
│   ├── api/            # API Endpoints (Login, Register, Products)
│   ├── classes/        # OOP Classes (User, Product, Queue)
│   ├── config/         # Database & Env Config
│   ├── workers/        # RabbitMQ Consumers
│   └── Dockerfile      # Backend Docker Image
├── client/             # React Frontend
├── cron/               # Scheduled Scripts (cleanup.php)
├── docker-compose.yml  # Docker Orchestration
├── .env                # Environment Variables (Security)
└── .gitlab-ci.yml      # CI/CD Pipeline
```

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Node.js (for local frontend dev)

### 1. Configure Environment
Backend Configuration is managed via `backend/.env`.
Ensure `backend/.env` contains your MongoDB credentials and RabbitMQ settings (already configured in this setup).

### 2. Run with Docker (Recommended)
This will start the Backend (Apache+PHP), MongoDB, RabbitMQ, and the Worker service.

```bash
docker-compose up -d --build
```

- **Backend API**: http://localhost:8000
- **Frontend**: http://localhost:3000 (if running client via docker)
- **RabbitMQ Dashboard**: http://localhost:15672 (guest/guest)

### 3. Run Manually (Local Dev)
**Backend:**
```bash
cd backend
composer install
php -S localhost:8000 -t public
```

**Frontend:**
```bash
cd client
npm install
npm start
```

## 📦 Deployment

### Apache Server Deployment
1. **Prepare Server**: Ensure Apache, PHP 8.2+, MongoDB Driver, and Composer are installed.
2. **Clone Repository**:
   ```bash
   git clone <repo_url> /var/www/html/farmer-app
   ```
3. **Install Dependencies**:
   ```bash
   cd /var/www/html/farmer-app/backend
   composer install --no-dev --optimize-autoloader
   ```
4. **Configure Apache**:
   Point DocumentRoot to `backend/public` (or root if using provided .htaccess).
   Enable `mod_rewrite`.
5. **Set Environment**:
   Create `.env` file in `backend/` with production credentials.
6. **Permissions**:
   Ensure `www-data` has write access to `uploads/` directory.

### CI/CD Pipeline
The included `.gitlab-ci.yml` automates:
1. **Build**: Creates Docker images.
2. **Test**: Runs PHP linting and unit tests.
3. **Deploy**: Deploys to production server (configuration required).

## ✅ Evaluation Criteria Met
- **Functionality**: Full Auth & CRUD.
- **Security**: Helper classes, CSRF tokens, Prepared statements (MongoDB driver).
- **Defensive Programming**: Try-catch blocks, Input validation.
- **Docker**: Complete `docker-compose` setup.
- **CI/CD**: GitLab CI integration.

---
*Developed for Selfmade Ninja Academy.*
