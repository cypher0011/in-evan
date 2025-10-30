'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Phone, Mail, MessageCircle, Home, RefreshCcw } from 'lucide-react';

type ErrorViewProps = {
  message: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
    },
  },
};

export default function ErrorView({ message }: ErrorViewProps) {
  const router = useRouter();

  // Determine if this is a token error (can try again)
  const isTokenError = message.toLowerCase().includes('token') ||
                       message.toLowerCase().includes('expired') ||
                       message.toLowerCase().includes('invalid');

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-6 py-12 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div className="flex justify-center mb-8" variants={itemVariants}>
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Error Icon with Breathing Animation */}
        <motion.div
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-orange-400/50">
              <AlertCircle className="w-10 h-10 text-orange-400" />
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Apology Message */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              We're Sorry
            </h1>
            <p className="text-xl text-white/90">
              We sincerely apologize for the inconvenience
            </p>
          </motion.div>

          {/* Error Details Card */}
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl"
            variants={itemVariants}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-lg mb-2">What happened?</p>
                  <p className="text-white/80 leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>

              {isTokenError && (
                <>
                  <div className="border-t border-white/20 my-4" />
                  <div>
                    <p className="font-semibold mb-2 text-white/90">Possible reasons:</p>
                    <ul className="space-y-2 text-sm text-white/70">
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>Your check-in link may have expired</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>The link has already been used to complete check-in</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-orange-400 mt-1">•</span>
                        <span>There might be a temporary issue with your connection</span>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Support Contact Card */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-400/30 shadow-xl"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-4 text-center">
              We're Here to Help
            </h3>
            <p className="text-center text-white/90 mb-4 text-sm">
              Our support team is available 24/7 to assist you
            </p>

            <div className="space-y-3">
              {/* Phone */}
              <a
                href="tel:+966123456789"
                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Call Us</p>
                  <p className="text-sm text-white/70">+966 12 345 6789</p>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:support@movenpick-riyadh.com"
                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Email Us</p>
                  <p className="text-sm text-white/70">support@movenpick-riyadh.com</p>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/966123456789"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <div className="w-10 h-10 bg-green-600/30 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-white/70">Chat with us instantly</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Action Buttons */}
          {/* <motion.div variants={itemVariants} className="space-y-3 pt-4">
            {isTokenError && (
              <button
                onClick={() => router.refresh()}
                className="w-full bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </button>
            )}

            <button
              onClick={() => router.push('/')}
              className="w-full bg-white/10 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/30 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Return to Homepage
            </button>
          </motion.div> */}

          {/* Reassurance Message */}
          <motion.div
            variants={itemVariants}
            className="text-center text-white/70 text-sm pt-6 border-t border-white/10"
          >
            <p className="leading-relaxed">
              Don't worry! Our team will assist you immediately.
              <br />
              We look forward to welcoming you to Mövenpick Hotel Riyadh.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
