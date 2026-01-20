"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingBag, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { fallbackProducts } from "@/lib/product-data"
import { ClimbingBoxLoader } from "react-spinners"
import { formatPrice } from "@/lib/shopify-utils"
import { trackEvent } from "@/components/google-analytics"
import { useCurrency } from "@/contexts/CurrencyContext"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { currency, convertPrice } = useCurrency()

  const [product, setProduct] = useState(fallbackProducts.find((p) => p.id === params.id))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isAdding, setIsAdding] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // This ensures hydration issues are avoided
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load product data from local data
  useEffect(() => {
    setIsLoading(true)
    
    // Use local product data directly - no API calls
    const foundProduct = fallbackProducts.find((p) => p.id === params.id)
    
    if (foundProduct) {
      setProduct(foundProduct)
      
      // Track product view in Google Analytics
      trackEvent("view_item", "ecommerce", foundProduct.name, foundProduct.price)
      
      // Set default size if available
      if (foundProduct.sizes.length > 0) {
        setSelectedSize(foundProduct.sizes[0])
      }
      
      setError(null)
    } else {
      setError("Product not found")
    }
    
    setIsLoading(false)
  }, [params.id])

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

  if (!product) {
    return <div className="container py-16 text-center">Product not found</div>
  }

  const isFavorite = isInWishlist(product.id)

  const toggleWishlist = () => {
    if (isFavorite) {
      removeFromWishlist(product.id)
      trackEvent("remove_from_wishlist", "ecommerce", product.name, product.price)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
      trackEvent("add_to_wishlist", "ecommerce", product.name, product.price)
    }
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size")
      return
    }

    setIsAdding(true)

    // Track add to cart event
    trackEvent("add_to_cart", "ecommerce", product.name, product.price * quantity)

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity,
    })

    setTimeout(() => {
      setIsAdding(false)
      router.push("/cart")
    }, 1000)
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">Product Details</h1>

      {error && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
          <p className="text-yellow-200">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images && product.images.length > 0 ? product.images[selectedImage] : product.image}
              alt={product.name}
              width={500}
              height={500}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`h-16 w-16 flex-shrink-0 rounded-md overflow-hidden border ${
                    selectedImage === idx ? "border-primary" : "border-muted"
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} - Image ${idx + 1}`}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={toggleWishlist}>
              <Heart
                className={cn("h-5 w-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
              />
              <span className="sr-only">{isFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
            </Button>
          </div>

          <p className="text-xl font-semibold mb-4">{formatPrice(convertPrice(product.price), currency)}</p>
          <p className="text-muted-foreground mb-4">{product.description}</p>

          {product.details && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Details</h3>
              <p className="text-sm text-muted-foreground">{product.details}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-3">Size</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "h-10 min-w-[2.5rem] px-3 rounded-md border border-border bg-background flex items-center justify-center transition-colors",
                    selectedSize === size
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:border-gray-400",
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected size: <span className="font-medium">{selectedSize}</span>
              </p>
            )}
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-3">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="h-10 px-4 flex items-center justify-center border-y border-border">{quantity}</div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="w-full h-12" onClick={handleAddToCart} disabled={isAdding || !selectedSize}>
            <ShoppingBag className="mr-2 h-5 w-5" />
            {isAdding ? "Adding to Cart..." : "Add to Cart"}
          </Button>

          <div className="mt-8 pt-8 border-t border-border">
            <div className="grid gap-4">
              <div>
                <h3 className="font-medium mb-1">Category</h3>
                <p className="text-muted-foreground">{product.category}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
