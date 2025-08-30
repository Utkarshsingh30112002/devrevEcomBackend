const express = require("express");
const router = express.Router();
const { UserPayment, Transaction } = require("../models/payments");
const { authenticateMultiRequired } = require("../middleware/multiAuth");
const Order = require("../models/orders");
const OTP = require("../models/otp");
const { transporter } = require("../config/email");

// GET /api/payments/saved-cards/:userId - Get user's saved cards
router.get("/saved-cards/me", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    let userPayment = await UserPayment.findByUserId(userId);

    if (!userPayment) {
      // Create new user payment record if doesn't exist
      userPayment = new UserPayment({ userId: userId, savedCards: [] });
      await userPayment.save();
    }

    // Return masked card numbers for security
    const maskedCards = userPayment.savedCards
      .filter((card) => card.isActive)
      .map((card) => ({
        cardNumber: card.maskedCardNumber,
        cardType: card.cardType,
        cardholderName: card.cardholderName,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        formattedExpiry: card.formattedExpiry,
        isDefault: card.isDefault,
      }));

    res.json({
      success: true,
      data: {
        user_uuid: req.auth.user_uuid,
        savedCards: maskedCards,
        count: maskedCards.length,
        hasDefaultCard: maskedCards.some((card) => card.isDefault),
      },
    });
  } catch (error) {
    console.error("Get saved cards error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching saved cards",
    });
  }
});

// POST /api/payments/saved-cards/:userId - Add new saved card
router.post("/saved-cards/me", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const {
      cardNumber,
      cardType,
      cardholderName,
      expiryMonth,
      expiryYear,
      isDefault = false,
    } = req.body;

    // Validate required fields
    if (
      !cardNumber ||
      !cardType ||
      !cardholderName ||
      !expiryMonth ||
      !expiryYear
    ) {
      return res.status(400).json({
        success: false,
        message: "All card details are required",
      });
    }

    // Normalize card type to lowercase
    const normalizedCardType = cardType.toLowerCase();

    // Validate card number format
    if (!/^\d{4}-\d{4}-\d{4}-\d{4}$/.test(cardNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid card number format. Use XXXX-XXXX-XXXX-XXXX",
      });
    }

    // Validate expiry date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      return res.status(400).json({
        success: false,
        message: "Card has expired",
      });
    }

    let userPayment = await UserPayment.findByUserId(userId);

    if (!userPayment) {
      userPayment = new UserPayment({ userId: userId, savedCards: [] });
    }

    const cardData = {
      cardNumber,
      cardType: normalizedCardType,
      cardholderName,
      expiryMonth: parseInt(expiryMonth),
      expiryYear: parseInt(expiryYear),
      isDefault,
    };

    await userPayment.addCard(cardData);

    res.json({
      success: true,
      message: "Card saved successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        card: {
          cardNumber: cardData.cardNumber.replace(
            /\d{4}-\d{4}-\d{4}-(\d{4})/,
            "****-****-****-$1"
          ),
          cardType: cardData.cardType,
          cardholderName: cardData.cardholderName,
          formattedExpiry: `${cardData.expiryMonth
            .toString()
            .padStart(2, "0")}/${cardData.expiryYear}`,
          isDefault: cardData.isDefault,
        },
        totalCards: userPayment.savedCards.filter((card) => card.isActive)
          .length,
      },
    });
  } catch (error) {
    console.error("Add saved card error:", error);
    res.status(500).json({
      success: false,
      message: "Error saving card",
    });
  }
});

// PUT /api/payments/saved-cards/:userId/default - Set default card
router.put("/saved-cards/me/default", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { cardNumber } = req.body;

    if (!cardNumber) {
      return res.status(400).json({
        success: false,
        message: "Card number is required",
      });
    }

    const userPayment = await UserPayment.findByUserId(userId);
    if (!userPayment) {
      return res.status(404).json({
        success: false,
        message: "No saved cards found",
      });
    }

    await userPayment.setDefaultCard(cardNumber);

    res.json({
      success: true,
      message: "Default card updated successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        defaultCard: userPayment.getDefaultCard()?.maskedCardNumber,
      },
    });
  } catch (error) {
    console.error("Set default card error:", error);
    res.status(500).json({
      success: false,
      message: "Error setting default card",
    });
  }
});

// DELETE /api/payments/saved-cards/:userId/:cardNumber - Remove saved card
router.delete("/saved-cards/me/:cardNumber", authenticateMultiRequired, async (req, res) => {
  try {
    const { cardNumber } = req.params;
    const userId = req.auth?.sub;

    const userPayment = await UserPayment.findByUserId(userId);
    if (!userPayment) {
      return res.status(404).json({
        success: false,
        message: "No saved cards found",
      });
    }

    await userPayment.removeCard(cardNumber);

    res.json({
      success: true,
      message: "Card removed successfully",
      data: {
        user_uuid: req.auth.user_uuid,
        remainingCards: userPayment.savedCards.filter((card) => card.isActive)
          .length,
      },
    });
  } catch (error) {
    console.error("Remove saved card error:", error);
    res.status(500).json({
      success: false,
      message: "Error removing card",
    });
  }
});

