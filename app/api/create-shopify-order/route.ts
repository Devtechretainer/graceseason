import { NextResponse } from "next/server"
import crypto from "crypto"

// Shopify Admin API credentials
const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_DOMAIN || "akaal-thrifts.myshopify.com"
const SHOPIFY_API_VERSION = "2023-04"
const SHOPIFY_ACCESS_TOKEN = process.env.SHOPIFY_ACCESS_TOKEN || "0f1360c56444fc27811d278bc47dc105"

// Razorpay credentials for verification - using the correct key secret
const RAZORPAY_KEY_SECRET = "QVYTPZf94YXkj3R41f1ETjle"

// Phone number formatting function
function formatPhone(phone: string): string {
  if (!phone) return ""

  // Remove all non-digit characters
  let cleanPhone = phone.replace(/\D/g, "")

  // Remove leading 0 if present
  if (cleanPhone.startsWith("0")) {
    cleanPhone = cleanPhone.slice(1)
  }

  // If it's a 10-digit Indian number, add country code
  if (cleanPhone.length === 10 && !cleanPhone.startsWith("91")) {
    return "+91" + cleanPhone
  }

  // If it already has country code but no +, add it
  if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) {
    return "+" + cleanPhone
  }

  // If it already has + and country code, return as is
  if (cleanPhone.length === 10 || cleanPhone.length === 12) {
    return cleanPhone.startsWith("91") ? "+" + cleanPhone : "+91" + cleanPhone
  }

  // For any other format, try to make it work
  return cleanPhone.length >= 10 ? "+" + cleanPhone : ""
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, address, items, razorpayPaymentId, razorpayOrderId, razorpaySignature } = body

    console.log("Order request received:", { name, phone, address, itemCount: items?.length })
    console.log("Payment verification data:", { razorpayPaymentId, razorpayOrderId, razorpaySignature })

    // Validate required fields
    if (!name || !phone || !address || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
      console.error("Missing required fields:", {
        name: !!name,
        phone: !!phone,
        address: !!address,
        razorpayPaymentId: !!razorpayPaymentId,
        razorpayOrderId: !!razorpayOrderId,
        razorpaySignature: !!razorpaySignature,
      })
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format phone number
    const formattedPhone = formatPhone(phone)
    console.log("Original phone:", phone)
    console.log("Formatted phone:", formattedPhone)

    if (!formattedPhone) {
      console.error("Invalid phone number format:", phone)
      return NextResponse.json({ error: "Invalid phone number format" }, { status: 400 })
    }

    // Verify Razorpay signature
    const body_to_verify = `${razorpayOrderId}|${razorpayPaymentId}`
    console.log("Body to verify:", body_to_verify)

    const generatedSignature = crypto.createHmac("sha256", RAZORPAY_KEY_SECRET).update(body_to_verify).digest("hex")

    console.log("Generated signature:", generatedSignature)
    console.log("Received signature:", razorpaySignature)

    if (generatedSignature !== razorpaySignature) {
      console.error("Signature verification failed")
      console.error("Expected:", generatedSignature)
      console.error("Received:", razorpaySignature)
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 })
    }

    console.log("Payment signature verified successfully")

    // Prepare line items from cart items or use default item
    let lineItems = []

    if (items && items.length > 0) {
      lineItems = items.map((item: any) => ({
        title: item.title || "Thrift Item",
        price: Number.parseFloat(item.price).toFixed(2),
        quantity: item.quantity || 1,
        taxable: false,
      }))
    } else {
      lineItems = [
        {
          title: "Thrift Item",
          price: "5.00",
          quantity: 1,
          taxable: false,
        },
      ]
    }

    console.log("Prepared line items:", lineItems)

    // Calculate total price
    const totalPrice =
      items && items.length > 0
        ? items
            .reduce((total: number, item: any) => total + Number.parseFloat(item.price) * (item.quantity || 1), 0)
            .toFixed(2)
        : "5.00"

    console.log("Calculated total price:", totalPrice)

    // Split name into first and last name
    const nameParts = name.trim().split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // Create order payload
    const orderPayload = {
      order: {
        line_items: lineItems,
        customer: {
          first_name: firstName,
          last_name: lastName,
          phone: formattedPhone,
          email: `customer_${Date.now()}@example.com`, // Generate a unique email
        },
        shipping_address: {
          first_name: firstName,
          last_name: lastName,
          address1: address,
          phone: formattedPhone,
          city: "Unknown",
          province: "Unknown",
          country: "India",
          zip: "000000",
        },
        financial_status: "paid",
        transactions: [
          {
            kind: "sale",
            status: "success",
            amount: totalPrice,
            gateway: "Razorpay",
            payment_details: {
              credit_card_number: "XXXX-XXXX-XXXX-XXXX",
              credit_card_company: "UPI",
            },
          },
        ],
        note: `Razorpay Payment ID: ${razorpayPaymentId}, Order ID: ${razorpayOrderId}`,
        total_price: totalPrice,
        currency: "GHS",
      },
    }

    console.log("Order payload being sent to Shopify:", JSON.stringify(orderPayload, null, 2))

    // Create Shopify order
    const shopifyResponse = await fetch(`https://${SHOPIFY_STORE_URL}/admin/api/${SHOPIFY_API_VERSION}/orders.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify(orderPayload),
    })

    const responseText = await shopifyResponse.text()
    console.log("Shopify API response status:", shopifyResponse.status)
    console.log("Shopify API response:", responseText)

    if (!shopifyResponse.ok) {
      let errorMessage = "Failed to create Shopify order"
      try {
        const errorData = JSON.parse(responseText)
        console.error("Shopify API detailed error:", errorData)
        errorMessage = JSON.stringify(errorData.errors || errorData)
      } catch (e) {
        console.error("Error parsing Shopify error response:", e)
        errorMessage = responseText
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    let shopifyData
    try {
      shopifyData = JSON.parse(responseText)
    } catch (e) {
      console.error("Error parsing Shopify response:", e)
      return NextResponse.json({ error: "Invalid response from Shopify" }, { status: 500 })
    }

    console.log("Order created successfully:", shopifyData.order.id)
    return NextResponse.json({
      success: true,
      orderId: shopifyData.order.id,
      orderNumber: shopifyData.order.order_number,
    })
  } catch (error: any) {
    console.error("Error creating Shopify order:", error.message, error.stack)
    return NextResponse.json({ error: "Internal server error: " + error.message }, { status: 500 })
  }
}
