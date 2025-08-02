"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "./_components/nav-bar";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";

// Re-define FeatureCard here if it's only used in page.tsx
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="p-6 border border-border/30 rounded-lg bg-card hover:bg-card/50 transition-all duration-300 ease-in-out flex flex-col items-center text-center"
    >
      <div className="mb-4 p-3 bg-muted/20 rounded-full inline-block">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default function HomePage() {
  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden">
      <Navbar /> {/* Render the Navbar component */}
      {/* Hero Section */}
      <section className="container mx-auto flex flex-col items-center justify-center min-h-[calc(80vh-80px)] py-16 px-4 md:px-8">
        <div className="text-center">
          {/* Animated Gradient Border Tag */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="relative inline-block px-4 py-1.5 mb-4 "
          >
            <div className="z-10 flex  items-center justify-center">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                  <span>✨The Future of Online Education</span>
                  <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.7 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-foreground to-muted-foreground text-transparent bg-clip-text"
          >
            Elevate your Learning Experience
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.9 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto"
          >
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere.
          </motion.p>
          <div className="flex justify-center space-x-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.1 }}
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Courses
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 1.3 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10"
              >
                Sign in
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-background to-accent/50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-4xl font-bold text-center mb-12"
          >
            Key Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              title="Comprehensive Courses"
              description="Access a vast library of courses covering diverse subjects."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H2zm8 10h6a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H10zm0-10h6a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4H10z"></path>
                </svg>
              }
            />
            <FeatureCard
              title="Interactive Learning"
              description="Engage with dynamic content and hands-on exercises."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-500"
                >
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
                  <path d="M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path>
                  <path d="M20.74 10.12a11.93 11.93 0 0 0-3.53-3.53"></path>
                </svg>
              }
            />
            <FeatureCard
              title="Progress Tracking"
              description="Monitor your learning journey with detailed analytics."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-yellow-500"
                >
                  <path d="M12 1v10.5a2.5 2.5 0 0 0 5 0V2a9 9 0 1 1-9 9h10.5"></path>
                </svg>
              }
            />
            <FeatureCard
              title="Community Support"
              description="Connect with peers and instructors for collaborative learning."
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-purple-500"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 20v-3a2 2 0 0 0-2-2h-2"></path>
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}
