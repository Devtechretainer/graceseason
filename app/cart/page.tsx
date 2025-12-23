"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { formatPrice } from "@/lib/shopify-utils"
import { useRouter } from "next/navigation"
import { useCurrency } from "@/contexts/CurrencyContext"

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart()
  const { currency, convertPrice } = useCurrency()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const router = useRouter()

  const handleCheckout = () => {
    setIsCheckingOut(true)
    router.push("/checkout")
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <div className="bg-secondary/50 rounded-lg p-8 mb-8">
          <p className="text-lg mb-6">Your cart is empty</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                  <p className="text-sm font-medium">{formatPrice(convertPrice(item.price), currency)}</p>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-r-none"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        }}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease quantity</span>
                      </Button>
                      <div className="h-8 px-3 flex items-center justify-center border-y border-border">
                        {item.quantity}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-l-none"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase quantity</span>
                      </Button>
                    </div>

                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => removeItem(item.id)}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-secondary/50 rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(convertPrice(subtotal), currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(convertPrice(subtotal), currency)}</span>
              </div>
            </div>

            <Button className="w-full mb-3" onClick={handleCheckout} disabled={isCheckingOut}>
              {isCheckingOut ? "Processing..." : "Checkout"}
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
