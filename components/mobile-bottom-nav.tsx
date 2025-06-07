"use client"

import Link from "next/link"
import { Home, Search, Plus, CreditCard, User } from "lucide-react"
import { usePathname } from "next/navigation"

export function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/explore", icon: Search, label: "Search" },
    { href: "/submit-card", icon: Plus, label: "Add", className: "-mt-2" },
    { href: "/my-submissions", icon: CreditCard, label: "My Cards" },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200 z-50 md:hidden">
      <nav className="flex h-16 items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded-full transition-colors duration-200
                ${isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-gray-700"}
                ${item.className || ""}
              `}
            >
              <item.icon className={`h-6 w-6 ${isActive ? "text-blue-600" : "text-gray-500"}`} />
              <span className={`text-xs mt-1 ${isActive ? "font-semibold text-blue-600" : "font-medium text-gray-500"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
} 