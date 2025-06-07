"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, PlusCircle, CreditCard, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileBottomNavV2() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
      active: pathname === "/",
    },
    {
      href: "/explore",
      icon: Search,
      label: "Explore",
      active: pathname === "/explore",
    },
    {
      href: "/submit-card",
      icon: PlusCircle,
      label: "Create",
      active: pathname === "/submit-card",
      isCenter: true,
    },
    {
      href: "/my-submissions",
      icon: CreditCard,
      label: "My Cards",
      active: pathname === "/my-submissions",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/profile",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-[#151522] rounded-t-3xl py-2 px-4 mobile-safe-area">
        <div className="flex items-center justify-between">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center transition-all",
                  item.isCenter ? "-mt-7" : "",
                  item.active ? "bg-white text-black rounded-full px-5 py-2" : "text-gray-400 hover:text-gray-300",
                )}
              >
                <div className="flex items-center">
                  <Icon className={cn("h-5 w-5", item.active ? "mr-2" : "")} />
                  {item.active && <span className="font-medium">{item.label}</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
