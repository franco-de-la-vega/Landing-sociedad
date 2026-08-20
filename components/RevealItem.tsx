"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

export default function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
