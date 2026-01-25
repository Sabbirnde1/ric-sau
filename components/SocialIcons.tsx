"use client";

import { motion } from "framer-motion";
import { Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

export default function SocialIcons() {
  const icons = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "hover:text-blue-500",
      link: "https://www.facebook.com/profile.php?id=61579883665026",
    },
    // {
    //   name: "Twitter",
    //   icon: Twitter,
    //   color: "hover:text-sky-400",
    //   link: "https://twitter.com/YourHandle",
    // },
    // {
    //   name: "LinkedIn",
    //   icon: Linkedin,
    //   color: "hover:text-blue-600",
    //   link: "https://linkedin.com/in/YourProfile",
    // },
    {
      name: "YouTube",
      icon: Youtube,
      color: "hover:text-red-500",
      link: "https://www.youtube.com/channel/UCHk4Hrc2EHId0d7WRjVQu7A",
    },
  ];

  return (
    <div className="flex items-center justify-center space-x-6 mt-6">
      {icons.map(({ name, icon: Icon, color, link }, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.2, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={() => window.open(link, "_blank")}
          className={`relative group cursor-pointer text-gray-400 ${color}`}
        >
          <Icon className="h-6 w-6" />

          {/* Tooltip */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
            {name}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
