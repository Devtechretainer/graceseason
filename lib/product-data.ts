import type { Product } from "./types"

// Helper function to create product name from filename
function createProductName(filename: string, collection: string): string {
  const name = filename
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
  
  // Skip description/logo files
  if (filename.toLowerCase().includes("description") || filename.toLowerCase().includes("logo")) {
    return ""
  }
  
  return name
}

// Helper function to get category from folder name
function getCategoryFromFolder(folder: string): string {
  const categoryMap: Record<string, string> = {
    "Accessories": "Accessories",
    "Current_The cross": "The Cross Collection",
    "Embroidery Origin": "Embroidery Origin",
    "First_Collection": "First Collection",
    "Graceland Collection_1": "Graceland Collection",
    "Graceland Collection_2": "Graceland Collection",
    "Graceland_3": "Graceland Collection",
    "Graceland_4": "Graceland Collection",
    "Holiday_Collection": "Holiday Collection",
    "Long_Sleeves": "Long Sleeves",
    "Restoration": "Restoration",
    "Shirt": "Shirts",
    "Sweatshirt_Hoodies": "Hoodies & Sweaters",
    "The_Ark_Collection": "The Ark Collection",
    "Time & chance": "Time & Chance",
  }
  return categoryMap[folder] || "Uncategorized"
}

