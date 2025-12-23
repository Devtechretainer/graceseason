"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatPrice } from "@/lib/shopify-utils"
import { useCurrency } from "@/contexts/CurrencyContext"

type ProductCardProps = {
  product: {
    id: string
    name: string
    price: number
    image: string
    images?: string[]
    category?: string
  }
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { currency, convertPrice } = useCurrency()
  const [isHovered, setIsHovered] = useState(false)

  const isFavorite = isInWishlist(product.id)

  // Determine which image to show
  const hasSecondImage = product.images && product.images.length > 1
  const displayImage = isHovered && hasSecondImage ? product.images![1] : product.image

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
      })
    }
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className={cn("group block relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
        <Image
          src={displayImage || "/placeholder.svg"}
          alt={product.name}
          fill
          className={cn("object-cover transition-transform duration-300", isHovered ? "scale-110" : "scale-100")}
        />

        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-opacity",
            isHovered || isFavorite ? "opacity-100" : "opacity-0",
          )}
          onClick={toggleWishlist}
        >
          <Heart
            className={cn("h-4 w-4 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-gray-600")}
          />
        </Button>
      </div>

      <h3 className="font-medium">{product.name}</h3>
      <p className="text-muted-foreground">{formatPrice(convertPrice(product.price), currency)}</p>
    </Link>
  )
}
