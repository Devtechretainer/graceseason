import Link from "next/link"
import Image from "next/image"
import { Instagram, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black text-white py-10 md:py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="block mb-4">
              <Image
                src="/Logo-removebg-preview.png"
                alt="Grace Season"
                width={140}
                height={46}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-gray-300 mb-4">
              A Ghana-based fashion and lifestyle brand inspired by biblical storytelling and reimagined through contemporary design.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.instagram.com/a_tinderr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/a_tinderr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/a_tinderr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-gray-300 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Hoodies" className="text-gray-300 hover:text-white transition-colors">
                  Hoodies & Sweaters
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Tees" className="text-gray-300 hover:text-white transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Outerwear" className="text-gray-300 hover:text-white transition-colors">
                  Outerwear
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Collections</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Essentials
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About the brand
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-gray-300 hover:text-white transition-colors">
                  Style Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Get help</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/policies/shipping" className="text-gray-300 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="text-gray-300 hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-400">
          <p>© {currentYear} Grace Season. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
