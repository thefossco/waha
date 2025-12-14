#!/bin/bash

echo "🚀 Starting Waha Messaging Portal on localhost..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Start services
echo "Starting all services..."
docker-compose up -d --build

# Wait for services to be ready
echo ""
echo "Waiting for services to start..."
sleep 10

# Run migrations
echo ""
echo "Running database migrations..."
docker-compose exec -T backend npx prisma migrate deploy

# Check if admin user exists
echo ""
echo "Creating admin user..."
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin User","email":"admin@example.com","password":"admin123","role":"ADMIN"}' > /dev/null 2>&1

echo ""
echo "=========================================="
echo "✅ Waha Messaging Portal is running!"
echo "=========================================="
echo ""
echo "🌐 Open in browser: http://localhost"
echo ""
echo "🔐 Login credentials:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "📊 Service URLs:"
echo "   Frontend: http://localhost"
echo "   Backend:  http://localhost:3000/api"
echo ""
echo "🛠️  Useful commands:"
echo "   View logs:  docker-compose logs -f"
echo "   Stop:       docker-compose down"
echo "   Restart:    docker-compose restart"
echo ""
