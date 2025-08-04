"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import MobileNav from "./mobile-nav";
import { authClient } from "@/lib/auth-client";
import UserDropdown from "./user-dropdown";

const Navbar: React.FC = () => {
  const { data: session } = authClient.useSession();

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 backdrop-blur-sm bg-background/50 border-b border-border/50"
      >
        <div className="container relative mx-auto flex justify-between items-center py-4 px-4 md:px-8">
          {/* Left Side: Logo and Title */}
          <div className="flex items-center space-x-4">
            <motion.svg
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary h-8 w-8"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </motion.svg>
            <Link
              href="/"
              className="text-2xl font-bold hover:text-primary transition-colors"
            >
              Khai-LMS
            </Link>
            <div className="hidden md:flex items-center space-x-3">
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link
                  href="/home"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Home
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link
                  href="/courses"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Courses
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Dashboard
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Right Side: Theme Toggle, Login, Get Started */}
          <div className="flex items-center space-x-3">
            <ThemeToggle /> {/* Your theme toggle component */}
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {!session && (
                  <Link href={"/login"}>
                    <Button
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary hover:bg-transparent"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </motion.div>

              {session ? (
                <UserDropdown
                  email={session.user.email}
                  image={session.user.image!}
                  name={session.user.name}
                />
              ) : (
                <Link href={"/login"}>
                  <Button className="bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
            {/* Mobile Hamburger Menu */}
            <MobileNav />
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;
