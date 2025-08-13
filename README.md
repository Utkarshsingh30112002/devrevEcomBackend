# Ecommerce Backend API

A RESTful API for an ecommerce application built with Express.js, Node.js, and MongoDB.

## Features

- Product management (CRUD operations)
- Flexible product schema with dynamic specs
- Category-based filtering (laptop, mouse)
- Search and filtering capabilities
- Stock management
- Security middleware (Helmet, CORS, Rate limiting)

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
- **Contact**: phone, address (street, city, state, zipCode, country)
- **Status**: isActive, role (user/admin), emailVerified
- **Profile**: profileImage, dateOfBirth, lastLogin
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
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Reviews

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
