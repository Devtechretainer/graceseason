"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { useProducts } from "@/hooks/use-products"
import { ClimbingBoxLoader } from "react-spinners"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { categories } from "@/lib/product-data"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export default function Home() {
  const { featuredProducts, isLoading, error } = useProducts()
  const [isClient, setIsClient] = useState(false)
  
  // Initialize autoplay plugin - must be before any conditional returns
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  )

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  // Use categories from product data, limit to first 6 for homepage
  const categoryImages = categories.slice(0, 6).map((cat) => ({
    name: cat.name,
    slug: cat.name, // Use category name as slug for URL
    image: cat.image,
    fallbackImage: "/placeholder.svg?height=500&width=500",
  }))

  // Shirt images for bottom section
  const shirtImages = ["/Shirt/sh_4.jpg", "/Shirt/sh_5.jpg", "/Shirt/sh_6.jpg"]

  // Hero slider images
  const heroImages = [
    "/Current_The cross/Cross_7.jpg",
    
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Announcement Banner */}
      <div className="bg-black text-white text-center py-2 px-4 text-sm font-medium">
        <Link href="/shop" className="hover:underline">
          NEW COLLECTION IS HERE - SHOP NOW
        </Link>
      </div>

      {/* Hero Section with Image Slider */}
      <section className="relative min-h-screen w-full">
        <Carousel
          plugins={[autoplayPlugin.current]}
          className="w-full h-screen"
        >
          <CarouselContent className="h-screen">
            {heroImages.map((img, index) => (
              <CarouselItem key={index} className="h-screen p-0">
                <div className="relative w-full h-full">
                  <Image
                    src={img}
                    alt={`Grace Season Collection ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="container px-4 md:px-6 text-center relative z-10">
                      <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4 text-white">
                        Grace Season
                      </h1>
                      <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
                        A Ghana-based fashion brand inspired by biblical storytelling and reimagined through contemporary design
                      </p>
                      <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/shop">Shop Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 md:left-8 text-white border-white/50 hover:bg-white/20 hover:text-white" />
          <CarouselNext className="right-4 md:right-8 text-white border-white/50 hover:bg-white/20 hover:text-white" />
        </Carousel>
      </section>

      {/* Content Sections */}
      <div className="bg-background">
        {/* Featured Products */}
        <section className="py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">New Arrivals</h2>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <ClimbingBoxLoader color="#ffffff" speedMultiplier={2} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            <div className="text-center mt-10">
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/shop">View All Products</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Fullscreen Video Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <video className="absolute top-0 left-0 w-full h-full object-cover" autoPlay loop muted playsInline>
            <source
              src="https://dripbyrage.store/cdn/shop/videos/c/vp/7775b6b46fc6438c84b23c6da7cbb5f6/7775b6b46fc6438c84b23c6da7cbb5f6.HD-720p-4.5Mbps-41553509.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </section>

        {/* Shop Categories */}
        <section className="py-12 md:py-16 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-center mb-10">Shop Categories</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categoryImages.map((category) => (
                <Link
                  key={category.name}
                  href={`/shop?category=${encodeURIComponent(category.slug)}`}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.src = category.fallbackImage
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <h3 className="text-xl font-semibold text-white font-display">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Full Screen Image Section */}
        <section className="relative min-h-screen w-full flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/Current_The cross/Cross_7.jpg"
              alt="Grace Season Collection - The Cross"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="container relative z-10 px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4 text-white">Elevate Your Style</h2>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Ready-to-wear apparel and lifestyle merchandise with a story of faith, creativity, and style
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href="/shop">Explore Collection</Link>
            </Button>
          </div>
        </section>

        {/* Season Highlights / Collections Section */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Season Highlights</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our latest collections featuring ready-to-wear apparel, cotton essentials, and lifestyle merchandise
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.slice(0, 3).map((category) => (
                <Link 
                  key={category.name}
                  href={`/shop?category=${encodeURIComponent(category.name)}`} 
                  className="group"
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                    <div className="absolute inset-0 flex items-end p-6">
                      <h3 className="text-2xl font-display font-bold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Signup Section */}
        <section className="py-16 md:py-24 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Stay in the know</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Sign up to be the first to know about new collections, special offers, and more.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button type="submit" size="lg" className="rounded-full px-8">
                  Sign Up
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Shirt Images Section at Bottom */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Shirt Collection</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Premium shirts crafted with quality materials and contemporary design
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {shirtImages.map((img, index) => (
                <Link
                  key={index}
                  href="/shop?category=Shirts"
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img}
                      alt={`Shirt ${index + 1}`}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white font-semibold text-lg">View Collection</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href="/shop?category=Shirts">Shop All Shirts</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
