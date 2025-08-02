// components/MobileNav.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Using Lucide-react for a clean close icon

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Effect to manage body scroll when the menu is open/closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "unset"; // Re-enable scrolling
    }
    // Cleanup function: ensures scrolling is re-enabled if the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // --- Framer Motion Variants ---

  // Variants for the hamburger icon animation (lines)
  const hamburgerVariants = {
    // 'open' state defines the target animation values and its specific transition
    open: {
      rotate: 45, // Rotate the line clockwise
      y: 8, // Move the line up (adjust as needed for alignment)
      transition: { ease: "easeInOut", duration: 0.4 }, // Transition for THIS state
    },
    // 'closed' state defines the initial/default animation values and its transition
    closed: {
      rotate: 0, // Reset rotation
      y: 0, // Reset y position
      transition: { ease: "easeInOut", duration: 0.4 }, // Transition for THIS state
    },
  };

  // Variants for the middle line of the hamburger (fades out)
  const middleLineVariants = {
    open: {
      opacity: 0, // Make it disappear
      transition: { ease: "easeInOut", duration: 0.2 }, // Faster transition for fade-out
    },
    closed: {
      opacity: 1, // Make it appear
      transition: { ease: "easeInOut", duration: 0.2 },
    },
  };

  // Variants for the main menu drawer sliding in from the right
  const drawerVariants = {
    open: {
      x: 0, // Moves to the right edge (visible)
      opacity: 1,
      transition: {
        ease: "easeOut",
        duration: 0.4,
        when: "beforeChildren", // Wait for parent animation to start before animating children
        staggerChildren: 0.07, // Delay between each child item's animation
        delayChildren: 0.2, // Start child animations after parent is ready
      },
    },
    closed: {
      x: "100%", // Slides completely off-screen to the right
      opacity: 0,
      transition: {
        ease: "easeIn",
        duration: 0.4,
        when: "afterChildren", // Animate children out first
        staggerChildren: 0.05, // Faster exit stagger for children
        staggerDirection: -1, // Animate children in reverse order
      },
    },
  };

  // Variants for menu items within the drawer
  const drawerItemVariants = {
    open: {
      x: 0, // Moves to its final position
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.5 },
    },
    closed: {
      x: 50, // Moves slightly off-screen to the right before disappearing
      opacity: 0,
      transition: { ease: "easeIn", duration: 0.3 },
    },
  };

  // Variants for the overlay dimming effect
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: { ease: "easeOut", duration: 0.4 },
    },
    closed: {
      opacity: 0,
      transition: { ease: "easeIn", duration: 0.4 },
    },
  };

  // --- Component JSX ---

  return (
    <div className="md:hidden">
      {" "}
      {/* This container ensures the MobileNav is only visible on mobile screens */}
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)} // Toggle the menu state
        className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 hover:bg-muted/30 relative"
        aria-label="Toggle Menu"
      >
        {/* Hamburger Icon - Animated Lines */}
        <motion.div
          animate={isOpen ? "open" : "closed"} // Controls which variant is applied
          variants={hamburgerVariants} // Apply the defined variants
          className="w-6 h-0.5 bg-primary rounded-full absolute origin-center transform" // Base styles + transform origin
        ></motion.div>
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={middleLineVariants} // Apply the middle line variants
          className="w-6 h-0.5 bg-primary rounded-full" // Base styles
        ></motion.div>
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={hamburgerVariants} // Apply the same variants for symmetry
          className="w-6 h-0.5 bg-primary rounded-full absolute origin-center transform translate-y-2" // Base styles + y transform for spacing
        ></motion.div>
      </button>
      {/* Overlay - Conditionally Rendered */}
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          animate="open"
          initial="closed"
          onClick={() => setIsOpen(false)} // Close menu when overlay is clicked
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm" // Overlay styles
        />
      )}
      {/* Side Drawer Menu - Conditionally Rendered */}
      <motion.aside
        variants={drawerVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        className="fixed top-0 right-0 h-screen  bg-black bottom-0 z-40 w-3/4 max-w-sm  border-l border-border/50 shadow-xl flex flex-col px-6 py-8" // Drawer styling
      >
        {/* Header: Logo/Title and Close Button */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
          >
            Khai-LMS
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 hover:bg-muted/30"
            aria-label="Close Menu"
          >
            <X className="h-6 w-6 text-muted-foreground" />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav className="flex flex-col space-y-6">
          <motion.div variants={drawerItemVariants} className="text-left">
            <Link
              href="/home"
              className="text-2xl font-semibold hover:text-primary transition-colors block py-2"
            >
              Home
            </Link>
          </motion.div>
          <motion.div variants={drawerItemVariants} className="text-left">
            <Link
              href="/courses"
              className="text-2xl font-semibold hover:text-primary transition-colors block py-2"
            >
              Courses
            </Link>
          </motion.div>
          <motion.div variants={drawerItemVariants} className="text-left">
            <Link
              href="/dashboard"
              className="text-2xl font-semibold hover:text-primary transition-colors block py-2"
            >
              Dashboard
            </Link>
          </motion.div>

          {/* Button - Pushed to the bottom */}
          <motion.div variants={drawerItemVariants} className="mt-auto pt-6">
            <Button className="w-full py-3 text-lg rounded-lg">
              Get Started
            </Button>
          </motion.div>
        </nav>
      </motion.aside>
    </div>
  );
};

export default MobileNav;
