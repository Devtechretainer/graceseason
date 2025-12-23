"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { getAddressFromPincode, countryCodes, indianStates } from "@/lib/pincode-service"
import { trackBeginCheckout, trackPurchase } from "@/components/google-analytics"
import { useCurrency } from "@/contexts/CurrencyContext"
import { formatPrice } from "@/lib/shopify-utils"

// Define the Razorpay interface
declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart, subtotal } = useCart()
  const { user } = useAuth()
  const { currency, convertPrice } = useCurrency()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderProcessing, setOrderProcessing] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [pincodeLoading, setPincodeLoading] = useState(false)

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }))
    }
  }, [user])

  // Calculate the total amount from cart items
  const calculateTotal = () => {
    return subtotal || 0
  }

  // Check if cart is empty and redirect if needed
  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart")
    }
  }, [items, router, orderSuccess])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const pincode = e.target.value
    setFormData((prev) => ({ ...prev, pincode }))

    if (pincode.length === 6) {
      setPincodeLoading(true)
      try {
        const addressData = await getAddressFromPincode(pincode)
        if (addressData) {
          setFormData((prev) => ({
            ...prev,
            city: addressData.city,
            state: addressData.state,
            country: addressData.country,
          }))
        }
      } catch (error) {
        console.error("Error fetching address from pincode:", error)
      } finally {
        setPincodeLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Track begin checkout event for Google Analytics
    trackBeginCheckout(
      "INR",
      calculateTotal(),
      items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    )

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.pincode ||
      !formData.city ||
      !formData.state
    ) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    // Validate pincode
    if (formData.pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode")
      setLoading(false)
      return
    }

    try {
      // Create Razorpay order
      const orderResponse = await fetch("/api/create-razorpay-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: calculateTotal() || 5, // Use cart total or fallback to ₹5 for testing
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const orderData = await orderResponse.json()

      // Load Razorpay script
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      document.body.appendChild(script)

      script.onload = () => {
        const options = {
          key: "rzp_test_GwaK7wbFhLomVJ",
          amount: orderData.amount,
          currency: "GHS",
          name: "Grace Season",
          description: "Thrift Item Purchase",
          order_id: orderData.id,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.countryCode + formData.phone,
          },
          handler: async (response: any) => {
            try {
              setOrderProcessing(true)
              // Create Shopify order
              const shopifyResponse = await fetch("/api/create-shopify-order", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: formData.name,
                  email: formData.email,
                  phone: formData.countryCode + formData.phone,
                  address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.country} - ${formData.pincode}`,
                  items: items.map((item) => ({
                    title: item.name || "Thrift Item",
                    price: item.price,
                    quantity: item.quantity,
                    id: item.id,
                  })),
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })

              if (!shopifyResponse.ok) {
                const errorData = await shopifyResponse.json()
                throw new Error(errorData.error || "Failed to create order in Shopify")
              }

              // Track purchase event for Google Analytics
              trackPurchase(
                response.razorpay_payment_id,
                calculateTotal(),
                "INR",
                items.map((item) => ({
                  item_id: item.id,
                  item_name: item.name,
                  price: item.price,
                  quantity: item.quantity,
                })),
              )

              // Order created successfully
              setOrderSuccess(true)
              setOrderProcessing(false)

              // Clear the cart after successful order
              clearCart()

              // Show success message and redirect after a delay
              setTimeout(() => {
                router.push("/shop")
              }, 3000)
            } catch (error: any) {
              console.error("Error creating Shopify order:", error)
              setError(error.message || "Failed to create order in Shopify")
              setOrderProcessing(false)
              setLoading(false)
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false)
            },
          },
          theme: {
            color: "#121212",
          },
        }

        const razorpay = new window.Razorpay(options)
        razorpay.open()
      }

      script.onerror = () => {
        setError("Failed to load payment gateway")
        setLoading(false)
      }
    } catch (error: any) {
      console.error("Error:", error)
      setError(error.message || "Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  if (orderSuccess) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-6 bg-zinc-900 text-white border-zinc-800">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
              <p className="mb-6">Thank you for your purchase. You will be redirected shortly.</p>
            </div>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6 bg-zinc-900 text-white border-zinc-800">
          <h1 className="text-2xl mb-6 text-center font-bold">Checkout</h1>

          {error && <div className="bg-red-900/50 border border-red-700 text-white p-3 rounded-md mb-4">{error}</div>}

          {orderProcessing && (
            <div className="bg-zinc-800 p-4 rounded-md mb-4 flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Processing your order...</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="bg-zinc-800 p-4 rounded-md">
                {items.length > 0 ? (
                  <>
                    {items.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex justify-between mb-2">
                        <span>
                          {item.name} ({item.size}) x {item.quantity}
                        </span>
                        <span>{formatPrice(convertPrice(item.price * item.quantity), currency)}</span>
                      </div>
                    ))}
                    <div className="border-t border-zinc-700 my-2 pt-2 font-bold flex justify-between">
                      <span>Total:</span>
                      <span>{formatPrice(convertPrice(calculateTotal()), currency)}</span>
                    </div>
                  </>
                ) : (
                  <p>No items in cart. Total: {formatPrice(convertPrice(5), currency)} (Test)</p>
                )}
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={formData.countryCode}
                      onValueChange={(value) => handleSelectChange("countryCode", value)}
                    >
                      <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code} className="text-white hover:bg-zinc-700">
                            {country.flag} {country.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-zinc-600"
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    required
                    maxLength={6}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Enter 6-digit pincode"
                  />
                  {pincodeLoading && <p className="text-sm text-zinc-400 mt-1">Fetching address details...</p>}
                </div>

                {/* City and State */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state} className="text-white hover:bg-zinc-700">
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Country"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || orderProcessing}
                >
                  {loading ? "Processing..." : `Pay ${formatPrice(convertPrice(calculateTotal()), currency)}`}
                </Button>
              </form>
            </div>
          </div>

          <p className="text-xs text-zinc-400 mt-6 text-center">This is a test payment. You will not be charged.</p>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
