# Ecommerce Backend API

A RESTful API for an ecommerce application built with Express.js, Node.js, and MongoDB.

## Features

- Product management (CRUD operations)
- Flexible product schema with dynamic specs
- Category-based filtering (laptop, mouse)
- Search and filtering capabilities
- Stock management
- Security middleware (Helmet, CORS, Rate limiting)
- Cookie/JWT auth with multi-auth (JWT or DevRev PAT + user_uuid)
- Orders, returns/exchanges, refunds tracking

## Project Structure

```
ecommerce/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── products.js          # Product schema
│   ├── users.js             # User schema
│   └── reviews.js           # Review schema
├── routes/
│   ├── products.js          # Product routes
│   ├── users.js             # User routes
│   └── reviews.js           # Review routes
├── test/
│   ├── sample-data.js       # Product sample data
│   ├── dummy-users.js       # User sample data
│   └── sample-reviews.js    # Review sample data
├── server.js                # Main server file
├── package.json             # Dependencies
└── README.md               # This file
```

## Database Schemas

### Product Schema
The product schema includes:

- **Common Fields**: productId, name, description, price, brand, imageUrl, stock, category
- **Product ID**: Unique identifier for each product
- **Description**: Detailed product description
- **Category**: Restricted to 'laptop' or 'mouse'
- **Specs**: Flexible Map field for unique product attributes
- **FAQ**: Array of question-answer pairs for each product
- **Timestamps**: Automatic createdAt and updatedAt fields

### User Schema
The user schema includes:

- **Basic Info**: username, email, password, firstName, lastName
- **Contact**: phone, addresses[] { street, area, city, state, pincode, country, isDefault, addressType }
- **Status**: isActive, role (user/admin), emailVerified
- **Profile**: profileImage, dateOfBirth, lastLogin
- **user_uuid (immutable)**: stable external reference (auto-generated for new users; fixed for seeded users)
- **Timestamps**: Automatic createdAt and updatedAt fields

### Review Schema
The review schema includes:

