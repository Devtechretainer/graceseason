"use client"

import { useState, useEffect } from "react"
import { MessageCircle } from "lucide-react"

function WhatsAppButton() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your products.")
    window.open(`https://wa.me/233503338796?text=${message}`, '_blank')
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 left-6 z-50 bg-black rounded-full px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 group"
      aria-label="Contact via WhatsApp"
    >
      {/* Chat Bubble Icon */}
      <div className="relative">
        <MessageCircle className="w-6 h-6 text-white" />
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          1
        </span>
      </div>
      {/* Chat Text */}
      <span className="text-white font-medium group-hover:opacity-80 transition-opacity">
        Chat
      </span>
    </button>
  )
}

export default WhatsAppButton

