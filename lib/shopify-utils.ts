import type { ShopifyProduct, Product } from "./types"

// Convert Shopify product to our app's product format
export function mapShopifyProductToProduct(shopifyProduct: ShopifyProduct): Product {
  if (!shopifyProduct) {
    console.error("Received undefined or null shopifyProduct")
    return {
      id: "fallback-1",
      name: "Product Unavailable",
      price: 0,
      description: "This product information is currently unavailable.",
      sizes: ["One Size"],
      image: "/placeholder.svg",
      category: "Uncategorized",
    }
  }

  try {
    // Extract sizes from options (assuming first option is size)
    const sizes = shopifyProduct.options?.find(
      (option) => option?.name?.toLowerCase() === "size" || option?.name?.toLowerCase() === "sizes",
    )?.values || ["One Size"]

    // Get main image URL
    const mainImage =
      shopifyProduct.image?.src ||
      (shopifyProduct.images && shopifyProduct.images.length > 0 ? shopifyProduct.images[0]?.src : null) ||
      "/placeholder.svg"

    // Get all image URLs
    const images = shopifyProduct.images?.map((img) => img.src) || [mainImage]

    // Get price from first variant
    const price = Number.parseFloat(shopifyProduct.variants?.[0]?.price || "0")

    // Extract category from product_type
    const category = shopifyProduct.product_type || "Uncategorized"

    // Clean up HTML from description
    const description = shopifyProduct.body_html ? stripHtmlTags(shopifyProduct.body_html) : ""

    return {
      id: shopifyProduct.id?.toString() || "unknown-id",
      name: shopifyProduct.title || "Unnamed Product",
      price: isNaN(price) ? 0 : price,
      description: description.substring(0, 200) + (description.length > 200 ? "..." : ""),
      details: description,
      sizes,
      image: mainImage,
      images: images.length > 0 ? images : [mainImage],
      category,
    }
  } catch (error) {
    console.error("Error mapping Shopify product:", error, "Product data:", shopifyProduct)
    return {
      id: shopifyProduct.id?.toString() || "error-id",
      name: shopifyProduct.title || "Error Loading Product",
      price: 0,
      description: "There was an error processing this product's information.",
      sizes: ["One Size"],
      image: "/placeholder.svg",
      category: "Uncategorized",
    }
  }
}

// Helper function to strip HTML tags
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>?/gm, "")
}

// Format price in Ghanaian Cedi
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2,
  }).format(price)
}
