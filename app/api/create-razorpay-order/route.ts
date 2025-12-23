import { NextResponse } from "next/server"

// Razorpay test credentials
const KEY_ID = "rzp_test_GwaK7wbFhLomVJ"
const KEY_SECRET = "QVYTPZf94YXkj3R41f1ETjle"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { amount } = body

    console.log("Creating Razorpay order for amount:", amount)

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Valid amount is required" }, { status: 400 })
    }

    // Convert amount to pesewas (GHS smallest currency unit - 100 pesewas = 1 GHS)
    const amountInPesewas = Math.round(amount * 100)

    console.log("Amount in pesewas:", amountInPesewas)

    // Create the authorization header
    const authString = `${KEY_ID}:${KEY_SECRET}`
    const authHeader = `Basic ${Buffer.from(authString).toString("base64")}`

    // Prepare the order data
    const orderData = {
      amount: amountInPesewas,
      currency: "GHS",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    }

    console.log("Creating order with data:", orderData)

    // Create Razorpay order with timeout and better error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
          "User-Agent": "Grace-Season/1.0",
        },
        body: JSON.stringify(orderData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const responseText = await response.text()
      console.log("Razorpay API response status:", response.status)

      if (!response.ok) {
        let errorMessage = "Failed to create order"
        try {
          const errorData = JSON.parse(responseText)
          console.error("Razorpay API error:", errorData)
          errorMessage = errorData.error?.description || `HTTP ${response.status}: ${response.statusText}`
        } catch (e) {
          console.error("Error parsing Razorpay error response:", e)
          errorMessage = `HTTP ${response.status}: ${responseText}`
        }
        return NextResponse.json({ error: errorMessage }, { status: response.status })
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log("Razorpay order created successfully:", data.id)
      } catch (e) {
        console.error("Error parsing Razorpay response:", e)
        return NextResponse.json({ error: "Invalid response from Razorpay" }, { status: 500 })
      }

      return NextResponse.json(data)
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === "AbortError") {
        console.error("Razorpay API request timeout")
        return NextResponse.json({ error: "Request timeout - please try again" }, { status: 408 })
      }

      console.error("Network error calling Razorpay API:", fetchError)
      return NextResponse.json(
        {
          error: "Network error - please check your connection and try again",
        },
        { status: 503 },
      )
    }
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error.message, error.stack)
    return NextResponse.json(
      {
        error: "Internal server error: " + error.message,
      },
      { status: 500 },
    )
  }
}
