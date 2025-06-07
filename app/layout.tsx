import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { MobileBottomNavV2 } from "@/components/mobile-bottom-nav-v2"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cardzz - Community Credit Card Referrals",
  description:
    "Find the best credit cards through community referrals. Compare benefits, earn rewards, and help others save money.",
  keywords: "credit cards, referrals, rewards, cashback, travel points",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 mobile-spacing">{children}</main>
            <Footer className="hidden md:block" />
            <MobileBottomNavV2 />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
