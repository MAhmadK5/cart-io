'use client'; // Required for Framer Motion

import { motion } from 'framer-motion';

export default function AmoebaBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10 bg-zinc-950 pointer-events-none">
      {/* Container to center and blur the blobs */}
      <div className="relative w-full h-full flex items-center justify-center filter blur-[100px] md:blur-[130px]">
        
        {/* Blue Amoeba - Left Side */}
        <motion.div
          className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-blue-600/25 rounded-full opacity-70"
          animate={{
            x: [-150, 100, -50], // Moves horizontally
            y: [0, -100, 50],    // Moves vertically
            scale: [1, 1.3, 0.9, 1.1], // Pulses
            rotate: [0, 60, -60, 0],   // Slow rotation
          }}
          transition={{
            duration: 25, // Very slow, fluid movement
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            transformOrigin: 'center center',
          }}
        />

        {/* Orange Amoeba - Right Side */}
        <motion.div
          className="absolute w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-orange-600/20 rounded-full opacity-60"
          animate={{
            x: [150, -100, 50],  // Moves the opposite direction of blue
            y: [50, 150, -100, 0],
            scale: [1, 1.2, 0.8, 1], // Different pulse rate
            rotate: [0, -90, 90, 0],
          }}
          transition={{
            duration: 30, // Different duration makes them feel independent
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
            delay: 2, // Slight delay so they don't start at the same time
          }}
          style={{
            transformOrigin: 'center center',
          }}
        />
        
        {/* Optional: Add a third smaller neutral blob in the center to help blending */}
        <motion.div
          className="absolute w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-zinc-800/40 rounded-full opacity-50"
          animate={{
            y: [-50, 50, -50],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}