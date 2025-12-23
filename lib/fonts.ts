import { Inter, Playfair_Display, Poppins } from "next/font/google"

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Elegant serif font for headings - perfect for fashion brands
export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
})

// Modern sans-serif for body text - clean and professional
export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
})

// Custom font class for headings
export const customFont = {
  className: "font-playfair font-bold tracking-tight",
  variable: "--font-playfair",
}
