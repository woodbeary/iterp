'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { CheckCircle, Cog, Zap, Menu, X } from 'lucide-react'

export function LandingPageComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">IA</span>
            </div>
            <span className="font-bold text-xl text-gray-900">The Interpreting App</span>
            <span className="text-xs font-semibold text-white bg-green-400 px-2 py-1 rounded-full">BETA</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">About</Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Pricing</Link>
            <Link 
              href="/get-started" 
              className="text-sm font-medium bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
          </nav>
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white">
          <div className="container mx-auto px-4 py-8">
            <nav className="flex flex-col space-y-6">
              <Link href="#" className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors">About</Link>
              <Link href="#" className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors">Features</Link>
              <Link href="#" className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors">Pricing</Link>
              <Link 
                href="/get-started" 
                className="text-2xl font-medium bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors text-center"
              >
                Book Now
              </Link>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-grow pt-20">
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container mx-auto px-4 text-center"
          >
            <h1 className="text-6xl font-bold mb-8 text-gray-900 leading-tight">One easy app for all<br />your interpreting needs</h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Connect with professional interpreters instantly, anytime, anywhere. Experience seamless communication like never before.</p>
            <Link 
              href="/get-started" 
              className="bg-blue-600 text-white px-10 py-4 rounded-full font-medium text-lg hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Get Started <span className="ml-2">&gt;</span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 mt-16"
          >
            <Image src="/placeholder.svg?height=600&width=1200" width={1200} height={600} alt="App interface" className="rounded-lg shadow-2xl mx-auto" />
          </motion.div>
        </section>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-20 text-gray-900">We connect interpreters and<br />clients the modern way</h2>
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { icon: CheckCircle, title: "Easy to use app", description: "Simple and intuitive interface for all users" },
                { icon: Cog, title: "Intelligent algorithms", description: "Smart matching for optimal interpreter-client pairing" },
                { icon: Zap, title: "Confirmation in seconds", description: "Quick booking process for immediate service" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <feature.icon className="w-16 h-16 mx-auto mb-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-32 bg-gray-50">
          <div className="container mx-auto px-4">
            {[
              { title: "for Deaf", heading: "Instant appointments customized for you.", description: "Tell us when, where, and what you need, then we'll arrange it for you in seconds." },
              { title: "for Interpreters", heading: "Expand your reach and work on your terms.", description: "Set your availability and preferences, then watch the appointments roll in." },
              { title: "for Organizations", heading: "Quick and effortless management.", description: "We handle the logistics and notifications, you just have to confirm them." }
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center mb-32 last:mb-0`}
              >
                <div className="md:w-1/2 mb-8 md:mb-0 md:px-8">
                  <h3 className="text-blue-600 font-semibold mb-2">{section.title}</h3>
                  <h2 className="text-4xl font-bold mb-6 text-gray-900">{section.heading}</h2>
                  <p className="text-xl text-gray-600 mb-8">{section.description}</p>
                  <Link href="#" className="text-blue-600 font-medium text-lg hover:underline">
                    Learn more &gt;
                  </Link>
                </div>
                <div className="md:w-1/2">
                  <Image src="/placeholder.svg?height=400&width=600" width={600} height={400} alt={`${section.title} interface`} className="rounded-lg shadow-xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-32 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-8">Ready to get started?</h2>
            <p className="text-xl mb-12 max-w-2xl mx-auto">Join thousands of satisfied users and experience the future of interpreting services today.</p>
            <Link 
              href="/get-started" 
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-medium text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Sign Up Now <span className="ml-2">&gt;</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">IA</span>
                </div>
                <span className="font-bold text-xl">The Interpreting App</span>
              </div>
              <p className="text-gray-400">Connecting interpreters and clients seamlessly.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 The Interpreting App. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