// Generate products from images in public folder
const generateProducts = (): Product[] => {
  const products: Product[] = []
  let productId = 1

  // Accessories
  const accessories = ["acc1.jpg", "acc3.jpg", "acc4.jpg"]
  accessories.forEach((img) => {
    const name = createProductName(img, "Accessories")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Accessory`,
        price: 4999,
        description: `Premium accessory from Grace Season's Accessories collection. Each piece carries a story of faith, creativity, and style.`,
        details: `Handcrafted accessory featuring quality materials and contemporary design inspired by biblical storytelling.`,
        sizes: ["One Size"],
        image: `/Accessories/${img}`,
        images: [`/Accessories/${img}`],
        category: "Accessories",
      })
    }
  })

  // Current The Cross Collection
  const crossItems = ["Cross_1.jpg", "Cross_2.jpg", "Cross_3.jpg", "Cross_4.jpg", "Cross_5.jpg", "Cross_6.jpg", "Cross_7.jpg", "Cross_8.jpg"]
  crossItems.forEach((img) => {
    const name = createProductName(img, "The Cross")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - The Cross Collection`,
        price: 8999,
        description: `Part of Grace Season's Current The Cross Collection. Inspired by biblical storytelling and reimagined through contemporary design.`,
        details: `This piece from The Cross Collection represents faith, creativity, and style. Ready-to-wear apparel crafted with innovative materials.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Current_The cross/${img}`,
        images: [`/Current_The cross/${img}`],
        category: "The Cross Collection",
      })
    }
  })

  // Embroidery Origin
  const embroidery = ["emb1.jpg", "emb2.jpg", "emb3.jpg"]
  embroidery.forEach((img) => {
    const name = createProductName(img, "Embroidery Origin")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Embroidery Origin`,
        price: 7999,
        description: `From Grace Season's Embroidery Origin collection. Each piece features intricate embroidery work with contemporary design.`,
        details: `Hand-embellished piece showcasing traditional techniques reimagined through modern fashion. Part of our ready-to-wear apparel line.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Embroidery Origin/${img}`,
        images: [`/Embroidery Origin/${img}`],
        category: "Embroidery Origin",
      })
    }
  })

  // First Collection
  const firstCollection = ["1stcol_2.jpg", "1stcol_4.jpg", "1stcol_6.jpg"]
  firstCollection.forEach((img) => {
    const name = createProductName(img, "First Collection")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - First Collection`,
        price: 6999,
        description: `From Grace Season's debut First Collection. A piece that started our journey in 2021, inspired by biblical storytelling.`,
        details: `Classic design from our inaugural collection. Each piece represents the foundation of our brand's mission to merge faith, creativity, and style.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/First_Collection/${img}`,
        images: [`/First_Collection/${img}`],
        category: "First Collection",
      })
    }
  })

  // Graceland Collection 1
  const graceland1 = ["1stgl_1.jpg", "1stgl_3.jpg", "1stgl_9.jpg"]
  graceland1.forEach((img) => {
    const name = createProductName(img, "Graceland")
    if (name && !name.toLowerCase().includes("about")) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Graceland Collection`,
        price: 8499,
        description: `From Grace Season's Graceland Collection. Contemporary design inspired by biblical storytelling with innovative materials.`,
        details: `Part of our Graceland series, this piece showcases our commitment to merging purpose with productivity through fashion.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Graceland Collection_1/${img}`,
        images: [`/Graceland Collection_1/${img}`],
        category: "Graceland Collection",
      })
    }
  })

  // Graceland Collection 2
  const graceland2 = ["2ndgl_2.jpg", "2ndgl_3.jpg", "2ndgl_4.jpg"]
  graceland2.forEach((img) => {
    const name = createProductName(img, "Graceland")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Graceland Collection`,
        price: 8499,
        description: `From Grace Season's Graceland Collection. Contemporary design inspired by biblical storytelling with innovative materials.`,
        details: `Part of our Graceland series, this piece showcases our commitment to merging purpose with productivity through fashion.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Graceland Collection_2/${img}`,
        images: [`/Graceland Collection_2/${img}`],
        category: "Graceland Collection",
      })
    }
  })

  // Graceland 3
  const graceland3 = ["3rdgl_3.jpg", "3rdgl_4.jpg"]
  graceland3.forEach((img) => {
    const name = createProductName(img, "Graceland")
    if (name && !name.toLowerCase().includes("about")) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Graceland Collection`,
        price: 8499,
        description: `From Grace Season's Graceland Collection. Contemporary design inspired by biblical storytelling with innovative materials.`,
        details: `Part of our Graceland series, this piece showcases our commitment to merging purpose with productivity through fashion.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Graceland_3/${img}`,
        images: [`/Graceland_3/${img}`],
        category: "Graceland Collection",
      })
    }
  })

  // Graceland 4
  const graceland4 = ["4thgl_1.jpg", "4thgl_2.jpg"]
  graceland4.forEach((img) => {
    const name = createProductName(img, "Graceland")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Graceland Collection`,
        price: 8499,
        description: `From Grace Season's Graceland Collection. Contemporary design inspired by biblical storytelling with innovative materials.`,
        details: `Part of our Graceland series, this piece showcases our commitment to merging purpose with productivity through fashion.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Graceland_4/${img}`,
        images: [`/Graceland_4/${img}`],
        category: "Graceland Collection",
      })
    }
  })

  // Holiday Collection
  const holiday = ["hcol_1.jpg", "hcol_4.jpg", "hcol_5.jpg"]
  holiday.forEach((img) => {
    const name = createProductName(img, "Holiday")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Holiday Collection`,
        price: 7499,
        description: `From Grace Season's Holiday Collection. Special edition pieces perfect for celebrating the season with style and faith.`,
        details: `Limited edition holiday piece featuring festive designs while maintaining our brand's commitment to biblical storytelling and contemporary design.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Holiday_Collection/${img}`,
        images: [`/Holiday_Collection/${img}`],
        category: "Holiday Collection",
      })
    }
  })

  // Long Sleeves
  const longSleeves = ["sl_3.jpg", "sl_4.jpg", "sl_7.jpg"]
  longSleeves.forEach((img) => {
    const name = createProductName(img, "Long Sleeves")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Long Sleeve`,
        price: 5999,
        description: `Premium long sleeve piece from Grace Season. Comfortable and stylish, perfect for all seasons.`,
        details: `Crafted with quality materials and attention to detail. This long sleeve piece combines comfort with our signature contemporary design.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Long_Sleeves/${img}`,
        images: [`/Long_Sleeves/${img}`],
        category: "Long Sleeves",
      })
    }
  })

  // Restoration
  const restoration = ["rest_2.jpg", "rest_3.jpg", "rest_4.jpg"]
  restoration.forEach((img) => {
    const name = createProductName(img, "Restoration")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Restoration Collection`,
        price: 7999,
        description: `From Grace Season's Restoration Collection. Pieces that represent renewal and faith through fashion.`,
        details: `This Restoration piece embodies themes of renewal and restoration, crafted with contemporary design and quality materials.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Restoration/${img}`,
        images: [`/Restoration/${img}`],
        category: "Restoration",
      })
    }
  })

  // Shirts
  const shirts = ["sh_4.jpg", "sh_5.jpg", "sh_6.jpg"]
  shirts.forEach((img) => {
    const name = createProductName(img, "Shirts")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Shirt`,
        price: 6499,
        description: `Premium shirt from Grace Season. Versatile piece that can be dressed up or down, perfect for any occasion.`,
        details: `Quality shirt featuring contemporary design and comfortable fit. Part of our ready-to-wear apparel collection.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Shirt/${img}`,
        images: [`/Shirt/${img}`],
        category: "Shirts",
      })
    }
  })

  // Sweatshirt/Hoodies
  const hoodies = ["sho_1.jpg", "sho_2.jpg", "sho_3.jpg"]
  hoodies.forEach((img) => {
    const name = createProductName(img, "Hoodies")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Hoodie`,
        price: 8999,
        description: `Comfortable and stylish hoodie from Grace Season. Perfect for casual wear with our signature contemporary design.`,
        details: `Premium hoodie crafted with quality materials. Features our brand's commitment to merging faith, creativity, and style.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Sweatshirt_Hoodies/${img}`,
        images: [`/Sweatshirt_Hoodies/${img}`],
        category: "Hoodies & Sweaters",
      })
    }
  })

  // The Ark Collection
  const ark = ["ark_2.jpg", "ark_5.jpg", "ark_6.jpg"]
  ark.forEach((img) => {
    const name = createProductName(img, "The Ark")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - The Ark Collection`,
        price: 8999,
        description: `From Grace Season's The Ark Collection. Inspired by biblical storytelling and reimagined through contemporary design.`,
        details: `Part of The Ark Collection, this piece represents faith, protection, and journey. Crafted with innovative materials and attention to detail.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/The_Ark_Collection/${img}`,
        images: [`/The_Ark_Collection/${img}`],
        category: "The Ark Collection",
      })
    }
  })

  // Time & Chance
  const timeChance = ["t&c_0.jpg", "t&c_1.jpg", "t&c_2.jpg", "t&c_3.jpg", "t&c_4.jpg", "t&c_5.jpg", "t&c_6.jpg", "t&c_7.jpg"]
  timeChance.forEach((img) => {
    const name = createProductName(img, "Time & Chance")
    if (name) {
      products.push({
        id: (productId++).toString(),
        name: `${name} - Time & Chance Collection`,
        price: 8499,
        description: `From Grace Season's Time & Chance Collection. Pieces that reflect on timing, opportunity, and faith.`,
        details: `This Time & Chance piece embodies themes of timing and opportunity, crafted with contemporary design and quality materials.`,
        sizes: ["XS", "S", "M", "L", "XL"],
        image: `/Time & chance/${img}`,
        images: [`/Time & chance/${img}`],
        category: "Time & Chance",
      })
    }
  })

  return products
}

