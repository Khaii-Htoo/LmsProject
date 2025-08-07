// pages/not-admin.tsx or app/not-admin/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Home,
  ArrowLeft,
  Sun,
  Moon,
  Mail,
  AlertTriangle,
  Lock,
} from "lucide-react";

export default function NotAdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 flex items-center justify-center p-4 transition-all duration-500 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-10 left-10 animate-spin-slow">
          <Lock className="w-8 h-8 text-red-400/30" />
        </div>
        <div className="absolute top-1/4 right-20 animate-bounce delay-1000">
          <AlertTriangle className="w-6 h-6 text-orange-400/30" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-pulse delay-2000">
          <ShieldAlert className="w-10 h-10 text-red-400/30" />
        </div>
        <div className="absolute bottom-1/3 right-10 animate-spin-slow delay-3000">
          <Lock className="w-7 h-7 text-purple-400/30" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg w-full relative z-10">
        {/* Floating Background Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-56 h-56 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl animate-ping"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-800/20 p-8 text-center animate-fade-in-up">
          {/* Main Icon with Multiple Animation Layers */}
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              {/* Outer ripple */}
              <div className="absolute inset-0 w-28 h-28 bg-red-500/20 rounded-full animate-ping"></div>
              {/* Middle ripple */}
              <div className="absolute inset-2 w-24 h-24 bg-red-500/30 rounded-full animate-ping delay-300"></div>
              {/* Inner circle */}
              <div className="relative w-28 h-28 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center animate-bounce shadow-2xl">
                <ShieldAlert className="w-14 h-14 text-white animate-pulse" />
              </div>
              {/* Floating mini icons */}
              <div className="absolute -top-2 -right-2 animate-float">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-2 -left-2 animate-float delay-1000">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
                  <Lock className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-slide-up">
                Admin Access Only
              </h1>
              <div className="flex justify-center animate-slide-up delay-100">
                <div className="w-32 h-1.5 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-full"></div>
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4 animate-slide-up delay-200">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                You are not an admin
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                This area is restricted to administrators only.
              </p>
            </div>

            {/* Error Box */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/30 dark:to-pink-950/30 border border-red-200 dark:border-red-800/50 rounded-xl p-4 animate-slide-up delay-300">
              <div className="flex items-center justify-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />
                <p className="text-red-700 dark:text-red-300 font-semibold">
                  Access Denied: Admin privileges required
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center gap-3 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl animate-slide-up delay-400"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-semibold">Go Back</span>
            </button>

            <button
              onClick={() => router.push("/")}
              className="group flex items-center flex-1 justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl animate-slide-up delay-500"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Return Home</span>
            </button>
          </div>

          {/* Contact Section */}
          <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-gray-700/50 animate-slide-up delay-600">
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <Mail className="w-4 h-4 animate-pulse" />
              <p className="text-sm">
                Need admin access?{" "}
                <a
                  href="mailto:admin@company.com"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold hover:underline transition-all duration-200"
                >
                  Contact Administrator
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="animate-float-slow">
            <div className="absolute top-16 right-16 w-3 h-3 bg-purple-400/60 rounded-full shadow-lg"></div>
          </div>
          <div className="animate-float-slow delay-1000">
            <div className="absolute bottom-32 left-16 w-2 h-2 bg-blue-400/60 rounded-full shadow-lg"></div>
          </div>
          <div className="animate-float-slow delay-2000">
            <div className="absolute top-1/2 right-8 w-1.5 h-1.5 bg-pink-400/60 rounded-full shadow-lg"></div>
          </div>
          <div className="animate-float-slow delay-3000">
            <div className="absolute top-20 left-1/3 w-2.5 h-2.5 bg-indigo-400/60 rounded-full shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
