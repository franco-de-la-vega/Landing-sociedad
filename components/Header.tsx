"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-x-0 border-t-0" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-4 sm:px-8">
        <Logo className="h-7 w-7 shrink-0 text-[var(--color-accent)] sm:h-8 sm:w-8" />
        <span className="min-w-0 text-[11px] font-bold leading-tight tracking-[-0.01em] sm:text-[15px]">
          Instituto Latinoamericano de Formación Comercial
        </span>
      </div>
    </motion.header>
  );
}