// Fallback products generated from images in public folder
export const fallbackProducts: Product[] = generateProducts()

// Categories with images from products
export const categories = [
  {
    name: "Accessories",
    slug: "Accessories",
    image: "/Accessories/acc1.jpg",
  },
  {
    name: "The Cross Collection",
    slug: "The Cross Collection",
    image: "/Current_The cross/Cross_1.jpg",
  },
  {
    name: "Embroidery Origin",
    slug: "Embroidery Origin",
    image: "/Embroidery Origin/emb1.jpg",
  },
  {
    name: "Graceland Collection",
    slug: "Graceland Collection",
    image: "/Graceland Collection_1/1stgl_1.jpg",
  },
  {
    name: "Hoodies & Sweaters",
    slug: "Hoodies & Sweaters",
    image: "/Sweatshirt_Hoodies/sho_1.jpg",
  },
  {
    name: "Holiday Collection",
    slug: "Holiday Collection",
    image: "/Holiday_Collection/hcol_1.jpg",
  },
  {
    name: "Long Sleeves",
    slug: "Long Sleeves",
    image: "/Long_Sleeves/sl_3.jpg",
  },
  {
    name: "Shirts",
    slug: "Shirts",
    image: "/Shirt/sh_4.jpg",
  },
  {
    name: "The Ark Collection",
    slug: "The Ark Collection",
    image: "/The_Ark_Collection/ark_2.jpg",
  },
  {
    name: "Time & Chance",
    slug: "Time & Chance",
    image: "/Time & chance/t&c_0.jpg",
  },
]

// Featured products (first 8 products from various collections)
export const featuredProducts = [
  ...fallbackProducts.filter((p) => p.category === "The Cross Collection").slice(0, 2),
  ...fallbackProducts.filter((p) => p.category === "Graceland Collection").slice(0, 2),
  ...fallbackProducts.filter((p) => p.category === "Hoodies & Sweaters").slice(0, 2),
  ...fallbackProducts.filter((p) => p.category === "Embroidery Origin").slice(0, 2),
].slice(0, 8)
