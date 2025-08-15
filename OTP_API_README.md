# OTP API Documentation

This API provides OTP (One-Time Password) functionality for email verification.

## Features

- Send OTP via email (always sends to `utkarshsingh30112002@gmail.com`)
- Verify OTP (currently hardcoded to `8080`)
- Beautiful HTML email template
- Error handling and validation

## Setup

### 1. Environment Configuration

Create a `.env` file in the root directory with the following content:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Server Configuration
PORT=5000

# Email Configuration for OTP
EMAIL_PASSWORD=your_app_password_here
```

### 2. Gmail App Password Setup

To send emails via Gmail, you need to set up an App Password:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Step Verification if not already enabled
3. Go to Security > App passwords
4. Select "Mail" as the app and "Other" as the device
5. Generate the app password
6. Use this password in your `.env` file for `EMAIL_PASSWORD`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### 1. Send OTP

**POST** `/api/otp/send`

Send an OTP to the configured email address.

**Request Body:**
```json
{
  "email": "any@email.com"  // This will be ignored, email always goes to utkarshsingh30112002@gmail.com
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to utkarshsingh30112002@gmail.com",
  "otp": "8080"
}
```

### 2. Verify OTP

**POST** `/api/otp/verify`

Verify the provided OTP.

**Request Body:**
```json
{
  "otp": "8080"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

## Testing

### Using the Test Script

Run the provided test script to test all API endpoints:

```bash
node test/test-otp.js
```

### Using cURL

**Send OTP:**
```bash
curl -X POST http://localhost:5000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

**Verify OTP:**
```bash
curl -X POST http://localhost:5000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"otp": "8080"}'
```

### Using Postman

1. **Send OTP:**
   - Method: POST
   - URL: `http://localhost:5000/api/otp/send`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "email": "test@example.com"
     }
     ```

2. **Verify OTP:**
   - Method: POST
   - URL: `http://localhost:5000/api/otp/verify`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
     ```json
     {
       "otp": "8080"
     }
     ```

## Email Template

The OTP email includes:
- Professional HTML styling
- Clear OTP display (8080)
- Security notice
- Responsive design

## Error Handling

The API includes comprehensive error handling for:
- Missing email parameter
- Missing OTP parameter
- Invalid OTP
- Email sending failures
- Server errors

## Security Notes

- The OTP is currently hardcoded to `8080` for development purposes
- In production, implement proper OTP generation and expiration
- Consider rate limiting for OTP requests
- Use HTTPS in production
- Store OTPs securely (hashed) in a database

## Files Created/Modified

- `routes/otp.js` - OTP API routes
- `config/email.js` - Email configuration
- `server.js` - Added OTP routes
- `test/test-otp.js` - Test script
- `package.json` - Added nodemailer and axios dependencies
