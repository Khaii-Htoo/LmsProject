// components/MobileNav.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion"; // Import Variants type
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // --- Framer Motion Variants with proper typing ---

  const hamburgerVariants: Variants = {
    open: {
      rotate: 45,
      y: 8,
      transition: {
        ease: [0.4, 0.0, 0.2, 1], // Use cubic bezier array instead of string
        duration: 0.4,
      },
    },
    closed: {
      rotate: 0,
      y: 0,
      transition: {
        ease: [0.4, 0.0, 0.2, 1],
        duration: 0.4,
      },
    },
  };

  const middleLineVariants: Variants = {
    open: {
      opacity: 0,
      transition: {
        ease: [0.4, 0.0, 0.2, 1],
        duration: 0.2,
      },
    },
    closed: {
      opacity: 1,
      transition: {
        ease: [0.4, 0.0, 0.2, 1],
        duration: 0.2,
      },
    },
  };

  const drawerVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        ease: [0.0, 0.0, 0.2, 1], // easeOut equivalent
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
    closed: {
      x: "100%",
      opacity: 0,
      transition: {
        ease: [0.4, 0.0, 1, 1], // easeIn equivalent
        duration: 0.4,
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const drawerItemVariants: Variants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        ease: [0.0, 0.0, 0.2, 1],
        duration: 0.5,
      },
    },
    closed: {
      x: 50,
      opacity: 0,
      transition: {
        ease: [0.4, 0.0, 1, 1],
        duration: 0.3,
      },
    },
  };

  const overlayVariants: Variants = {
    open: {
      opacity: 1,
      transition: {
        ease: [0.0, 0.0, 0.2, 1],
        duration: 0.4,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        ease: [0.4, 0.0, 1, 1],
        duration: 0.4,
      },
    },
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-12 h-12 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300 hover:bg-muted/30 relative"
        aria-label="Toggle Menu"
      >
        {/* Top line */}
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={hamburgerVariants}
          className="w-6 h-0.5 bg-primary rounded-full absolute origin-center"
          style={{ top: "50%", marginTop: "-6px" }} // Adjust positioning
        />
        {/* Middle line */}
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={middleLineVariants}
          className="w-6 h-0.5 bg-primary rounded-full"
        />
        {/* Bottom line */}
        <motion.div
          animate={isOpen ? "open" : "closed"}
          variants={hamburgerVariants}
          className="w-6 h-0.5 bg-primary rounded-full absolute origin-center"
          style={{ top: "50%", marginTop: "6px" }} // Adjust positioning
        />
      </button>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          animate="open"
          initial="closed"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Side Drawer Menu */}
      <motion.aside
        variants={drawerVariants}
        animate={isOpen ? "open" : "closed"}
        initial="closed"
        className="fixed top-0 right-0 h-screen bg-black bottom-0 z-40 w-3/4 max-w-sm border-l border-border/50 shadow-xl flex flex-col px-6 py-8"
      >
        {/* Header */}
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
              onClick={() => setIsOpen(false)} // Close menu on navigation
            >
              Home
            </Link>
          </motion.div>
          <motion.div variants={drawerItemVariants} className="text-left">
            <Link
              href="/courses"
              className="text-2xl font-semibold hover:text-primary transition-colors block py-2"
              onClick={() => setIsOpen(false)}
            >
              Courses
            </Link>
          </motion.div>
          <motion.div variants={drawerItemVariants} className="text-left">
            <Link
              href="/dashboard"
              className="text-2xl font-semibold hover:text-primary transition-colors block py-2"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          </motion.div>

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
