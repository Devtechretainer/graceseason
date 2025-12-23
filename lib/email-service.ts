// Email service for sending verification emails
export interface EmailData {
  to: string
  subject: string
  html: string
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    // In a real application, you would use a service like SendGrid, Nodemailer, or Resend
    // For now, we'll simulate sending an email
    console.log("Sending email to:", emailData.to)
    console.log("Subject:", emailData.subject)
    console.log("HTML content:", emailData.html)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return true
  } catch (error) {
    console.error("Failed to send email:", error)
    return false
  }
}

export function generateVerificationEmail(name: string, verificationCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #000; color: #fff; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #fff; }
        .content { background-color: #111; padding: 30px; border-radius: 8px; }
        .verification-code { 
          background-color: #333; 
          padding: 15px; 
          text-align: center; 
          font-size: 24px; 
          font-weight: bold; 
          letter-spacing: 3px; 
          border-radius: 4px; 
          margin: 20px 0; 
        }
        .footer { text-align: center; margin-top: 30px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Grace Season</div>
        </div>
        <div class="content">
          <h2>Welcome to Grace Season, ${name}!</h2>
          <p>Thank you for creating an account with us. To complete your registration, please verify your email address using the code below:</p>
          
          <div class="verification-code">${verificationCode}</div>
          
          <p>This verification code will expire in 10 minutes.</p>
          <p>If you didn't create an account with us, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Grace Season. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
