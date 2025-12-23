"use client"

import type React from "react"

import { CartProvider } from "@/hooks/use-cart"
import { ThemeProvider } from "@/components/theme-provider"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { AuthProvider } from "@/contexts/auth-context"
import { CurrencyProvider } from "@/contexts/CurrencyContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
