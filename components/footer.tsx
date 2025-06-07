import { cn } from "@/lib/utils"

interface FooterProps {
  className?: string
}

export function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("bg-gray-50 border-t", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            <strong>Disclaimer:</strong> This is a community referral platform, not a financial advisor. Please research
            and compare offers before applying for any credit card.
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-700">
              Terms & Conditions
            </a>
            <a href="#" className="hover:text-gray-700">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-gray-700">
              Contact
            </a>
          </div>
          <p className="text-xs text-gray-400">© 2024 Cardly. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
