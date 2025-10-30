'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift,
  X,
  Plus,
  Minus,
} from 'lucide-react';

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type EnhanceStayViewProps = {
  token: string;
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

export default function EnhanceStayView({ token }: EnhanceStayViewProps) {
  const router = useRouter();
  const [showGiftPopup, setShowGiftPopup] = useState(true);
  const [selectedServices, setSelectedServices] = useState<Record<string, number>>({});

  // Services data
  const services: Service[] = [
    {
      id: 'flowers',
      name: 'Premium Flowers',
      description: 'Beautiful fresh flower arrangement to brighten your room with elegance',
      price: 150,
      image: '/flowers_item.jpeg',
      category: 'decoration',
    },
    {
      id: 'spa',
      name: 'Spa & Wellness',
      description: 'Relaxing spa treatment with aromatherapy and professional massage',
      price: 500,
      image: '/care_item.jpeg',
      category: 'wellness',
    },
    {
      id: 'transfer',
      name: 'Airport Transfer',
      description: 'Luxury car service to and from the airport with professional driver',
      price: 300,
      image: '/pickfrom_airport.jpeg',
      category: 'transportation',
    },
    // {
    //   id: 'upgrade',
    //   name: 'Room Upgrade',
    //   description: 'Upgrade to our luxurious Deluxe King Room with stunning views',
    //   price: 800,
    //   image: '/delux_room.jpeg',
    //   category: 'accommodation',
    // },
    // {
    //   id: 'checkout',
    //   name: 'Late Checkout',
    //   description: 'Extend your stay until 6 PM and enjoy more time to relax',
    //   price: 200,
    //   image: '/hotel_bg_test.jpeg',
    //   category: 'convenience',
    // },
    // {
    //   id: 'care-package',
    //   name: 'Wellness Package',
    //   description: 'Complete care package with premium amenities and treatments',
    //   price: 450,
    //   image: '/care_item.jpeg',
    //   category: 'wellness',
    // },
  ];

  // Calculate total
  const totalItems = Object.values(selectedServices).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(selectedServices).reduce((sum, [id, qty]) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.price || 0) * qty;
  }, 0);

  const handleAddService = (serviceId: string) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: (prev[serviceId] || 0) + 1,
    }));
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => {
      const newQty = (prev[serviceId] || 0) - 1;
      if (newQty <= 0) {
        const { [serviceId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [serviceId]: newQty };
    });
  };

  const handleContinue = () => {
    // TODO: Save selected services to database
    router.push(`/c/${token}/guest-information`);
  };

  const handleSkip = () => {
    router.push(`/c/${token}/guest-information`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden pb-32">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hotel_bg_test.jpeg"
          alt="Hotel Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
      </div>

      {/* Gift Popup */}
      <AnimatePresence>
        {showGiftPopup && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGiftPopup(false)} />

            {/* Popup Card */}
            <motion.div
              className="relative backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20 shadow-2xl max-w-md w-full"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowGiftPopup(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Gift Icon with Animation */}
              <motion.div
                className="flex justify-center mb-6"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </motion.div>

              {/* Text */}
              <div className="text-center space-y-3">
                <h2 className="text-3xl font-bold text-white">
                  A Gift Awaits You!
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Enhance your stay with our exclusive services and make your experience truly unforgettable
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setShowGiftPopup(false)}
                className="mt-8 w-full bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 hover:scale-[1.02] shadow-xl"
              >
                Explore Services
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col min-h-screen px-6 py-12 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo */}
        <motion.div
          className="mb-8 flex justify-center"
          variants={itemVariants}
        >
          <Image
            src="/movenpick_logo.png"
            alt="Movenpick Hotel"
            width={180}
            height={60}
            priority
            className="object-contain"
          />
        </motion.div>

        {/* Page Title */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            ENHANCE YOUR STAY
          </h1>
          <p className="text-white/80 text-lg">
            Select special services to make your experience unforgettable
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => {
            const quantity = selectedServices[service.id] || 0;

            return (
              <motion.div
                key={service.id}
                className="group relative h-[400px] overflow-hidden rounded-2xl"
                variants={itemVariants}
                whileHover="hover"
                initial="rest"
                animate="rest"
              >
                {/* Background Image with Hover Zoom */}
                <motion.div
                  className="absolute inset-0"
                  variants={{
                    rest: { scale: 1 },
                    hover: { scale: 1.1 },
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </motion.div>

                {/* Glassmorphic Info Panel */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="backdrop-blur-md bg-white/10 rounded-2xl p-5 border border-white/20 transition-all duration-300 group-hover:bg-white/15">
                    {/* Service Name & Description */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-white/80 leading-relaxed line-clamp-2 mb-4">
                      {service.description}
                    </p>

                    {/* Price & Controls */}
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-amber-300">
                        {service.price} SAR
                      </p>

                      {/* Add/Remove Quantity Controls */}
                      {quantity === 0 ? (
                        <button
                          onClick={() => handleAddService(service.id)}
                          className="h-10 px-4 bg-amber-400/20 hover:bg-amber-400 hover:text-black backdrop-blur-sm text-amber-300 font-semibold rounded-full border border-amber-400/50 transition-all duration-300 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="h-9 w-9 rounded-full border border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-xl font-bold text-white">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleAddService(service.id)}
                            className="h-9 w-9 rounded-full border border-amber-400 bg-transparent text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 flex items-center justify-center"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Sticky Bottom Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-xl border-t border-white/20 px-6 py-4"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Summary */}
          {totalItems > 0 && (
            <div className="text-white text-center mb-4">
              <p className="text-sm text-white/70">
                {totalItems} service{totalItems !== 1 ? 's' : ''} selected
              </p>
              <p className="text-2xl font-bold text-amber-300">
                Total: {totalPrice} SAR
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSkip}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-full border border-white/30 transition-all duration-300"
            >
              Skip for Now
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 bg-[#F3EFE9] text-gray-900 font-bold py-4 px-6 rounded-full hover:bg-[#E8E4DD] transition-all duration-300 hover:scale-[1.02] shadow-xl"
            >
              Continue
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
