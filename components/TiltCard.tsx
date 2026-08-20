"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spx = useSpring(px, { stiffness: 200, damping: 22 });
  const spy = useSpring(py, { stiffness: 200, damping: 22 });

  const rotateX = useTransform(spy, [0, 1], [7, -7]);
  const rotateY = useTransform(spx, [0, 1], [-7, 7]);
  const shineX = useTransform(spx, [0, 1], [0, 100]);
  const shineY = useTransform(spy, [0, 1], [0, 100]);
  const shineBg = useTransform([shineX, shineY], ([sx, sy]: number[]) =>
    `radial-gradient(280px circle at ${sx}% ${sy}%, color-mix(in srgb, var(--color-text-primary) 12%, transparent), transparent 70%)`
  );

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleEnter = () => setHovered(true);
  const handleLeave = () => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      whileHover={{ y: -6 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={className}
    >
      {children}

      {/* halo que sigue el cursor */}
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0"
        style={{ background: shineBg }}
      />

      {/* barrido de luz diagonal, tipo reflejo en vidrio */}
      <motion.div
        aria-hidden
        initial={{ x: "-120%" }}
        animate={{ x: hovered ? "120%" : "-120%" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
        }}
      />
    </motion.div>
  );
}