- **Content**: title, content, rating (1-5)
- **References**: user (ObjectId), product (ObjectId)
- **Status**: isVerified, isHelpful, isNotHelpful
- **Additional**: images, tags
- **Validation**: One review per user per product
- **Timestamps**: Automatic createdAt and updatedAt fields

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   NODE_ENV=development
   JWT_SECRET=dev-secret
   DEVREV_PAT=your_devrev_pat_for_auth_tokens_create
   DEVREV_AGENT_PAT=your_shared_agent_pat_for_backend_calls
   ```

3. **Start MongoDB**:
   Make sure MongoDB is running on your system.

4. **Seed the database**:
   ```bash
   # Seed all data (users, products, reviews)
   npm run seed:all
   
   # Or seed individually
   npm run seed:users    # Seed users only
   npm run seed          # Seed products only
   npm run seed:reviews  # Seed reviews only
   ```

5. **Run the server**:
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Auth

- `POST /api/auth/login` – login via username/email + password; sets HttpOnly cookie `auth_token`
- `POST /api/auth/devrev-token` – exchange our auth for DevRev token
  - Multi-auth: accepts JWT cookie/header OR `Authorization: Bearer <DEVREV_AGENT_PAT>` with `user_uuid` in query/body

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/productId/:productId` - Get product by productId
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `PATCH /api/products/:id/stock` - Update product stock

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/username/:username` - Get user by username
- `GET /api/users/email/:email` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user (note: `user_uuid` is immutable)
- `DELETE /api/users/:id` - Delete user

### Reviews
### Addresses (me)

- `GET /api/addresses/me` – list my addresses
- `POST /api/addresses/me` – add address
- `PUT /api/addresses/me/:addressIndex` – update address
- `DELETE /api/addresses/me/:addressIndex` – delete address
- `PUT /api/addresses/me/:addressIndex/default` – set default
- `GET /api/addresses/me/default` – get default
  - Requires auth (JWT or DevRev PAT + user_uuid). Responses include `user_uuid`.

### Cart (me)

- `GET /api/cart/me` – get my cart
- `POST /api/cart/me/add` – add item `{ productId, quantity }`
- `PUT /api/cart/me/update` – update quantity `{ productId, quantity }`
- `DELETE /api/cart/me/remove/:productId` – remove item
- `DELETE /api/cart/me/clear` – clear cart
- `GET /api/cart/me/count` – item counts
  - Requires auth (JWT or DevRev PAT + user_uuid). Responses include `user_uuid`.

### Orders

- `POST /api/orders/create` – create order from cart using body `{ deliveryAddressIndex, deliveryType, paymentMethod, notes }`
- `POST /api/orders/status/:orderId` – get order status (uses auth or `userId` fallback)
- `PUT /api/orders/:orderId/address` – update delivery address within 24h and before shipping; body `{ addressIndex }`
- `DELETE /api/orders/:orderId` – cancel order; supports partial via body `{ itemIds: [] }`
- `GET /api/orders/user` – list my orders (lightweight summaries)
  - Query `include=items_preview,returns,refunds` to enrich response

### Returns & Exchanges

- `POST /api/orders/:orderId/return` – create return request (within 3 days from deliveredAt) `{ itemIds, reason, pickupDate }`
- `POST /api/orders/:orderId/exchange` – create exchange request (within 3 days) `{ itemIds, reason, pickupDate }`
- `POST /api/returns` – alternative create (refund/exchange) with `{ orderId, itemIds, reason_code, return_type, pickupDate }`
- `POST /api/returns/:returnId/schedule-pickup` – mock pickup scheduling `{ preferred_date, preferred_time }`

### Payments

- `POST /api/payments/process` – process payment for an order
- `GET /api/payments/saved-cards/me` – list my saved cards
- `POST /api/payments/saved-cards/me` – add saved card
- `PUT /api/payments/saved-cards/me/default` – set default card
- `DELETE /api/payments/saved-cards/me/:cardNumber` – remove saved card
- `GET /api/payments/transactions/me` – my transactions
- `GET /api/payments/refunds/:orderId` – refund status for an order

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get review by ID
- `GET /api/reviews/product/:productId` - Get reviews by product
- `GET /api/reviews/user/:userId` - Get reviews by user
- `GET /api/reviews/product/:productId/average` - Get average rating for product
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `PATCH /api/reviews/:id/helpful` - Mark review as helpful/not helpful

### Query Parameters

#### GET /api/products
- `category` - Filter by category (laptop, mouse)
- `brand` - Filter by brand name
- `productId` - Filter by product ID
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `inStock` - Filter products in stock (true/false)
- `search` - Search in name, description, or productId

#### GET /api/reviews
- `product` - Filter by product ID
- `user` - Filter by user ID
- `rating` - Filter by rating (1-5)
- `isVerified` - Filter verified reviews (true/false)

## Example Usage
### Auth + Multi-auth
```
# Login (sets HttpOnly cookie)
curl -i -X POST http://localhost:5000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"abhinav.chintala2@gmail.com","password":"hashedPassword123"}'

# DevRev agent call (backend-to-backend)
curl -X POST 'http://localhost:5000/api/orders/status/ORD123' \
  -H 'Authorization: Bearer ${DEVREV_AGENT_PAT}' \
  -H 'Content-Type: application/json' \
  -d '{"user_uuid":"<stable-uuid>"}'
```

### Update users by password (maintenance)
```
# Dry-run
npm run users:update-by-password -- /abs/path/updates.json --dry-run
# Apply
npm run users:update-by-password -- /abs/path/updates.json
```

### Create a Laptop Product
```json
POST /api/products
{
  "productId": "P100",
  "name": "MSI Model 100",
  "description": "High-performance gaming laptop with Ryzen 7 processor and 1TB SSD",
  "price": 93885,
  "brand": "MSI",
  "imageUrl": "https://example.com/msi-model-100.jpg",
  "stock": 5,
  "category": "laptop",
  "specs": {
    "ram": "8GB",
    "storage": "1TB SSD",
    "processor": "Ryzen 7",
    "battery": "6h",
    "display": "15.6\" FHD",
    "backlitKeyboard": "Yes"
  }
}
```

### Create a Mouse Product
```json
POST /api/products
{
  "productId": "M001",
  "name": "Logitech MX200",
  "description": "High-performance wireless mouse with ergonomic design and long battery life",
  "price": 2999,
  "brand": "Logitech",
  "imageUrl": "https://example.com/logitech-mx200.jpg",
  "stock": 15,
  "category": "mouse",
  "specs": {
    "dpi": "1600",
    "connectivity": "Wireless",
    "sensorType": "Optical",
    "weight": "100g",
    "batteryLife": "12 months",
    "wireless": "Yes"
  }
}
```

## Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Express Rate Limit** - Rate limiting
- **Dotenv** - Environment variables

## License

ISC
