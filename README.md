# Waha Bulk Messaging Portal

A comprehensive web portal for sending bulk messages to multiple customers using the Waha API. The portal supports single send, group send, and bulk send with delivery tracking and activity logging.

## Features

- **Authentication & Authorization**: Role-based access control (Admin, User, Viewer)
- **Contact Management**: Add, import (CSV), and organize contacts
- **Group Management**: Create and manage contact groups
- **Message Templates**: Create reusable message templates
- **Bulk Messaging**: Send messages to individual contacts, groups, or via CSV upload
- **Delivery Tracking**: Real-time status tracking for all messages
- **Audit Logging**: Complete activity logging for compliance
- **Rate Limiting**: Built-in throttling to respect API limits
- **Queue System**: Background job processing with Bull and Redis
- **Retry Logic**: Automatic retry on failures with exponential backoff

## Architecture

### Backend
- **Framework**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Bull (Redis-based)
- **Authentication**: JWT
- **Validation**: Joi
- **Logging**: Winston

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form
- **API Client**: Axios

## Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

#### Option 1: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd waha
```

2. Create backend environment file:
```bash
cp backend/.env.example backend/.env
```

3. Edit `backend/.env` with your configuration:
```env
DATABASE_URL="postgresql://waha:waha_password@postgres:5432/waha_messaging?schema=public"
REDIS_HOST=redis
REDIS_PORT=6379
JWT_SECRET=your-super-secret-jwt-key-change-this
ENCRYPTION_KEY=your-32-character-encryption-key
WAHA_API_URL=https://your-waha-api-url
WAHA_API_KEY=your-waha-api-key
```

4. Start all services:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
docker-compose exec backend npx prisma migrate deploy
```

6. Access the application:
- Frontend: http://localhost
- Backend API: http://localhost:3000/api

#### Option 2: Manual Setup

1. Install dependencies:
```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

2. Set up PostgreSQL database:
```bash
createdb waha_messaging
```

3. Configure environment:
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

4. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

5. Start Redis:
```bash
redis-server
```

6. Start the backend:
```bash
cd backend
npm run dev
```

7. Start the worker (in another terminal):
```bash
cd backend
npm run worker
```

8. Start the frontend (in another terminal):
```bash
cd frontend
npm run dev
```

9. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api

## Usage

### Initial Setup

1. **Register a User**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securepassword",
    "role": "ADMIN"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "securepassword"
  }'
```

Save the returned JWT token for subsequent requests.

### Sending Messages

1. **Add Contacts**:
   - Via UI: Navigate to Contacts → Add Contact
   - Via CSV: Contacts → Upload CSV (format: name,phone,tags)

2. **Create Message Template** (Optional):
   - Navigate to Templates → Create Template

3. **Send Message**:
   - Navigate to Send Message
   - Compose your message or select a template
   - Choose recipients (individual, contacts, or groups)
   - Click Send

4. **Track Delivery**:
   - Navigate to Messages to view all sent messages
   - Click on a message to see detailed delivery status for each recipient

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

#### Contacts
- `POST /api/contacts` - Create contact
- `GET /api/contacts` - List contacts
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

#### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - List groups
- `POST /api/groups/:id/contacts` - Add contacts to group

#### Templates
- `POST /api/templates` - Create template
- `GET /api/templates` - List templates
- `PUT /api/templates/:id` - Update template
- `DELETE /api/templates/:id` - Delete template

#### Messages
- `POST /api/messages` - Send message
- `GET /api/messages` - List messages
- `GET /api/messages/:id` - Get message details
- `GET /api/messages/stats` - Get message statistics

#### Upload
- `POST /api/upload/csv` - Upload contacts CSV
- `POST /api/upload/validate-csv` - Validate CSV before upload

#### Callbacks
- `POST /api/callbacks/waha` - Waha API callback endpoint

## Database Schema

Key tables:
- **users**: User accounts with role-based access
- **contacts**: Customer contact information
- **groups**: Contact groups
- **messages**: Message records with status
- **message_items**: Individual message delivery records
- **templates**: Reusable message templates
- **audit_logs**: Activity audit trail

## Security

- JWT-based authentication
- API keys encrypted at rest using AES
- Input validation and sanitization
- Rate limiting on API endpoints
- HTTPS recommended for production
- Environment variables for secrets
- SQL injection protection via Prisma ORM
- XSS protection via input sanitization

## Configuration

### Environment Variables

See `backend/.env.example` for all available configuration options.

Key settings:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST` & `REDIS_PORT`: Redis connection
- `JWT_SECRET`: JWT signing key
- `ENCRYPTION_KEY`: AES encryption key for API keys
- `WAHA_API_URL`: Waha API endpoint
- `WAHA_API_KEY`: Default Waha API key
- `MAX_BATCH_SIZE`: Maximum recipients per batch (default: 100)
- `WAHA_RATE_LIMIT_PER_MINUTE`: API rate limit (default: 60)

### Rate Limiting

The system implements rate limiting at two levels:
1. **API Level**: General API rate limiting (100 requests per 15 minutes)
2. **Waha API Level**: Configurable per-minute limits for Waha API calls

### Retry Logic

Failed messages are automatically retried:
- **Max Retries**: 3 attempts (configurable via `MAX_RETRIES`)
- **Backoff**: Exponential backoff starting at 1 second
- **Error Handling**: Permanent failures (4xx) are not retried

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Production Checklist

- [ ] Set strong `JWT_SECRET` and `ENCRYPTION_KEY`
- [ ] Configure production database
- [ ] Set up TLS/HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and alerting
- [ ] Configure log rotation
- [ ] Set up database backups
- [ ] Review rate limits
- [ ] Configure Waha API credentials
- [ ] Test callback endpoint connectivity

### Docker Production

```bash
docker-compose -f docker-compose.yml up -d --build
```

## Monitoring

Logs are stored in:
- **Backend**: `backend/logs/`
  - `error.log`: Error-level logs
  - `combined.log`: All logs

Monitor key metrics:
- Message send rate
- Success/failure rates
- Queue depth
- API response times

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check `DATABASE_URL` in `.env`

2. **Queue Jobs Not Processing**
   - Verify Redis is running
   - Ensure worker process is started
   - Check worker logs

3. **Waha API Errors**
   - Verify `WAHA_API_URL` and `WAHA_API_KEY`
   - Check Waha API rate limits
   - Review error logs for specific error codes

4. **CSV Upload Failures**
   - Verify CSV format: `name,phone,tags`
   - Check file size limits (`MAX_FILE_SIZE_MB`)
   - Ensure phone numbers are in E.164 format

## Development

### Database Migrations

Create new migration:
```bash
cd backend
npx prisma migrate dev --name migration_name
```

Reset database:
```bash
npx prisma migrate reset
```

### Database Studio

View database with Prisma Studio:
```bash
cd backend
npm run db:studio
```

## License

MIT

## Support

For issues and feature requests, please contact the development team.
