import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if environment variables are defined
    if (!process.env.SHOPIFY_ACCESS_TOKEN || !process.env.SHOPIFY_STORE_DOMAIN) {
      console.error("Missing Shopify environment variables")
      return NextResponse.json({ error: "Missing Shopify environment variables" }, { status: 500 })
    }

    const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "")
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN

    // Direct fetch to Shopify Admin API
    const url = `https://${shopifyDomain}/admin/api/2023-10/products.json`
    console.log(`Fetching from Shopify API: ${url}`)

    const response = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Shopify API error: ${response.status} ${response.statusText}`, errorText)
      return NextResponse.json(
        { error: `Shopify API error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()

    // Extract unique product types (categories)
    const categories = Array.from(new Set(data.products?.map((product: any) => product.product_type).filter(Boolean)))

    console.log(`Successfully extracted ${categories.length} categories from Shopify products`)

    return NextResponse.json(categories)
  } catch (error: any) {
    console.error("Error in categories API route:", error.message, error.stack)
    return NextResponse.json({ error: "Failed to fetch categories", message: error.message }, { status: 500 })
  }
}
