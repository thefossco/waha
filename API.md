# Waha Bulk Messaging Portal - API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "USER"
}
```

**Roles:** `ADMIN`, `USER`, `VIEWER`

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

### Get Profile

**GET** `/auth/profile`

Get current user profile (requires authentication).

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "lastLogin": "2025-01-01T12:00:00.000Z",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

---

## Contact Endpoints

### Create Contact

**POST** `/contacts`

Add a new contact (requires authentication).

**Request Body:**
```json
{
  "name": "Alice Smith",
  "phone": "+1234567890",
  "tags": ["customer", "vip"],
  "metadata": {
    "company": "Acme Corp"
  }
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "name": "Alice Smith",
  "phone": "+1234567890",
  "tags": ["customer", "vip"],
  "metadata": {
    "company": "Acme Corp"
  },
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### List Contacts

**GET** `/contacts?search=alice&tag=customer&page=1&limit=50`

List all contacts with optional filters.

**Query Parameters:**
- `search`: Search by name or phone
- `tag`: Filter by tag
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 50)

**Response:** `200 OK`
```json
{
  "contacts": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "pages": 2
  }
}
```

### Update Contact

**PUT** `/contacts/:id`

Update an existing contact.

**Request Body:**
```json
{
  "name": "Alice Johnson",
  "phone": "+1234567890",
  "tags": ["customer", "premium"]
}
```

**Response:** `200 OK`

### Delete Contact

**DELETE** `/contacts/:id`

Delete a contact (Admin only).

**Response:** `204 No Content`

---

## Group Endpoints

### Create Group

**POST** `/groups`

Create a new contact group.

**Request Body:**
```json
{
  "name": "VIP Customers"
}
```

**Response:** `201 Created`

### List Groups

**GET** `/groups`

Get all groups with contact counts.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "VIP Customers",
    "contactCount": 25,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Add Contacts to Group

**POST** `/groups/:id/contacts`

Add multiple contacts to a group.

**Request Body:**
```json
{
  "contactIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response:** `200 OK`

### Remove Contact from Group

**DELETE** `/groups/:id/contacts/:contactId`

Remove a contact from a group.

**Response:** `204 No Content`

---

## Template Endpoints

### Create Template

**POST** `/templates`

Create a message template.

**Request Body:**
```json
{
  "name": "Welcome Message",
  "text": "Hello {name}, welcome to our service!"
}
```

**Response:** `201 Created`

### List Templates

**GET** `/templates`

Get all templates (users see their own, admins see all).

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "name": "Welcome Message",
    "text": "Hello {name}, welcome to our service!",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]
```

### Update Template

**PUT** `/templates/:id`

Update a template (own templates or admin).

**Request Body:**
```json
{
  "name": "Updated Welcome",
  "text": "Hi {name}, thanks for joining!"
}
```

**Response:** `200 OK`

### Delete Template

**DELETE** `/templates/:id`

Delete a template (own templates or admin).

**Response:** `204 No Content`

---

## Message Endpoints

### Send Message

**POST** `/messages`

Send a message to recipients.

**Request Body:**
```json
{
  "text": "Hello! This is a test message.",
  "templateId": "uuid",
  "recipients": [
    { "phone": "+1234567890" },
    { "contactId": "uuid" }
  ],
  "groupIds": ["uuid1", "uuid2"],
  "scheduledAt": "2025-01-02T10:00:00.000Z"
}
```

**Fields:**
- `text`: Message content (required if no templateId)
- `templateId`: Use template (optional)
- `recipients`: Array of recipients by phone or contactId
- `groupIds`: Array of group IDs to send to
- `scheduledAt`: Schedule for future delivery (ISO 8601)

**Response:** `201 Created`
```json
{
  "message": {
    "id": "uuid",
    "userId": "uuid",
    "text": "Hello! This is a test message.",
    "status": "PROCESSING",
    "createdAt": "2025-01-01T00:00:00.000Z"
  },
  "recipientCount": 150
}
```

### List Messages

**GET** `/messages?status=COMPLETED&page=1&limit=20`

List all messages with filters.

