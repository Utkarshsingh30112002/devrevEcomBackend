# Random OTP Generation and Verification System

This system implements a secure, random OTP (One-Time Password) generation and verification system with database storage, expiration, and rate limiting.

## 🚀 Features

- **Random 6-digit OTP generation** - No more fixed "8080" OTP
- **Database storage** - OTPs are stored in MongoDB with expiration
- **Automatic expiration** - OTPs expire after 10 minutes
- **Rate limiting** - Max 3 OTP requests per email in 10 minutes
- **Attempt tracking** - Tracks failed verification attempts
- **Security features** - OTPs are marked as used after successful verification
- **TTL index** - MongoDB automatically deletes expired OTPs

## 📁 Files Structure

```
├── models/otp.js              # OTP database model
├── routes/otp.js              # OTP API routes
├── test/test-random-otp.js    # Test script
└── RANDOM_OTP_README.md       # This file
```

## 🔧 API Endpoints

### 1. Send OTP
**POST** `/api/otp/send`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully to user@example.com",
  "expiresIn": "10 minutes"
}
```

### 2. Verify OTP
**POST** `/api/otp/verify`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### 3. Check OTP Status
**GET** `/api/otp/status/:email`

**Response:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "isExpired": false,
    "isUsed": false,
    "attempts": 0,
    "timeLeft": 540,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "expiresAt": "2024-01-15T10:40:00.000Z"
  }
}
```

### 4. Reset OTP Attempts
**DELETE** `/api/otp/reset/:email`

**Response:**
```json
{
  "success": true,
  "message": "OTP attempts reset successfully"
}
```

## 🗄️ Database Schema

### OTP Model
```javascript
{
  email: String,        // User's email address
  otp: String,          // 6-digit OTP
  expiresAt: Date,      // Expiration timestamp
  isUsed: Boolean,      // Whether OTP has been used
  attempts: Number,     // Failed verification attempts
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

## 🔒 Security Features

1. **Random Generation**: Each OTP is a random 6-digit number
2. **Expiration**: OTPs automatically expire after 10 minutes
3. **Single Use**: OTPs are marked as used after successful verification
4. **Rate Limiting**: Max 3 OTP requests per email in 10 minutes
5. **Attempt Tracking**: Tracks failed attempts and blocks after 3 failures
6. **TTL Index**: MongoDB automatically cleans up expired OTPs

## 🧪 Testing

Run the test script to verify the system:

```bash
node test/test-random-otp.js
```

The test script will:
1. Send an OTP
2. Check OTP status
3. Test with wrong OTP
4. Test rate limiting
5. Reset attempts

## 📋 Usage Example

### Step 1: Send OTP
```bash
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Step 2: Check Email
Check your email for the 6-digit OTP (e.g., "123456")

### Step 3: Verify OTP
```bash
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "otp": "123456"}'
```

### Step 4: Check Status (Optional)
```bash
curl http://localhost:3000/api/otp/status/user@example.com
```

## ⚙️ Configuration

### Environment Variables
Make sure you have these in your `.env` file:
```
EMAIL_PASSWORD=your_gmail_app_password
MONGODB_URI=your_mongodb_connection_string
```

### Email Configuration
The system uses Gmail SMTP. Update the sender email in `routes/otp.js`:
```javascript
from: "your-email@gmail.com"
```

## 🚨 Error Handling

### Common Error Responses

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many OTP requests. Please wait 10 minutes before requesting another OTP."
}
```

**Invalid OTP:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Too Many Attempts:**
```json
{
  "success": false,
  "message": "Too many failed attempts. Please request a new OTP."
}
```

## 🔄 Migration from Fixed OTP

The system automatically replaces the old fixed "8080" OTP with random generation. No additional setup required - just restart your server and the new system will be active.

## 📊 Monitoring

You can monitor OTP usage by checking the database:
```javascript
// Get all OTPs for an email
const otps = await OTP.find({ email: "user@example.com" });

// Get expired OTPs
const expiredOtps = await OTP.find({ expiresAt: { $lt: new Date() } });

// Get used OTPs
const usedOtps = await OTP.find({ isUsed: true });
```

## 🛡️ Best Practices

1. **Never log OTPs** - They should only be sent via email
2. **Use HTTPS** - Always use HTTPS in production
3. **Monitor rate limits** - Watch for abuse patterns
4. **Regular cleanup** - MongoDB TTL index handles this automatically
5. **Secure email** - Use app passwords for Gmail

## 🔧 Customization

### Change OTP Length
Update the `generateOTP()` function in `routes/otp.js`:
```javascript
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
  // For 4 digits: return Math.floor(1000 + Math.random() * 9000).toString();
};
```

### Change Expiration Time
Update the expiration calculation:
```javascript
const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
// For 5 minutes: new Date(Date.now() + 5 * 60 * 1000)
```

### Change Rate Limits
Update the rate limit check:
```javascript
return recentOTPs < 3; // Allow max 3 OTP requests in 10 minutes
```

## 🎯 Summary

This random OTP system provides:
- ✅ **Security**: Random generation, expiration, single-use
- ✅ **User Experience**: Clear error messages, status checking
- ✅ **Scalability**: Database storage, automatic cleanup
- ✅ **Monitoring**: Status endpoints, attempt tracking
- ✅ **Flexibility**: Easy to customize and extend

The system is production-ready and includes comprehensive error handling, rate limiting, and security features.