// POST /api/payments/send-otp - Send OTP for payment verification
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    await OTP.create({
      email,
      otp,
    });

    // Email configuration for payment OTP
    const mailOptions = {
      from: "utkarshsingh8871@gmail.com",
      to: email,
      subject: "Payment Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">Payment Verification OTP</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px; color: #555;">
              Your OTP for payment verification is:
            </p>
            <h1 style="text-align: center; color: #007bff; font-size: 48px; margin: 20px 0; letter-spacing: 8px;">
              ${otp}
            </h1>
          </div>
          <p style="font-size: 14px; color: #888; text-align: center;">
            If you didn't request this OTP, please ignore this email.
          </p>
        </div>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `Payment verification OTP sent successfully to ${email}`,
    });
  } catch (error) {
    console.error("Error sending payment OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send payment OTP",
      error: error.message,
    });
  }
});

// POST /api/payments/process - Process payment
router.post("/process", authenticateMultiRequired, async (req, res) => {
  try {
    const {
      orderId,
      amount,
      paymentMethod,
      cardNumber,
      cardType,
      cardholderName,
      upiId,
      provider,
      bankName,
      accountNumber,
      saveCard = false,
      otp,
      userEmail, // Add userEmail for OTP verification
    } = req.body;

    const authSub = req.auth?.sub;
    if (!orderId || !authSub || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Order ID, amount, payment method, and auth are required",
      });
    }

    // Simple OTP verification for card payments
    if (paymentMethod === "card" && otp) {
      const otpRecord = await OTP.findOne({
        email: req.body.userEmail,
        otp,
      });

      if (!otpRecord) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP",
        });
      }
    }

    // Validate order exists
    const order = await Order.findByOrderId(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Validate amount matches order
    if (order.totalAmount !== amount) {
      return res.status(400).json({
        success: false,
        message: "Payment amount does not match order amount",
      });
    }

    // Process payment
    const paymentData = {
      orderId,
      userId: authSub,
      amount,
      paymentMethod,
      cardNumber,
      cardType,
      cardholderName,
      upiId,
      provider,
      bankName,
      accountNumber,
    };

    const transaction = await Transaction.processPayment(paymentData);

    // Update order payment status
    await order.updatePaymentStatus(
      transaction.paymentStatus,
      transaction.transactionId
    );

    // Save card if requested and payment successful
    if (saveCard && transaction.paymentStatus === "completed" && cardNumber) {
      let userPayment = await UserPayment.findByUserId(userId);
      if (!userPayment) {
        userPayment = new UserPayment({ userId: userId, savedCards: [] });
      }

      const cardData = {
        cardNumber,
        cardType,
        cardholderName,
        expiryMonth: 12, // Default values for demo
        expiryYear: new Date().getFullYear() + 5,
        isDefault: false,
      };

      await userPayment.addCard(cardData);
    }

    res.json({
      success: true,
      message:
        transaction.paymentStatus === "completed"
          ? "Payment successful"
          : "Payment failed",
      data: {
        transactionId: transaction.transactionId,
        orderId: orderId,
        amount: amount,
        paymentStatus: transaction.paymentStatus,
        gatewayResponse: transaction.gatewayResponse,
        orderStatus: order.orderStatus,
      },
    });
  } catch (error) {
    console.error("Process payment error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing payment",
    });
  }
});

