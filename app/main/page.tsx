'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Users, TrendingUp, ShieldCheck, Zap, Heart, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <Badge className="mx-auto px-4 py-1.5 text-sm font-medium bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 border-0">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Elevating Guest Experiences
            </Badge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
              Transform Your
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Guest Experience
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Innovative solutions that delight your guests, streamline operations, and drive revenue.
              From smart minibar management to real-time feedback systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <span>Trusted by 500+ Hotels</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>98% Guest Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Comprehensive solutions designed for modern hospitality
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-indigo-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-indigo-600 dark:text-indigo-300" />
                </div>
                <CardTitle>Smart Minibar Management</CardTitle>
                <CardDescription>
                  Automated inventory tracking, real-time consumption monitoring, and seamless billing integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <CardTitle>Guest Feedback System</CardTitle>
                <CardDescription>
                  Capture real-time feedback, resolve issues instantly, and improve satisfaction scores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                </div>
                <CardTitle>Analytics & Insights</CardTitle>
                <CardDescription>
                  Data-driven insights to optimize operations, understand guest preferences, and boost revenue
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <CardTitle>Room Automation</CardTitle>
                <CardDescription>
                  Smart controls for lighting, temperature, and amenities - personalized to each guest
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <CardTitle>Guest Communication</CardTitle>
                <CardDescription>
                  Unified messaging platform for seamless communication throughout the guest journey
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-orange-500 transition-all duration-300 hover:shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <CardTitle>Revenue Optimization</CardTitle>
                <CardDescription>
                  Maximize upsell opportunities and ancillary revenue with intelligent recommendations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Industry-leading technology backed by exceptional service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Seamless Integration
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Works with your existing PMS, POS, and hotel systems. Get up and running in days, not months.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Proven ROI
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Average 35% increase in ancillary revenue and 50% reduction in operational costs within 6 months.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    24/7 Expert Support
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Dedicated support team available around the clock. Average response time under 5 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    Continuous Innovation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Regular updates and new features based on industry trends and customer feedback.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl shadow-2xl transform rotate-3 opacity-20"></div>
              <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">500+</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-2">Hotels & Resorts</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400">2M+</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-2">Happy Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-pink-600 dark:text-pink-400">98%</div>
                  <div className="text-gray-600 dark:text-gray-300 mt-2">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Guest Experience?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join hundreds of hotels already delivering exceptional experiences with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-gray-100">
              Schedule a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2025 Guest Experience Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
