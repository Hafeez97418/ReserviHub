const optMailHTML = (otp:number) => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification - ReserviHub</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #000;
      margin: 0;
      padding: 0;
      color: #fff;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #1e1e2f;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      color: #fff;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #a855f7;
    }
    .content {
      margin: 20px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #fff;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #a855f7;
      background: #fff;
      padding: 10px;
      display: inline-block;
      border-radius: 5px;
    }
    .footer {
      margin-top: 20px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">ReserviHub</div>
    <div class="content">
      <h2>Verify Your Email Address</h2>
      <p>Thank you for signing up with ReserviHub! Please use the OTP below to verify your email address.</p>
      <div class="otp">${otp}</div>
      <p>This OTP is valid for only 10 minutes. Do not share it with anyone.</p>
    </div>
    <div class="footer">
      <p>If you didn’t request this, please ignore this email.</p>
      <p>&copy; 2025 ReserviHub. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
}

export default optMailHTML;