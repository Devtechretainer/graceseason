import type React from "react"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Providers } from "./providers"
import AIChatbot from "@/components/ai-chatbot"
import WhatsAppButton from "@/components/whatsapp-button"
import GoogleAnalytics from "@/components/google-analytics"
import { Suspense } from "react"
import { poppins, playfair } from "@/lib/fonts"

export const metadata = {
  title: "Grace Season",
  description: "A Ghana-based fashion and lifestyle brand inspired by biblical storytelling and reimagined through contemporary design",
  generator: 'v0.app',
  icons: {
    icon: '/unnamed-removebg-preview.png',
    apple: '/unnamed-removebg-preview.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <link rel="icon" href="/unnamed-removebg-preview.png" sizes="any" />
        <link rel="apple-touch-icon" href="/unnamed-removebg-preview.png" />
      </head>
      <body className={`${poppins.variable} ${playfair.variable} ${poppins.className} font-sans dark bg-background min-h-screen flex flex-col`}>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AIChatbot />
            <WhatsAppButton />
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