**Query Parameters:**
- `status`: Filter by status (QUEUED, PROCESSING, COMPLETED, FAILED, SCHEDULED)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:** `200 OK`
```json
{
  "messages": [
    {
      "id": "uuid",
      "text": "Hello! This is a test message.",
      "status": "COMPLETED",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "sentAt": "2025-01-01T00:01:00.000Z",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "template": {
        "id": "uuid",
        "name": "Welcome Message"
      },
      "_count": {
        "items": 150
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

### Get Message Details

**GET** `/messages/:id`

Get detailed information about a specific message.

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "text": "Hello! This is a test message.",
  "status": "COMPLETED",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "sentAt": "2025-01-01T00:01:00.000Z",
  "user": { ... },
  "template": { ... },
  "items": [
    {
      "id": "uuid",
      "phone": "+1234567890",
      "status": "DELIVERED",
      "providerId": "waha-msg-123",
      "providerStatus": "delivered",
      "deliveredAt": "2025-01-01T00:02:00.000Z",
      "contact": {
        "id": "uuid",
        "name": "Alice Smith",
        "phone": "+1234567890"
      }
    }
  ],
  "stats": {
    "total": 150,
    "pending": 0,
    "sent": 10,
    "delivered": 135,
    "failed": 5,
    "retrying": 0
  }
}
```

### Get Message Statistics

**GET** `/messages/stats`

Get overall message statistics.

**Response:** `200 OK`
```json
{
  "totalMessages": 25,
  "messagesByStatus": [
    { "status": "COMPLETED", "_count": 20 },
    { "status": "PROCESSING", "_count": 3 },
    { "status": "FAILED", "_count": 2 }
  ],
  "itemsByStatus": [
    { "status": "DELIVERED", "_count": 1500 },
    { "status": "SENT", "_count": 200 },
    { "status": "FAILED", "_count": 50 }
  ]
}
```

---

## Upload Endpoints

### Upload CSV

**POST** `/upload/csv`

Upload and import contacts from CSV file.

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: CSV file (max 10MB)

**CSV Format:**
```csv
name,phone,tags
Alice Smith,+1234567890,"customer,vip"
Bob Johnson,+9876543210,customer
```

**Response:** `200 OK`
```json
{
  "message": "CSV processed",
  "summary": {
    "total": 100,
    "created": 95,
    "skipped": 5,
    "errors": 0
  },
  "contacts": [...],
  "errors": []
}
```

### Validate CSV

**POST** `/upload/validate-csv`

Validate CSV file before uploading.

**Content-Type:** `multipart/form-data`

**Response:** `200 OK`
```json
{
  "totalRows": 100,
  "validRows": 98,
  "preview": [
    {
      "name": "Alice Smith",
      "phone": "+1234567890",
      "tags": "customer,vip"
    }
  ],
  "errors": [
    "Row 5 invalid phone: 12345",
    "Row 10 missing name or phone"
  ],
  "hasMoreErrors": false
}
```

---

## Callback Endpoints

### Waha API Callback

**POST** `/callbacks/waha`

Receive delivery status updates from Waha API.

**Request Body:**
```json
{
  "id": "waha-msg-123",
  "status": "delivered",
  "deliveredAt": "2025-01-01T00:02:00.000Z",
  "error": null
}
```

**Status Values:**
- `sent`: Message sent to provider
- `delivered`: Message delivered to recipient
- `failed`: Delivery failed

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**HTTP Status Codes:**
- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Missing or invalid token
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error

---

## Rate Limiting

API requests are rate-limited:
- **General API**: 100 requests per 15 minutes per IP
- **Waha API**: Configurable per-minute limit (default: 60)

When rate limit is exceeded:

**Response:** `429 Too Many Requests`
```json
{
  "error": "Too many requests from this IP"
}
```

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (1-based)
- `limit`: Items per page

**Response includes:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Message Item Statuses

| Status | Description |
|--------|-------------|
| PENDING | Queued, not yet sent |
| SENT | Sent to Waha API |
| DELIVERED | Confirmed delivered to recipient |
| FAILED | Delivery failed permanently |
| RETRYING | Failed, will retry |

## Message Statuses

| Status | Description |
|--------|-------------|
| QUEUED | In queue, processing will start soon |
| PROCESSING | Currently being processed |
| COMPLETED | All items processed |
| FAILED | All items failed |
| SCHEDULED | Scheduled for future delivery |
