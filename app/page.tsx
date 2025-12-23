"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { motion, useInView } from "framer-motion"
import BounceCards from "@/components/BounceCards"

// Animation variants for scroll-triggered animations
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

const rotateIn = {
  hidden: { opacity: 0, rotate: -10, scale: 0.9 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

// Animated section wrapper component
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  )
}

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
    "/Current_The cross/Cross_8.jpg",
    "/Graceland Collection_2/2ndgl_3.jpg",
    "/Graceland Collection_2/2ndgl_4.jpg",
  ]

  // Cross collection images for BounceCards
  const crossImages = [
    "/Current_The cross/Cross_1.jpg",
    "/Current_The cross/Cross_2.jpg",
    "/Current_The cross/Cross_3.jpg",
    "/Current_The cross/Cross_4.jpg",
    "/Current_The cross/Cross_5.jpg",
  ]

  const crossTransformStyles = [
    "rotate(5deg) translate(-240px)",
    "rotate(0deg) translate(-110px)",
    "rotate(-5deg)",
    "rotate(5deg) translate(110px)",
    "rotate(-5deg) translate(240px)"
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
          <CarouselContent className="h-screen md:h-screen">
            {heroImages.map((img, index) => (
              <CarouselItem key={index} className="h-screen p-0">
                <div className="relative w-full h-[120vh] md:h-screen bg-black -mt-[10vh] md:mt-0">
                  <Image
                    src={img}
                    alt={`Grace Season Collection ${index + 1}`}
                    fill
                    className="object-cover object-center"
                    priority={index === 0}
                    sizes="100vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="container px-4 md:px-6 text-center relative z-10"
                    >
                      <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-display font-bold tracking-tighter mb-4 text-white"
                      >
                        Grace Season
                      </motion.h1>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
                      >
                        Wear Your Faith. Tell Your Story.
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                      >
                        <Button asChild size="lg" className="rounded-full px-8">
                          <Link href="/shop">Shop Now</Link>
                        </Button>
                      </motion.div>
                    </motion.div>
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
        <AnimatedSection>
          <section className="py-12 md:py-16">
            <div className="container px-4 md:px-6">
              <motion.h2 
                variants={fadeInScale}
                className="text-2xl md:text-3xl font-display font-bold text-center mb-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                New Arrivals
              </motion.h2>

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
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {featuredProducts.map((product, index) => (
                  <motion.div 
                    key={product.id} 
                    variants={fadeInScale}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-10"
              >
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/shop">View All Products</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

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
        <AnimatedSection>
          <section className="py-12 md:py-16 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <motion.h2
                variants={rotateIn}
                className="text-2xl md:text-3xl font-display font-bold text-center mb-10"
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ duration: 0.3 }}
              >
                Shop Categories
              </motion.h2>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {categoryImages.map((category, index) => (
                  <motion.div 
                    key={category.name} 
                    variants={index % 2 === 0 ? slideInLeft : slideInRight}
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={`/shop?category=${encodeURIComponent(category.slug)}`}
                      className="group relative aspect-square overflow-hidden rounded-xl block"
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          fill
                          className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.currentTarget.src = category.fallbackImage
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                          <h3 className="text-xl font-semibold text-white font-display group-hover:scale-105 transition-transform duration-300">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

        {/* Full Screen Image Section with Parallax */}
        <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0 bg-black h-[120vh] md:h-full -mt-[10vh] md:mt-0"
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, ease: "easeOut" }}
            >
              <Image
                src="/Current_The cross/Cross_7.jpg"
                alt="Grace Season Collection - The Cross"
                fill
                className="object-cover object-center"
                sizes="100vw"
                quality={90}
                priority
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container relative z-10 px-4 md:px-6 text-center"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-display font-bold tracking-tighter mb-4 text-white"
            >
              Elevate Your Style
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8"
            >
              Ready-to-wear apparel and lifestyle merchandise with a story of faith, creativity, and style
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/shop">Explore Collection</Link>
              </Button>
            </motion.div>
          </motion.div>
        </section>

        {/* Season Highlights / Collections Section */}
        <AnimatedSection>
          <section className="py-16 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
              <motion.div
                variants={fadeInScale}
                className="text-center mb-12"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-display font-bold mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Season Highlights
                </motion.h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover our latest collections featuring ready-to-wear apparel, cotton essentials, and lifestyle merchandise
                </p>
              </motion.div>
              
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {categories.slice(0, 3).map((category, index) => (
                  <motion.div 
                    key={category.name} 
                    variants={rotateIn}
                    whileHover={{ y: -10, scale: 1.02, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      href={`/shop?category=${encodeURIComponent(category.name)}`} 
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-gray-100">
                        <img 
                          src={category.image} 
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300" />
                        <div className="absolute inset-0 flex items-end p-6">
                          <h3 className="text-2xl font-display font-bold text-white group-hover:translate-y-[-8px] transition-transform duration-300">
                            {category.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

        {/* Newsletter Signup Section */}
        <AnimatedSection>
          <section className="py-16 md:py-24 bg-secondary/50">
            <div className="container px-4 md:px-6">
              <motion.div
                variants={fadeInScale}
                className="max-w-2xl mx-auto text-center"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-display font-bold mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  Stay in the know
                </motion.h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Sign up to be the first to know about new collections, special offers, and more.
                </p>
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                >
                  <motion.input
                    whileFocus={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300"
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button type="submit" size="lg" className="rounded-full px-8">
                      Sign Up
                    </Button>
                  </motion.div>
                </motion.form>
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

        {/* Shirt Images Section at Bottom */}
        <AnimatedSection>
          <section className="py-16 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
              <motion.div
                variants={fadeInUp}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Shirt Collection</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Premium shirts crafted with quality materials and contemporary design
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
              >
                {shirtImages.map((img, index) => (
                  <motion.div 
                    key={index} 
                    variants={fadeInScale}
                    whileHover={{ y: -10, scale: 1.03, rotate: index % 2 === 0 ? 1 : -1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href="/shop?category=Shirts"
                      className="group relative aspect-[3/4] overflow-hidden rounded-xl shadow-lg block"
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
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center mt-12"
              >
                <Button asChild variant="outline" className="rounded-full px-8">
                  <Link href="/shop?category=Shirts">Shop All Shirts</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </AnimatedSection>

        {/* The Cross Collection - BounceCards Section at Bottom */}
        <AnimatedSection>
          <section className="py-16 md:py-24 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
            <div className="container px-4 md:px-6">
              <motion.div
                variants={fadeInScale}
                className="text-center mb-12"
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-display font-bold mb-4"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  The Cross Collection
                </motion.h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                  Inspired by biblical storytelling and reimagined through contemporary design
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center items-center mb-12"
              >
                <BounceCards
                  className="custom-bounceCards"
                  images={crossImages}
                  containerWidth={800}
                  containerHeight={400}
                  animationDelay={0.5}
                  animationStagger={0.08}
                  easeType="elastic.out(1, 0.5)"
                  transformStyles={crossTransformStyles}
                  enableHover={true}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link href="/shop?category=The Cross Collection">Explore Collection</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </AnimatedSection>
      </div>
    </div>
  )
}
