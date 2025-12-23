"use client"

import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { fallbackProducts, featuredProducts as defaultFeaturedProducts } from "@/lib/product-data"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(defaultFeaturedProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use local product data directly - no API calls
    setProducts(fallbackProducts)
    setFeaturedProducts(defaultFeaturedProducts)
    setIsLoading(false)
    setError(null)
  }, [])

  return { products, featuredProducts, isLoading, error }
}
