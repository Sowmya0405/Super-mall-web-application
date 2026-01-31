# Super Mall API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication for admin operations. Authentication is done using Basic Auth.

### Admin Login
**POST** `/auth/login`

Request body:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

---

## Shops API

### Get All Shops
**GET** `/shops`

Query parameters:
- `category` (optional): Filter by category ID
- `floor` (optional): Filter by floor ID
- `search` (optional): Search in name and description

Example: `/api/shops?category=1&floor=2&search=fashion`

Response:
```json
[
  {
    "id": 1,
    "name": "Zara",
    "category": 1,
    "floor": 1,
    "shopNumber": "G-101",
    "description": "International fashion retailer",
    "contact": "+91 98765 43210",
    "email": "zara@luxeplaza.com",
    "hours": "10:00 AM - 9:00 PM"
  }
]
```

### Get Shop by ID
**GET** `/shops/:id`

Example: `/api/shops/1`

Response:
```json
{
  "id": 1,
  "name": "Zara",
  "category": 1,
  "floor": 1,
  "shopNumber": "G-101",
  "description": "International fashion retailer",
  "contact": "+91 98765 43210",
  "email": "zara@luxeplaza.com",
  "hours": "10:00 AM - 9:00 PM"
}
```

### Create Shop (Admin)
**POST** `/shops`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Request body:
```json
{
  "name": "New Shop",
  "category": 1,
  "floor": 2,
  "shopNumber": "F1-301",
  "description": "Shop description",
  "contact": "+91 98765 43220",
  "email": "shop@luxeplaza.com",
  "hours": "10:00 AM - 9:00 PM"
}
```

Response:
```json
{
  "id": 11,
  "name": "New Shop",
  "category": 1,
  "floor": 2,
  "shopNumber": "F1-301",
  "description": "Shop description",
  "contact": "+91 98765 43220",
  "email": "shop@luxeplaza.com",
  "hours": "10:00 AM - 9:00 PM"
}
```

### Update Shop (Admin)
**PUT** `/shops/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Request body (all fields optional):
```json
{
  "name": "Updated Shop Name",
  "description": "Updated description"
}
```

### Delete Shop (Admin)
**DELETE** `/shops/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Response:
```json
{
  "success": true,
  "message": "Shop deleted successfully"
}
```

---

## Offers API

### Get All Offers
**GET** `/offers`

Query parameters:
- `shopId` (optional): Filter by shop ID
- `active` (optional): Filter active offers (true/false)

Example: `/api/offers?shopId=1&active=true`

Response:
```json
[
  {
    "id": 1,
    "title": "Summer Sale",
    "shopId": 1,
    "discount": 50,
    "description": "Up to 50% off on all summer collections",
    "validFrom": "2026-01-20",
    "validUntil": "2026-02-28"
  }
]
```

### Get Offer by ID
**GET** `/offers/:id`

### Create Offer (Admin)
**POST** `/offers`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Request body:
```json
{
  "title": "New Year Sale",
  "shopId": 1,
  "discount": 30,
  "description": "30% off on selected items",
  "validFrom": "2026-01-01",
  "validUntil": "2026-01-31"
}
```

### Update Offer (Admin)
**PUT** `/offers/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

### Delete Offer (Admin)
**DELETE** `/offers/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

---

## Categories API

### Get All Categories
**GET** `/categories`

Response:
```json
[
  {
    "id": 1,
    "name": "Fashion & Apparel",
    "description": "Clothing, accessories, and footwear",
    "icon": "👗"
  }
]
```

### Get Category by ID
**GET** `/categories/:id`

### Create Category (Admin)
**POST** `/categories`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Request body:
```json
{
  "name": "New Category",
  "description": "Category description",
  "icon": "🎯"
}
```

### Update Category (Admin)
**PUT** `/categories/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

### Delete Category (Admin)
**DELETE** `/categories/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Note: Cannot delete categories with existing shops.

---

## Floors API

### Get All Floors
**GET** `/floors`

Response:
```json
[
  {
    "id": 1,
    "number": 1,
    "name": "Ground Floor",
    "description": "Fashion & Accessories"
  }
]
```

### Get Floor by ID
**GET** `/floors/:id`

### Create Floor (Admin)
**POST** `/floors`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Request body:
```json
{
  "number": 6,
  "name": "Sixth Floor",
  "description": "Entertainment Zone"
}
```

### Update Floor (Admin)
**PUT** `/floors/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

### Delete Floor (Admin)
**DELETE** `/floors/:id`

Headers:
```
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

Note: Cannot delete floors with existing shops.

---

## Statistics API

### Get Dashboard Statistics
**GET** `/stats`

Response:
```json
{
  "totalShops": 10,
  "totalOffers": 8,
  "activeOffers": 6,
  "totalCategories": 6,
  "totalFloors": 5
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "No authorization header"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Something went wrong!"
}
```

---

## Testing with cURL

### Get all shops
```bash
curl http://localhost:3000/api/shops
```

### Create a shop (with authentication)
```bash
curl -X POST http://localhost:3000/api/shops \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name": "Test Shop",
    "category": 1,
    "floor": 1,
    "shopNumber": "T-100",
    "description": "Test shop description"
  }'
```

### Update a shop
```bash
curl -X PUT http://localhost:3000/api/shops/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" \
  -d '{
    "name": "Updated Shop Name"
  }'
```

### Delete a shop
```bash
curl -X DELETE http://localhost:3000/api/shops/1 \
  -H "Authorization: Basic YWRtaW46YWRtaW4xMjM="
```

---

## Testing with Postman

1. Import the API endpoints into Postman
2. For authenticated requests:
   - Go to Authorization tab
   - Select "Basic Auth"
   - Username: `admin`
   - Password: `admin123`
3. Set Content-Type header to `application/json` for POST/PUT requests

---

## Rate Limiting (Future Enhancement)

Currently not implemented. For production, consider adding:
- Rate limiting per IP
- Rate limiting per user
- Request throttling

## CORS Configuration

The API allows all origins by default (`cors()` middleware). For production:
```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```
