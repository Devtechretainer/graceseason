import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Server-side signup: creates the user ALREADY confirmed, so there is never an
// email-verification step. Uses the service role / secret key, which must stay
// server-side only (never exposed to the browser).
export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password, phone } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Server not configured: missing Supabase service role key in .env.local." },
        { status: 500 },
      )
    }

    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await admin.auth.admin.createUser({
      email: String(email).trim(),
      password,
      email_confirm: true, // <-- marks the email confirmed immediately, no verification needed
      user_metadata: {
        first_name: firstName || "",
        last_name: lastName || "",
        full_name: `${firstName || ""} ${lastName || ""}`.trim(),
        phone: phone || "",
      },
    })

    if (error) {
      const friendly = /already|exists|registered/i.test(error.message)
        ? "An account with this email already exists. Please log in instead."
        : error.message || "Failed to create account."
      return NextResponse.json({ error: friendly }, { status: 400 })
    }

    return NextResponse.json({ success: true, userId: data.user?.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to create account." }, { status: 500 })
  }
}
