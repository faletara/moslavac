"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations";

interface PlayerGridProps {
  children: React.ReactNode;
}

export function PlayerGrid({ children }: PlayerGridProps) {
  return (
    <StaggerContainer
      className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-4 lg:gap-x-8"
      staggerChildren={0.06}
    >
      {children}
    </StaggerContainer>
  );
}

export function PlayerGridItem({ children }: { children: React.ReactNode }) {
  return (
    <StaggerItem>
      <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
        {children}
      </motion.div>
    </StaggerItem>
  );
}
