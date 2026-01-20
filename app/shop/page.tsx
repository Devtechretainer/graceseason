"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, Search, X } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { ClimbingBoxLoader } from "react-spinners"
import { useCategories } from "@/hooks/use-categories"
import ProductCard from "@/components/product-card"

// Sizes for filtering
const sizes = ["XS", "S", "M", "L", "XL"]

export default function ShopPage() {
  const searchParams = useSearchParams()
  const { products, isLoading, error } = useProducts()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [categories, setCategories] = useState<string[]>(["All"])
  const { categories: categoryOptions, isLoading: categoriesLoading } = useCategories()

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Read category from URL params
  useEffect(() => {
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      // Decode the category from URL
      const decodedCategory = decodeURIComponent(categoryParam)
      setSelectedCategory(decodedCategory)
    }
  }, [searchParams])

  // Extract unique categories from products
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = ["All", ...new Set(products.map((p) => p.category || "Uncategorized"))]
      setCategories(uniqueCategories)
    }
  }, [products])

  // Filter products based on search, category, and size
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSize = selectedSizes.length === 0 || product.sizes.some((size) => selectedSizes.includes(size))

    return matchesSearch && matchesCategory && matchesSize
  })

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) => (prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]))
  }

  if (!isClient) {
    return null
  }

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center items-center min-h-[60vh]">
        <ClimbingBoxLoader color="#ffffff" speedMultiplier={2} />
      </div>
    )
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8"></h1>
      <h1 className="text-3xl font-bold mb-8">Shop All</h1>

      {/* Mobile Filter Toggle */}
      <div className="flex md:hidden mb-6">
        <Button variant="outline" className="w-full" onClick={() => setIsFilterOpen(!isFilterOpen)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-10">
        {/* Filters - Mobile Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-background p-6 md:hidden">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-medium mb-3">Search</h3>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categoryOptions.map((category) => (
                    <button
                      key={category}
                      className={`block text-left px-2 py-1 w-full rounded-md ${
                        selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h3 className="font-medium mb-3">Sizes</h3>
                <div className="space-y-2">
                  {sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-size-${size}`}
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                      />
                      <Label htmlFor={`mobile-size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <Button className="w-full" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Filters - Desktop Sidebar */}
        <div className="hidden md:block">
          <div className="space-y-6 sticky top-20">
            {/* Search */}
            <div>
              <h3 className="font-medium mb-3">Search</h3>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    className={`block text-left px-2 py-1 w-full rounded-md ${
                      selectedCategory === category ? "bg-primary text-primary-foreground" : "hover:bg-secondary"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="font-medium mb-3">Sizes</h3>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={`size-${size}`}
                      checked={selectedSizes.includes(size)}
                      onCheckedChange={() => toggleSize(size)}
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {error && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-200">{error}</p>
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No products found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                  setSelectedSizes([])
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
