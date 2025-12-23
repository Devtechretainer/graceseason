"use client"

import { useCurrency } from "@/contexts/CurrencyContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DollarSign } from "lucide-react"

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency("GHS")}>
          <span className={currency === "GHS" ? "font-semibold" : ""}>GHS - Ghanaian Cedi</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("USD")}>
          <span className={currency === "USD" ? "font-semibold" : ""}>USD - US Dollar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

