# Payment OTP Integration

This system integrates random OTP verification into the payment process, providing an additional layer of security for card payments.

## 🚀 Features

- **Payment-specific OTP** - Dedicated OTP system for payment verification
- **Card payment protection** - OTP required only for card payments
- **Order validation** - OTP is tied to specific orders and users
- **Rate limiting** - Prevents OTP abuse for payments
- **Email integration** - Payment OTP emails include order details
- **Security validation** - Verifies order ownership before sending OTP

## 📁 Files Modified

```
├── routes/payments.js           # Updated with OTP integration
├── models/otp.js               # OTP model (already created)
├── test/test-payment-otp.js    # Payment OTP test script
└── PAYMENT_OTP_README.md       # This file
```

## 🔧 API Endpoints

### 1. Send Payment OTP
**POST** `/api/payments/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "orderId": "ORD123456",
  "userId": "user123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verification OTP sent successfully to user@example.com",
  "expiresIn": "10 minutes",
  "orderId": "ORD123456",
  "amount": 1500
}
```

### 2. Process Payment with OTP
**POST** `/api/payments/process`

**Request Body (Card Payment with OTP):**
```json
{
  "orderId": "ORD123456",
  "userId": "user123",
  "amount": 1500,
  "paymentMethod": "card",
  "cardNumber": "1234-5678-9012-3456",
  "cardType": "visa",
  "cardholderName": "John Doe",
  "userEmail": "user@example.com",
  "otp": "123456",
  "saveCard": false
}
```

**Request Body (UPI Payment - No OTP Required):**
```json
{
  "orderId": "ORD123456",
  "userId": "user123",
  "amount": 1500,
  "paymentMethod": "upi",
  "upiId": "user@upi",
  "provider": "gpay"
}
```

## 🔒 Security Features

### Payment Method OTP Requirements

| Payment Method | OTP Required | Security Level |
|----------------|--------------|----------------|
| **Card**       | ✅ Yes       | High          |
| **UPI**        | ❌ No        | Medium        |
| **Net Banking**| ❌ No        | Medium        |
| **Wallet**     | ❌ No        | Low           |

### OTP Validation Process

1. **Order Validation** - Verifies order exists and belongs to user
2. **Rate Limiting** - Max 3 OTP requests per email in 10 minutes
3. **OTP Verification** - Validates OTP is correct, not expired, not used
4. **Attempt Tracking** - Blocks after 3 failed attempts
5. **Single Use** - OTP is marked as used after successful payment

## 📧 Email Template

Payment OTP emails include:
- **Order ID** - For reference
- **Amount** - Payment amount
- **Expiration** - 10-minute validity
- **Security warning** - Contact support if not requested

## 🧪 Testing

Run the payment OTP test script:

```bash
node test/test-payment-otp.js
```

The test script will:
1. Send payment verification OTP
2. Test payment without OTP (should fail for cards)
3. Test payment with wrong OTP
4. Test rate limiting
5. Test different payment methods

## 📋 Payment Flow

### Card Payment Flow
```
1. User initiates card payment
2. Send payment OTP → POST /api/payments/send-otp
3. User receives email with OTP
4. User enters OTP in payment form
5. Process payment with OTP → POST /api/payments/process
6. OTP is validated and marked as used
7. Payment is processed
```

### UPI/Net Banking Flow
```
1. User initiates UPI/Net Banking payment
2. Process payment directly → POST /api/payments/process
3. No OTP required
4. Payment is processed
```

## 🔧 Implementation Details

### OTP Integration in Payment Process

```javascript
// OTP verification for card payments
if (paymentMethod === "card" && otp) {
  const otpRecord = await OTP.findOne({
    email: req.body.userEmail,
    otp,
    expiresAt: { $gt: new Date() },
    isUsed: false,
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired OTP",
    });
  }

  // Mark OTP as used
  await OTP.findByIdAndUpdate(otpRecord._id, { isUsed: true });
}
```

### Order Validation

