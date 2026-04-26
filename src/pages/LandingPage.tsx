import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, CreditCard, Box, Utensils, 
  BarChart3, Users, Megaphone, UserCheck,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Order Management",
    description: "Streamline your ordering process with real-time tracking and smart queuing.",
    icon: ShoppingBag,
    tags: ["Real-time tracking", "QR ordering", "Smart queue"]
  },
  {
    title: "Billing & Payments",
    description: "Hassle-free billing with auto GST calculation and UPI integration.",
    icon: CreditCard,
    tags: ["Auto GST", "UPI integration", "Instant billing"]
  },
  {
    title: "Inventory Management",
    description: "Keep track of your stock levels with automated low-stock alerts.",
    icon: Box,
    tags: ["Stock tracking", "Low stock alerts", "Auto updates"]
  },
  {
    title: "Business Analytics",
    description: "Gain deep insights into your sales performance and peak hours.",
    icon: BarChart3,
    tags: ["Sales reports", "Peak hours", "Profit insights"]
  },
  {
    title: "Staff Management",
    description: "Monitor staff performance and attendance with ease.",
    icon: UserCheck,
    tags: ["Attendance", "Roles", "Performance tracking"]
  }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 selection:bg-red-500/30">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070" 
            alt="Restaurant background" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-100/60 via-gray-100/40 to-gray-100" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-red-600 font-mono tracking-widest uppercase mb-4 text-sm md:text-base font-bold">
              Smart Restaurant Management System
            </h2>
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight text-gray-900">
              WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">LUX RESTO</span>
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              The all-in-one SaaS solution to elevate your restaurant operations, 
              boost efficiency, and delight your customers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
                >
                  Admin Login <ArrowRight size={20} />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-semibold border border-gray-200 transition-colors"
              >
                View Demo
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">Powerful Features</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Everything you need to manage your restaurant from a single, intuitive dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="p-8 rounded-3xl bg-gray-200 border border-gray-300 hover:border-red-500/50 transition-all group shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center mb-6 group-hover:bg-red-600 transition-colors">
                <feature.icon className="text-red-600 group-hover:text-white transition-colors" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-500 mb-6 font-light leading-relaxed">
                {feature.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 text-[10px] uppercase tracking-wider font-bold bg-gray-100 rounded-md text-gray-400 border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2026 Smart Restaurant Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
