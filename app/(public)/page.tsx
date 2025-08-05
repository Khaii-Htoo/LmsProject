"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Navbar from "./_components/nav-bar";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "lucide-react";
import { MagicCard } from "@/components/magicui/magic-card";
import { featureKeyData } from "@/demoData";
import { useTheme } from "next-themes";
import MessageIcons from "./_components/social-icon";

// Re-define FeatureCard here if it's only used in page.tsx
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function HomePage() {
  const { theme } = useTheme();
  return (
    <div className="bg-background text-foreground min-h-screen overflow-hidden">
      <Navbar /> {/* Render the Navbar component */}
      {/* Hero Section */}
      <section className="container  mx-auto flex flex-col items-center justify-center min-h-[calc(80vh-80px)] py-16 px-4 md:px-8">
        <div className="text-center">
          {/* Animated Gradient Border Tag */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="relative inline-block px-4 py-1.5 mb-4 "
          >
            <div className="z-10 flex  items-center justify-center mt-10 md:mt-auto">
              <div
                className={cn(
                  "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
                )}
              >
                <AnimatedShinyText className="inline-flex items-center justify-center  px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
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
            {featureKeyData.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
              >
                <MagicCard
                  key={index}
                  className=" p-7 rounded-lg"
                  gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
                >
                  <div className="mb-4 p-3rounded-full inline-block">
                    {data.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">
                    {data.title}
                  </h3>
                  <p className="text-muted-foreground text-center">
                    {data.description}
                  </p>
                </MagicCard>
              </motion.div>
            ))}
            <MessageIcons />
          </div>
        </div>
      </section>
    </div>
  );
}