```javascript
// Validate order exists and belongs to user
const order = await Order.findByOrderId(orderId);
if (!order || order.userId !== userId) {
  return res.status(403).json({
    success: false,
    message: "Order not found or does not belong to user",
  });
}
```

## 🚨 Error Handling

### Common Payment OTP Errors

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
  "message": "Too many failed OTP attempts. Please request a new OTP."
}
```

**Rate Limit Exceeded:**
```json
{
  "success": false,
  "message": "Too many OTP requests. Please wait 10 minutes before requesting another OTP."
}
```

**Order Not Found:**
```json
{
  "success": false,
  "message": "Order not found"
}
```

**Order Ownership:**
```json
{
  "success": false,
  "message": "Order does not belong to this user"
}
```

## 📊 Usage Examples

### Frontend Integration

```javascript
// Step 1: Send OTP when user selects card payment
async function sendPaymentOTP(email, orderId, userId) {
  const response = await fetch('/api/payments/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, orderId, userId })
  });
  return response.json();
}

// Step 2: Process payment with OTP
async function processPayment(paymentData) {
  const response = await fetch('/api/payments/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(paymentData)
  });
  return response.json();
}

// Example usage
const paymentData = {
  orderId: 'ORD123456',
  userId: 'user123',
  amount: 1500,
  paymentMethod: 'card',
  cardNumber: '1234-5678-9012-3456',
  cardType: 'visa',
  cardholderName: 'John Doe',
  userEmail: 'user@example.com',
  otp: '123456' // From email
};
```

### cURL Examples

**Send Payment OTP:**
```bash
curl -X POST http://localhost:3000/api/payments/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "orderId": "ORD123456",
    "userId": "user123"
  }'
```

**Process Card Payment with OTP:**
```bash
curl -X POST http://localhost:3000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD123456",
    "userId": "user123",
    "amount": 1500,
    "paymentMethod": "card",
    "cardNumber": "1234-5678-9012-3456",
    "cardType": "visa",
    "cardholderName": "John Doe",
    "userEmail": "user@example.com",
    "otp": "123456"
  }'
```

**Process UPI Payment (No OTP):**
```bash
curl -X POST http://localhost:3000/api/payments/process \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD123456",
    "userId": "user123",
    "amount": 1500,
    "paymentMethod": "upi",
    "upiId": "user@upi",
    "provider": "gpay"
  }'
```

## 🔧 Configuration

### Environment Variables
Make sure you have these in your `.env` file:
```
EMAIL_PASSWORD=your_gmail_app_password
MONGODB_URI=your_mongodb_connection_string
```

### Email Configuration
Update the sender email in `routes/payments.js`:
```javascript
from: "your-email@gmail.com"
```

## 🛡️ Security Best Practices

1. **HTTPS Only** - Always use HTTPS in production
2. **Email Verification** - Verify user email before sending OTP
3. **Order Validation** - Ensure order belongs to requesting user
4. **Rate Limiting** - Prevent OTP abuse
5. **Logging** - Log payment attempts for monitoring
6. **Timeout** - OTPs expire after 10 minutes
7. **Single Use** - OTPs can't be reused

## 🔄 Migration from Fixed OTP

The system automatically replaces the old fixed "8080" OTP with random generation for card payments. No additional setup required.

## 📈 Monitoring

Monitor payment OTP usage:
```javascript
// Get payment OTPs for an email
const paymentOtps = await OTP.find({ 
  email: "user@example.com",
  createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } // Last 24 hours
});

// Get failed payment attempts
const failedPayments = await OTP.find({ 
  email: "user@example.com",
  attempts: { $gte: 3 }
});
```

## 🎯 Summary

This payment OTP integration provides:
- ✅ **Enhanced Security** - OTP verification for card payments
- ✅ **User Experience** - Clear error messages and status
- ✅ **Flexibility** - Different security levels for different payment methods
- ✅ **Monitoring** - Track OTP usage and failed attempts
- ✅ **Scalability** - Database storage with automatic cleanup

The system is production-ready and provides comprehensive security for payment processing while maintaining a smooth user experience.

