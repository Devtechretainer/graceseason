"use client"

import { useState, useEffect } from "react"
import { categories as fallbackCategories } from "@/lib/product-data"

export function useCategories() {
  const [categories, setCategories] = useState<string[]>(["All"])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Use local category data directly - no API calls
    setCategories(["All", ...fallbackCategories.map((c) => c.name)])
    setIsLoading(false)
    setError(null)
  }, [])

  return { categories, isLoading, error }
}
