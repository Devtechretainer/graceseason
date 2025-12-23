import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="container py-16 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8"></h1>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shipping Policy</h1>

      <div className="bg-secondary/30 rounded-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
          <p className="text-muted-foreground">
            All orders are processed within 1-2 business days after receiving your order confirmation email. Orders
            placed on weekends or holidays will be processed on the next business day.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods & Delivery Times</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Domestic Shipping (India)</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Standard Shipping: 3-5 business days</li>
                <li>Express Shipping: 1-2 business days (available at checkout for an additional fee)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">International Shipping</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Standard International: 7-14 business days</li>
                <li>Express International: 3-5 business days (available at checkout for an additional fee)</li>
                <li>Please note that delivery times may vary depending on customs processing in your country</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Rates</h2>
          <p className="text-muted-foreground mb-4">
            Shipping rates are calculated based on the weight of your order, the shipping method selected, and your
            delivery location.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-medium mb-2">Domestic Shipping (India)</h3>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Orders over ₹1500: Free standard shipping</li>
                <li>Orders under ₹1500: ₹150 for standard shipping</li>
                <li>Express shipping: Additional ₹250</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-2">International Shipping</h3>
              <p className="text-muted-foreground">
                International shipping rates vary by country and will be calculated at checkout.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tracking Information</h2>
          <p className="text-muted-foreground">
            You will receive a shipping confirmation email with a tracking number once your order has been shipped. You
            can use this tracking number to monitor the status of your delivery.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Customs & Import Duties</h2>
          <p className="text-muted-foreground">
            For international orders, please note that you may be responsible for paying customs fees, import duties,
            and taxes imposed by your country's government. These fees are not included in the purchase price or
            shipping cost and are the responsibility of the recipient.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Delays</h2>
          <p className="text-muted-foreground">
            While we strive to deliver all orders within the estimated timeframes, occasionally delays may occur due to
            circumstances beyond our control, such as weather conditions, postal service issues, or customs processing.
            We appreciate your understanding in these situations.
          </p>
        </section>

        <div className="border-t border-gray-700 pt-6 mt-8">
          <p className="text-muted-foreground">
            If you have any questions about our shipping policy, please{" "}
            <Link href="/contact" className="underline hover:text-primary">
              contact us
            </Link>
            .
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}
