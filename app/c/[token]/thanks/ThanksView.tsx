'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Sparkles,
  Calendar,
  DoorOpen,
  ArrowRight,
  Gift,
  Utensils,
  Phone
} from 'lucide-react';

type ThanksViewProps = {
  bookingData: {
    confirmationNumber: string;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    totalPaid?: number;
    guestName: string;
  };
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

export default function ThanksView({ bookingData }: ThanksViewProps) {
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -20,
                opacity: 1,
              }}
              animate={{
                y: window.innerHeight + 20,
                opacity: 0,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

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

        {/* Success Icon with Animation */}
        <motion.div
          className="flex justify-center mb-6"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1],
            }}
          >
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border-2 border-green-400">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
            <motion.div
              className="absolute -top-2 -right-2"
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            >
              <Sparkles className="w-8 h-8 text-amber-400" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto w-full space-y-6">
          {/* Success Message */}
          <motion.div variants={itemVariants} className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold text-green-400">
              Check-in Complete!
            </h1>
            <p className="text-2xl font-semibold">
              Welcome, {bookingData.guestName}!
            </p>
            <p className="text-white/80 text-lg">
              Your room is ready and we can't wait to host you
            </p>
          </motion.div>

          {/* Booking Confirmation Card */}
          <motion.div
            className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold mb-4 text-center">
              Booking Confirmation
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider">Confirmation</p>
                <p className="font-bold text-lg">{bookingData.confirmationNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <DoorOpen className="w-3 h-3" /> Room
                </p>
                <p className="font-bold text-lg">{bookingData.roomNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check-in
                </p>
                <p className="font-semibold">{bookingData.checkIn}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-white/60 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Check-out
                </p>
                <p className="font-semibold">{bookingData.checkOut}</p>
              </div>
            </div>

            {bookingData.totalPaid && bookingData.totalPaid > 0 && (
              <>
                <div className="border-t border-white/20 my-4" />
                <div className="text-center">
                  <p className="text-sm text-white/60 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold text-green-400">
                    {bookingData.totalPaid.toFixed(2)} SAR
                  </p>
                </div>
              </>
            )}
          </motion.div>

          {/* What's Next Card */}
          <motion.div
            className="backdrop-blur-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-400/30 shadow-xl"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              What's Next?
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>you can access directly just say u have checkd-in early</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p>Your room will be ready for check-in at 3:00 PM</p>
              </div>
              <div className="flex items-start gap-3">
                <Utensils className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p>Access the Guest Portal to order room service and minibar</p>
              </div>
              <div className="flex items-start gap-3">
                <Gift className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p>Resturant time from 10 to 7</p>
              </div>
              {/* <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <p>24/7 concierge service available at your convenience</p>
              </div> */}
            </div>
          </motion.div>

          {/* CTA - Guest Portal Access */}
          <motion.div variants={itemVariants} className="pt-4 space-y-4">
            <button
              onClick={() => router.push('/guest-app')}
              className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 px-6 rounded-full hover:from-amber-500 hover:to-orange-600 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Access Your Guest Portal
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* <p className="text-center text-white/70 text-sm">
              Manage your entire stay from one convenient place
            </p> */}
          </motion.div>

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="text-center text-white/60 text-sm pt-6 border-t border-white/10"
          >
            <p>A confirmation email has been sent to your email address</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
