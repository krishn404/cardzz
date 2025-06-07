"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import CardSwap, { Card as SwapCard } from "@/components/card-swap"
import { useAuth } from "@/lib/auth-context"
import {
  ArrowRight,
  CreditCard,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Award,
  Star,
  DollarSign,
  CheckCircle,
  Sparkles,
  Gift,
  Target,
  Plus,
} from "lucide-react"

export default function LandingPage() {
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div
                className={`transition-all duration-1000 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              >
                <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2 text-sm font-medium">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Community-Powered Credit Cards
                </Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Easy.{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Rewarding.
                  </span>
                  <br />
                  Built for You.
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
                  Discover the best credit cards through our community marketplace. Get exclusive rewards, compare
                  benefits, and help others save money with trusted referrals.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={user ? "/" : "#"}>
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold px-8 py-4 rounded-2xl text-lg transition-all duration-300"
                  >
                    <Link href="/">Browse Cards</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Credit Cards</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">10K+</div>
                    <div className="text-sm text-gray-600">Happy Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">$2M+</div>
                    <div className="text-sm text-gray-600">Rewards Earned</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - CardSwap */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
              }`}
            >
              <div style={{ height: "600px", position: "relative" }}>
                <CardSwap cardDistance={40} verticalDistance={50} delay={4000} pauseOnHover={true}>
                  {/* Card 1 - Instant Rewards */}
                  <SwapCard>
                    <Card className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8 h-full flex flex-col justify-between text-white relative">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/20 text-white border-0">
                            <Gift className="h-3 w-3 mr-1" />
                            Instant Rewards
                          </Badge>
                        </div>
                        <div>
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Chase Sapphire Preferred</h3>
                          <p className="text-blue-100 mb-4">2x points on travel and dining</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Sign-up Bonus</span>
                            <span className="font-bold">60,000 points</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-blue-100">Annual Fee</span>
                            <span className="font-bold">$95</span>
                          </div>
                          <div className="bg-white/20 rounded-xl p-3 mt-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Approval Rate</span>
                              <span className="text-sm font-bold">87%</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                              <div className="bg-white rounded-full h-2 w-[87%]"></div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwapCard>

                  {/* Card 2 - Community Trusted */}
                  <SwapCard>
                    <Card className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8 h-full flex flex-col justify-between text-white relative">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/20 text-white border-0">
                            <Users className="h-3 w-3 mr-1" />
                            Community Choice
                          </Badge>
                        </div>
                        <div>
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <Award className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Capital One Venture X</h3>
                          <p className="text-emerald-100 mb-4">2x miles on everything</p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="flex -space-x-2">
                              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                                J
                              </div>
                              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                                M
                              </div>
                              <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                                S
                              </div>
                            </div>
                            <span className="text-emerald-100 text-sm">+247 referrals this month</span>
                          </div>
                          <div className="bg-white/20 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Community Rating</span>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-white text-white" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-emerald-100">"Best travel rewards card!" - Sarah M.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwapCard>

                  {/* Card 3 - Zero Fees */}
                  <SwapCard>
                    <Card className="w-full h-full bg-gradient-to-br from-orange-500 to-red-500 border-0 shadow-2xl rounded-3xl overflow-hidden">
                      <CardContent className="p-8 h-full flex flex-col justify-between text-white relative">
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/20 text-white border-0">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Zero Fees
                          </Badge>
                        </div>
                        <div>
                          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                            <CheckCircle className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Discover it Cash Back</h3>
                          <p className="text-orange-100 mb-4">5% rotating categories</p>
                        </div>
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/20 rounded-xl p-3 text-center">
                              <div className="text-2xl font-bold">0%</div>
                              <div className="text-xs text-orange-100">Annual Fee</div>
                            </div>
                            <div className="bg-white/20 rounded-xl p-3 text-center">
                              <div className="text-2xl font-bold">0%</div>
                              <div className="text-xs text-orange-100">Foreign Fees</div>
                            </div>
                          </div>
                          <div className="bg-white/20 rounded-xl p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm">Cashback Match</span>
                              <span className="text-sm font-bold">First Year</span>
                            </div>
                            <div className="text-xs text-orange-100">Double all cashback earned in your first year</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </SwapCard>
                </CardSwap>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-bounce">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Live Referrals</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-10 hidden lg:block">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg animate-pulse">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">+$2,341 earned today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">Cardzz</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of smart consumers who are maximizing their credit card rewards through our community
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community Driven",
                description: "Real users sharing real experiences and trusted referral links",
                color: "from-blue-500 to-purple-500",
              },
              {
                icon: Shield,
                title: "Verified & Safe",
                description: "All referral links are verified and lead to official bank websites",
                color: "from-emerald-500 to-teal-500",
              },
              {
                icon: Target,
                title: "Earn Together",
                description: "Help others while earning referral bonuses for yourself",
                color: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group hover:scale-105"
              >
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}
