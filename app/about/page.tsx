import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
        <div className="container">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              About Grace Season
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              A Ghana-based fashion and lifestyle brand inspired by biblical storytelling
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-16">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Gszn (Grace Season) is a Ghana-based fashion and lifestyle brand founded in 2021 by Konadu Bright and his team. 
                Inspired by biblical storytelling and reimagined through contemporary design, Gszn is a Christian brand creating 
                waves across cities.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Our Collections</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Each year, we release new collections for both men and women, offering ready-to-wear apparel, cotton essentials, 
                and lifestyle merchandise. Every piece carries a story — a blend of faith, creativity, and style across the seasons.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg md:text-xl font-semibold mb-3">Our Growth</h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Since our official launch on <strong>12-09-21</strong>, Grace Season has evolved to meet the demands of a new era. Our growth is 
                driven by two core pillars: innovative clothing materials and the <strong>Grace Season Networking Scheme (Sinai)</strong>. Together, 
                these have positioned Gszn as a dynamic force in fashion, merging purpose with productivity.
              </p>
            </div>
          </div>

          {/* Founder image */}
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
            <Image
              src="/founder.jpg"
              alt="Konadu Bright - Founder of Grace Season"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Values/Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="text-center p-6 rounded-xl bg-secondary/50">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold mb-2">Faith-Inspired</h3>
            <p className="text-sm text-muted-foreground">
              Every design is rooted in biblical storytelling, creating pieces with purpose and meaning.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-secondary/50">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Contemporary Design</h3>
            <p className="text-sm text-muted-foreground">
              Biblical stories reimagined through modern fashion, blending tradition with innovation.
            </p>
          </div>
          
          <div className="text-center p-6 rounded-xl bg-secondary/50">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-lg font-semibold mb-2">Community Focus</h3>
            <p className="text-sm text-muted-foreground">
              Through our Networking Scheme (Sinai), we build connections and empower communities.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/50 to-primary/10 p-12 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Discover Our Collections</h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our latest ready-to-wear apparel, cotton essentials, and lifestyle merchandise. Each piece tells a story 
            of faith, creativity, and style.
          </p>
          <Button asChild size="lg" className="rounded-full px-8 text-base">
            <Link href="/shop">Shop Now</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