// GET /api/payments/transactions/me - Get my transaction history
router.get("/transactions/me", authenticateMultiRequired, async (req, res) => {
  try {
    const userId = req.auth?.sub;
    const { page = 1, limit = 10, status } = req.query;

    let query = { userId: userId };
    if (status) {
      query.paymentStatus = status;
    }

    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(query);

    // Mask sensitive data
    const maskedTransactions = transactions.map((txn) => ({
      transactionId: txn.transactionId,
      orderId: txn.orderId,
      amount: txn.amount,
      paymentMethod: txn.paymentMethod,
      paymentStatus: txn.paymentStatus,
      cardDetails: txn.cardDetails
        ? {
            cardNumber: txn.cardDetails.cardNumber.replace(
              /\d{4}-\d{4}-\d{4}-(\d{4})/,
              "****-****-****-$1"
            ),
            cardType: txn.cardDetails.cardType,
            cardholderName: txn.cardDetails.cardholderName,
          }
        : undefined,
      upiDetails: txn.upiDetails,
      bankDetails: txn.bankDetails
        ? {
            bankName: txn.bankDetails.bankName,
            accountNumber: `****${txn.bankDetails.accountNumber.slice(-4)}`,
          }
        : undefined,
      gatewayResponse: txn.gatewayResponse,
      refundDetails: txn.refundDetails,
      createdAt: txn.createdAt,
    }));

    res.json({
      success: true,
      data: {
        user_uuid: req.auth.user_uuid,
        transactions: maskedTransactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
    });
  }
});

// GET /api/payments/transaction/:transactionId - Get specific transaction
router.get("/transaction/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({
      transactionId: transactionId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Mask sensitive data
    const maskedTransaction = {
      transactionId: transaction.transactionId,
      orderId: transaction.orderId,
      userId: transaction.userId,
      amount: transaction.amount,
      paymentMethod: transaction.paymentMethod,
      paymentStatus: transaction.paymentStatus,
      cardDetails: transaction.cardDetails
        ? {
            cardNumber: transaction.cardDetails.cardNumber.replace(
              /\d{4}-\d{4}-\d{4}-(\d{4})/,
              "****-****-****-$1"
            ),
            cardType: transaction.cardDetails.cardType,
            cardholderName: transaction.cardDetails.cardholderName,
          }
        : undefined,
      upiDetails: transaction.upiDetails,
      bankDetails: transaction.bankDetails
        ? {
            bankName: transaction.bankDetails.bankName,
            accountNumber: `****${transaction.bankDetails.accountNumber.slice(
              -4
            )}`,
          }
        : undefined,
      gatewayResponse: transaction.gatewayResponse,
      refundDetails: transaction.refundDetails,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    };

    res.json({
      success: true,
      data: maskedTransaction,
    });
  } catch (error) {
    console.error("Get transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transaction",
    });
  }
});

// POST /api/payments/refund/:transactionId - Process refund
router.post("/refund/:transactionId", async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { refundAmount, reason } = req.body;

    const transaction = await Transaction.findOne({
      transactionId: transactionId,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    if (transaction.paymentStatus !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Only completed transactions can be refunded",
      });
    }

    await transaction.processRefund(refundAmount, reason);

    // Update order status if full refund
    if (!refundAmount || refundAmount >= transaction.amount) {
      const order = await Order.findByOrderId(transaction.orderId);
      if (order) {
        await order.updateStatus("refunded");
      }
    }

    res.json({
      success: true,
      message: "Refund processed successfully",
      data: {
        transactionId: transaction.transactionId,
        refundAmount: transaction.refundDetails.refundAmount,
        refundReason: transaction.refundDetails.refundReason,
        refundDate: transaction.refundDetails.refundDate,
        paymentStatus: transaction.paymentStatus,
      },
    });
  } catch (error) {
    console.error("Process refund error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing refund",
    });
  }
});

// GET /api/payments/refunds/:orderId - Track refund status for an order
router.get("/refunds/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const txns = await Transaction.find({ orderId }).sort({ createdAt: -1 });
    if (!txns || txns.length === 0) {
      return res.status(404).json({ success: false, message: "No transactions for this order" });
    }
    // Find latest refunded or the most recent payment
    const refunded = txns.find((t) => t.paymentStatus === "refunded");
    const latest = txns[0];
    return res.json({
      success: true,
      data: {
        orderId,
        refundStatus: refunded ? "refunded" : latest.paymentStatus,
        expectedCreditDate: refunded ? refunded.refundDetails?.refundDate : undefined,
        transactions: txns.map((t) => ({
          transactionId: t.transactionId,
          paymentStatus: t.paymentStatus,
          amount: t.amount,
          refundDetails: t.refundDetails,
          createdAt: t.createdAt,
        })),
      },
    });
  } catch (error) {
    console.error("Track refund status error:", error);
    return res.status(500).json({ success: false, message: "Error fetching refund status" });
  }
});

// GET /api/payments/methods - Get available payment methods
router.get("/methods", async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: "card",
        name: "Credit/Debit Card",
        description: "Pay using credit or debit card",
        icon: "💳",
        isAvailable: true,
      },
      {
        id: "upi",
        name: "UPI",
        description: "Pay using UPI ID",
        icon: "📱",
        isAvailable: true,
      },
      {
        id: "netbanking",
        name: "Net Banking",
        description: "Pay using net banking",
        icon: "🏦",
        isAvailable: true,
      },
      {
        id: "cod",
        name: "Cash on Delivery",
        description: "Pay when you receive your order",
        icon: "💰",
        isAvailable: true,
      },
    ];

    res.json({
      success: true,
      data: {
        paymentMethods: paymentMethods,
        count: paymentMethods.length,
      },
    });
  } catch (error) {
    console.error("Get payment methods error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment methods",
    });
  }
});

module.exports = router;
