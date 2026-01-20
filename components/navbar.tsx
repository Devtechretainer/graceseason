"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Menu, X, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { CurrencySelector } from "@/components/CurrencySelector"

// Animation variants
const itemVariants = {
  initial: { rotateX: 0, opacity: 1 },
  hover: { rotateX: -90, opacity: 0 },
}

const backVariants = {
  initial: { rotateX: 90, opacity: 0 },
  hover: { rotateX: 0, opacity: 1 },
}

const glowVariants = {
  initial: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 2,
    transition: {
      opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
      scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
    },
  },
}

const sharedTransition = {
  type: "spring",
  stiffness: 100,
  damping: 20,
  duration: 0.5,
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { items = [] } = useCart() || { items: [] }
  const { wishlistItems = [] } = useWishlist() || { wishlistItems: [] }
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const { theme } = useTheme()

  const isDarkTheme = theme === "dark"
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const isHomePage = pathname === "/"

  useEffect(() => {
    // Navbar is always visible as part of the site layout
    setIsVisible(true)
  }, [])

  const NavbarContent = (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 w-full bg-background border-b border-border shadow-sm transition-all duration-300"
    >
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/unnamed-removebg-preview.png"
            alt="Grace Season"
            width={120}
            height={40}
            className="h-8 md:h-10 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <HoverLink
            href="/shop"
            label="Shop"
            gradient="radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)"
            iconColor="text-orange-500"
          />
          <HoverLink
            href="/shop"
            label="Collections"
            gradient="radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)"
            iconColor="text-blue-500"
          />
          <HoverLink
            href="/about"
            label="About"
            gradient="radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)"
            iconColor="text-green-500"
          />
          <HoverLink
            href="/contact"
            label="Contact"
            gradient="radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)"
            iconColor="text-red-500"
          />
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {wishlistItems.length}
                </Badge>
              )}
              <span className="sr-only">Wishlist</span>
            </Button>
          </Link>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {items.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {items.length}
                </Badge>
              )}
              <span className="sr-only">Shopping Cart</span>
            </Button>
          </Link>

           <CurrencySelector />

          <Link href={isAuthenticated ? "/account" : "/login"}>
            <Button variant="ghost" size="icon" className="relative">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40">
          <nav className="flex flex-col p-4 space-y-4">
            <HoverLink
              href="/shop"
              label="Shop"
              onClick={toggleMenu}
              gradient="radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)"
              iconColor="text-orange-500"
            />
            <HoverLink
              href="/shop"
              label="Collections"
              onClick={toggleMenu}
              gradient="radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)"
              iconColor="text-blue-500"
            />
            <HoverLink
              href="/about"
              label="About"
              onClick={toggleMenu}
              gradient="radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)"
              iconColor="text-green-500"
            />
            <HoverLink
              href="/contact"
              label="Contact"
              onClick={toggleMenu}
              gradient="radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)"
              iconColor="text-red-500"
            />
            <HoverLink
              href={isAuthenticated ? "/account" : "/login"}
              label="Account"
              onClick={toggleMenu}
              gradient="radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(124,58,237,0.06) 50%, rgba(109,40,217,0) 100%)"
              iconColor="text-purple-500"
            />
          </nav>
        </div>
      )}
    </motion.header>
  )

  return <AnimatePresence>{NavbarContent}</AnimatePresence>
}

function HoverLink({
  href,
  label,
  onClick,
  gradient,
  iconColor,
}: { href: string; label: string; onClick?: () => void; gradient?: string; iconColor?: string }) {
  return (
    <motion.div className="relative" whileHover="hover" initial="initial">
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        variants={glowVariants}
        style={{
          background:
            gradient ||
            "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
          opacity: 0,
          borderRadius: "16px",
        }}
      />
      <div className="block rounded-xl overflow-visible group relative" style={{ perspective: "600px" }}>
        <motion.div
          className="flex items-center gap-2 px-4 py-2 relative z-10 rounded-xl"
          variants={itemVariants}
          transition={sharedTransition}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
        >
          <Link href={href} onClick={onClick} className="text-sm font-medium">
            {label}
          </Link>
        </motion.div>
        <motion.div
          className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 rounded-xl"
          variants={backVariants}
          transition={sharedTransition}
          style={{ transformStyle: "preserve-3d", transformOrigin: "center top", rotateX: 90 }}
        >
          <Link href={href} onClick={onClick} className={`text-sm font-medium ${iconColor || "text-blue-500"}`}>
            {label}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
