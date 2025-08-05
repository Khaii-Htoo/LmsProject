"use client";

import { useState } from "react";
import {
  MessageCircle,
  Send,
  Facebook,
  Plus,
  MessageCircleIcon,
  X, // Placeholder for initial trigger icon
} from "lucide-react";
import { IconBrandTiktok } from "@tabler/icons-react";

// TikTok icon placeholder
const TikTokIcon = () => (
  <div className="w-5 h-5 rounded-sm bg-white flex items-center justify-center">
    <span className="text-black font-bold text-xs">T</span>
  </div>
);

interface IconData {
  id: string;
  icon: React.ReactNode;
  bgColor: string;
  hoverColor: string;
  name: string;
  delay: number;
  angle: number;
}

const socialIcons: IconData[] = [
  {
    id: "facebook",
    icon: <Facebook className="w-5 h-5" />,
    bgColor: "bg-gradient-to-br from-purple-600 to-pink-500",
    hoverColor: "hover:from-purple-700 hover:to-pink-600",
    name: "Facebook",
    delay: 0,
    angle: 180, // Bottom
  },
  {
    id: "telegram",
    icon: <Send className="w-5 h-5" />,
    bgColor: "bg-black",
    hoverColor: "hover:bg-gray-800",
    name: "Telegram",
    delay: 100,
    angle: 225, // Bottom-left
  },
  {
    id: "tiktok", // The message icon is now part of the set
    icon: <IconBrandTiktok className="w-5 h-5" />,
    bgColor: "bg-blue-500",
    hoverColor: "hover:bg-blue-600",
    name: "Message",
    delay: 150, // Adjusted delay
    angle: 270, // Left
  },
];

export default function MessageIcons() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);

  const handleExpand = () => {
    if (showCloseButton) {
      return handleClose();
    }
    if (isExpanded) return; // Prevent re-triggering while animating

    setIsExpanded(true);
    // Show close button after the icons have expanded (adjust timing as needed)
    setTimeout(() => {
      setShowCloseButton(true);
    }, 600);
  };

  const handleClose = () => {
    setShowCloseButton(false);
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Initial Trigger Icon (e.g., Plus sign) */}
        {
          <div className="relative z-10">
            <div
              onClick={handleExpand}
              className="relative group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white transform transition-all duration-300 ease-out group-hover:scale-110 shadow-lg">
                {showCloseButton ? (
                  <X className="w-6 h-6" />
                ) : (
                  <MessageCircleIcon className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
        }
        {socialIcons.map((iconData, index) => {
          const radius = 80;
          const angleInRadians = (iconData.angle * Math.PI) / 180;
          const x = Math.cos(angleInRadians) * radius;
          const y = Math.sin(angleInRadians) * radius;

          return (
            <div
              key={iconData.id}
              className={`
                absolute top-4/6 left-4/6 transform -translate-x-2/6 -translate-y-2/6
                transition-all duration-500 ease-out
                ${
                  isExpanded
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-50 pointer-events-none"
                }
              `}
              style={{
                // Apply the calculated translation and scale
                transform: `translate(-50%, -50%) translate(${isExpanded ? x : 0}px, ${isExpanded ? y : 0}px)`,
                // Stagger the animation appearance
                transitionDelay: isExpanded ? `${iconData.delay}ms` : "0ms",
              }}
            >
              <div className="relative group cursor-pointer">
                {/* Icon Button */}
                <div
                  className={`
                  w-12 h-12 rounded-full ${iconData.bgColor} ${iconData.hoverColor}
                  flex items-center justify-center text-white
                  transform transition-all duration-300 ease-out
                  group-hover:scale-110
                  shadow-lg
                `}
                >
                  {iconData.icon}
                </div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none">
                  <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg">
                    {iconData.name}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
