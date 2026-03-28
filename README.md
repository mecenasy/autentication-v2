<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Authenticator V2

A comprehensive authentication and authorization system built with NestJS, featuring multi-factor authentication, social login, CSRF protection, and federation capabilities.

## Features

### 🔐 Authentication & Security

- **Multi-Factor Authentication (MFA)** - TOTP, SMS, and email verification
- **Passkey/WebAuthn Support** - Passwordless authentication
- **CSRF Protection** - Built-in CSRF token validation with automatic exemptions
- **Rate Limiting** - Request throttling to prevent abuse
- **Session Management** - Secure session handling with Redis
- **Password Security** - Bcrypt hashing and validation

### 🌐 Social Authentication

- **Google OAuth 2.0**
- **Facebook Login**
- **GitHub OAuth**
- **LinkedIn OAuth**
- **Twitter OAuth**
- **Microsoft Azure AD**

### 🔄 Federation & Microservices

- **gRPC Services** - Microservice architecture with Protocol Buffers
- **Federation Support** - Cross-service authentication
- **Event-Driven Architecture** - CQRS pattern implementation
- **Redis Integration** - Caching and session storage

### 📡 Communication

- **GraphQL API** - Flexible query and mutation interface
- **REST API** - Traditional REST endpoints
- **WebSocket Support** - Real-time communication
- **Email Notifications** - Nodemailer integration
- **SMS Notifications** - Twilio integration

### 🛠️ Developer Tools

- **Swagger Documentation** - Auto-generated API docs
- **TypeORM** - Database ORM with migrations
- **PostgreSQL Support** - Primary database
- **Docker Support** - Containerized deployment
- **Environment Configuration** - Flexible config management

## Technology Stack

- **Framework**: NestJS (Node.js/TypeScript)
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Authentication**: JWT, Passport.js, WebAuthn
- **API**: GraphQL (Apollo) + REST
- **Communication**: gRPC, WebSockets
- **Security**: CSRF protection, Rate limiting, bcrypt
- **Infrastructure**: Docker, Docker Compose

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- Redis
- Docker (optional, for containerized setup)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd autentication-v2
```

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

1. Start the database services (using Docker):

```bash
docker-compose up -d
```

1. Run database migrations:

```bash
npm run migration:run
```

### Development

```bash
# Start in development mode with hot reload
npm run dev

# Start in debug mode
npm run debug

# Build the project
npm run build
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm run prod
```

## Configuration

### Environment Variables

Key environment variables to configure:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your_db_user
DATABASE_PASSWORD=your_db_password
DATABASE_DB=authenticator_v2

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Social OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
# ... other OAuth providers

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_password

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## API Documentation

### REST API

The application provides REST endpoints for authentication:

- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/mfa/setup` - Setup MFA
- `POST /auth/mfa/verify` - Verify MFA code

### GraphQL API

Access the GraphQL playground at `http://localhost:3000/graphql`

**Example Queries:**

```graphql
query GetUser {
  user {
    id
    email
    profile {
      firstName
      lastName
    }
  }
}
```

**Example Mutations:**

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    accessToken
    refreshToken
    user {
      id
      email
    }
  }
}
```

### Swagger Documentation

Interactive API documentation available at: `http://localhost:3000/api`

## CSRF Protection

This application includes built-in CSRF protection. See [CSRF_USAGE.md](./CSRF_USAGE.md) for detailed usage instructions.

### Quick CSRF Usage

1. Get CSRF token:

```javascript
const response = await fetch('/csrf/token');
const { csrfToken } = await response.json();
```

1. Include token in requests:

```javascript
fetch('/api/protected-endpoint', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

## Database Management

### TypeORM Commands

```bash
# Create a new migration
npm run migration:create -- -n MigrationName

# Generate migration from entity changes
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Drop database schema
npm run db:drop
```

### gRPC Services

The application uses gRPC for microservice communication. Protocol buffer files are located in `src/proto/`.

To regenerate TypeScript types from proto files:

```bash
npm run proto
```

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run tests in watch mode
npm run test:watch
```

## Project Structure

```
src/
├── authenticator/          # Core authentication modules
│   ├── auth/              # Authentication logic
│   ├── notify/            # Notifications (email, SMS)
│   ├── social-config/     # Social OAuth configuration
│   └── user/              # User management
├── common/                # Shared utilities and modules
├── configs/               # Application configuration
├── csrf/                  # CSRF protection
├── grpc/                  # gRPC services
├── proto/                 # Protocol buffer definitions
└── app.module.ts          # Main application module
```

## Deployment

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t authenticator-v2 .
```

1. Run with Docker Compose:

```bash
docker-compose up -d
```

### Production Deployment

The application includes a deployment script:

```bash
npm run deploy
```

This script:

- Installs dependencies
- Builds the application
- Runs database migrations

## Security Features

- **CSRF Protection**: Automatic CSRF token validation
- **Rate Limiting**: Request throttling to prevent abuse
- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: Secure session handling with Redis
- **MFA Support**: Multiple authentication factors
- **OAuth Security**: Secure social login implementation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the UNLICENSED license.
