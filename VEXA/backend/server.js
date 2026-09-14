const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send OTP
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await transporter.sendMail({
      from: `"VEXA 💌" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "💌 VEXA ne tumhare liye kuch bheja hai 👀",

      html: `
    <div style="
      background:#060912;
      padding:40px 20px;
      font-family:Arial,sans-serif;
      color:#EEF0FF;
      text-align:center;
    ">

      <h1 style="color:#A855F7;">
        Hey cutie 👀❤️
      </h1>

      <p style="font-size:16px;color:#8892B0;">
        VEXA ne tumhare liye ek secret code bheja hai:
      </p>

      <div style="
        display:inline-block;
        background:#0D1220;
        border:1px solid #7C3AED;
        border-radius:16px;
        padding:20px 35px;
        margin:20px 0;
      ">
        <div style="
          color:#8892B0;
          font-size:12px;
          margin-bottom:8px;
        ">
          YOUR OTP
        </div>

        <div style="
          color:#A855F7;
          font-size:32px;
          font-weight:bold;
          letter-spacing:8px;
        ">
          ${otp}
        </div>
      </div>

      <p style="color:#8892B0;">
        ⏳ 5 minutes tak valid hai...
      </p>

      <p style="color:#EEF0FF;font-size:15px;">
        Bilkul meri feelings ki tarah,<br>
        bas thodi zyada urgent hain 😂
      </p>

      <p style="color:#EEF0FF;">
        Code enter karo aur VEXA mein entry le lo. 💜
      </p>

      <p style="color:#8892B0;">
        OTP share mat karna...
      </p>

      <p style="color:#A855F7;font-weight:bold;">
        Dil chalega, OTP nahi. 😭❤️
      </p>

      <p style="color:#8892B0;margin-top:30px;">
        — Team VEXA 💌
      </p>

    </div>
  `,
    });

    console.log(`OTP sent to ${email}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Email Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore.get(email);

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP not found or expired",
    });
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);

    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  otpStore.delete(email);

  res.json({
    success: true,
    message: "Email verified successfully",
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "VEXA Backend is running 🚀",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VEXA Backend running on port ${PORT}`);
});
