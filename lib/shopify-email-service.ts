// Shopify email service for sending real emails
import type { EmailData } from "./email-data" // Assuming EmailData is declared in a separate file

export async function sendShopifyEmail(emailData: EmailData): Promise<boolean> {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    if (!shopifyDomain || !accessToken) {
      console.error("Shopify credentials not configured")
      return false
    }

    // Create a customer first (if not exists) to send email
    const customerResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-10/customers.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        customer: {
          email: emailData.to,
          first_name: emailData.customerName || "Customer",
          accepts_marketing: true,
          verified_email: false,
        },
      }),
    })

    let customerId
    if (customerResponse.ok) {
      const customerData = await customerResponse.json()
      customerId = customerData.customer.id
    } else {
      // Customer might already exist, try to find them
      const searchResponse = await fetch(
        `https://${shopifyDomain}/admin/api/2023-10/customers/search.json?query=email:${emailData.to}`,
        {
          headers: {
            "X-Shopify-Access-Token": accessToken,
          },
        },
      )

      if (searchResponse.ok) {
        const searchData = await searchResponse.json()
        if (searchData.customers && searchData.customers.length > 0) {
          customerId = searchData.customers[0].id
        }
      }
    }

    if (!customerId) {
      console.error("Could not create or find customer")
      return false
    }

    // Send email using Shopify's notification system
    // Note: This is a simplified approach. In production, you might want to use:
    // 1. Shopify Email app
    // 2. Third-party email service like SendGrid, Mailgun, etc.
    // 3. Shopify Flow for automated emails

    // For now, we'll use a webhook approach or direct email service
    // Let's use a simple email service integration
    return await sendEmailViaService(emailData)
  } catch (error) {
    console.error("Failed to send email via Shopify:", error)
    return false
  }
}

// Alternative: Use a direct email service (recommended for production)
async function sendEmailViaService(emailData: EmailData): Promise<boolean> {
  try {
    // Using a simple email service API (you can replace this with SendGrid, Mailgun, etc.)
    // For demonstration, we'll use a mock service that actually sends emails

    const emailServiceResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "your_service_id", // Replace with your EmailJS service ID
        template_id: "your_template_id", // Replace with your EmailJS template ID
        user_id: "your_user_id", // Replace with your EmailJS user ID
        template_params: {
          to_email: emailData.to,
          subject: emailData.subject,
          html_content: emailData.html,
          from_name: "Grace Season",
          from_email: "noreply@graceseason.com",
        },
      }),
    })

    if (emailServiceResponse.ok) {
      console.log("Email sent successfully to:", emailData.to)
      return true
    } else {
      console.error("Email service error:", await emailServiceResponse.text())
      return false
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Shopify-specific email templates
export function generateShopifyVerificationEmail(name: string, verificationCode: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Grace Season Account</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background-color: #000; 
          color: #fff; 
          margin: 0; 
          padding: 0; 
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          padding: 20px 0;
          border-bottom: 1px solid #333;
        }
        .logo { 
          font-size: 28px; 
          font-weight: bold; 
          color: #fff; 
          text-decoration: none;
        }
        .content { 
          background-color: #111; 
          padding: 40px 30px; 
          border-radius: 8px; 
          border: 1px solid #333;
        }
        .verification-code { 
          background-color: #333; 
          padding: 20px; 
          text-align: center; 
          font-size: 32px; 
          font-weight: bold; 
          letter-spacing: 4px; 
          border-radius: 6px; 
          margin: 30px 0; 
          color: #4ade80;
          border: 2px solid #4ade80;
        }
        .button {
          display: inline-block;
          background-color: #4ade80;
          color: #000;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer { 
          text-align: center; 
          margin-top: 30px; 
          color: #666; 
          font-size: 14px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }
        .warning {
          background-color: #1f2937;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GRACE SEASON</div>
          <p style="margin: 10px 0 0 0; color: #888;">Premium Thrift Fashion</p>
        </div>
        
        <div class="content">
          <h2 style="margin-top: 0;">Welcome to Grace Season, ${name}!</h2>
          <p>Thank you for creating an account with us. You're just one step away from accessing our exclusive collection of premium thrift clothing.</p>
          
          <p><strong>Please verify your email address using the code below:</strong></p>
          
          <div class="verification-code">${verificationCode}</div>
          
          <div class="warning">
            <p style="margin: 0;"><strong>Important:</strong> This verification code will expire in 10 minutes for security reasons.</p>
          </div>
          
          <p>Once verified, you'll be able to:</p>
          <ul style="color: #ccc;">
            <li>Browse our curated thrift collection</li>
            <li>Add items to your wishlist</li>
            <li>Make secure purchases</li>
            <li>Track your orders</li>
          </ul>
          
          <p>If you didn't create an account with us, please ignore this email and your email address will not be added to our system.</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 Grace Season. All rights reserved.</p>
          <p>This email was sent to ${emailData.to}</p>
          <p style="font-size: 12px; color: #555;">
            Grace Season - Fashion & Lifestyle Brand<br>
            If you have any questions, contact us at support@graceseason.com
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function generateOrderConfirmationEmail(
  customerName: string,
  orderNumber: string,
  items: any[],
  total: number,
  shippingAddress: string,
): string {
  const itemsHtml = items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #333;">
      <td style="padding: 15px 0; color: #ccc;">${item.title}</td>
      <td style="padding: 15px 0; text-align: center; color: #ccc;">${item.quantity}</td>
      <td style="padding: 15px 0; text-align: right; color: #fff;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Grace Season</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          background-color: #000; 
          color: #fff; 
          margin: 0; 
          padding: 0; 
        }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; padding: 20px 0; border-bottom: 1px solid #333; }
        .logo { font-size: 28px; font-weight: bold; color: #fff; }
        .content { background-color: #111; padding: 40px 30px; border-radius: 8px; border: 1px solid #333; }
        .order-number { 
          background-color: #333; 
          padding: 15px; 
          text-align: center; 
          font-size: 18px; 
          font-weight: bold; 
          border-radius: 6px; 
          margin: 20px 0; 
          color: #4ade80;
        }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background-color: #333; padding: 15px; text-align: left; color: #fff; }
        .total-row { background-color: #1f2937; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; padding-top: 20px; border-top: 1px solid #333; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">GRACE SEASON</div>
          <p style="margin: 10px 0 0 0; color: #888;">Order Confirmation</p>
        </div>
        
        <div class="content">
          <h2 style="margin-top: 0;">Thank you for your order, ${customerName}!</h2>
          <p>Your order has been confirmed and is being processed. You'll receive a shipping confirmation email once your items are on their way.</p>
          
          <div class="order-number">Order #${orderNumber}</div>
          
          <h3>Order Details:</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr class="total-row">
                <td colspan="2" style="padding: 15px 0; text-align: right; color: #fff;"><strong>Total:</strong></td>
                <td style="padding: 15px 0; text-align: right; color: #fff;"><strong>₹${total.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
          
          <h3>Shipping Address:</h3>
          <div style="background-color: #1f2937; padding: 15px; border-radius: 6px; color: #ccc;">
            ${shippingAddress.replace(/,/g, "<br>")}
          </div>
          
          <p style="margin-top: 30px;">We'll send you a tracking number once your order ships. If you have any questions about your order, please contact our support team.</p>
        </div>
        
        <div class="footer">
          <p>&copy; 2024 Grace Season. All rights reserved.</p>
          <p>Questions? Contact us at support@graceseason.com</p>
        </div>
      </div>
    </body>
    </html>
  `
}
