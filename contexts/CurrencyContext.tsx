"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type Currency = "GHS" | "USD"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  convertPrice: (priceInGHS: number) => number
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rate: 1 USD = 15 GHS (approximate)
const EXCHANGE_RATE = 15

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("GHS")

  // Load currency from localStorage on mount
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency") as Currency | null
    if (savedCurrency === "GHS" || savedCurrency === "USD") {
      setCurrencyState(savedCurrency)
    }
  }, [])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem("currency", newCurrency)
  }

  const convertPrice = (priceInGHS: number): number => {
    if (currency === "USD") {
      return priceInGHS / EXCHANGE_RATE
    }
    return priceInGHS
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}

