"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import type { FrontendTenant } from "@/lib/payload/types";

const EXPO_OUT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.25, 0.1, 0.25, 1] as const;

function splitDisplayName(displayName: string): string[] {
  const trimmed = displayName.trim();
  if (!trimmed) return [displayName];
  const parts = trimmed.split(/\s+/);
  if (parts.length <= 1) return parts;
  const [first, ...rest] = parts;
  return first ? [first, rest.join(" ")] : parts;
}

export default function Hero({ tenant }: { tenant: FrontendTenant }) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const founded = tenant.branding?.founded ?? null;
  const nameParts = splitDisplayName(tenant.displayName);
  const taglinePrefix = founded ? `Osnovan ${founded}.` : tenant.displayName;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[calc(100svh-5.5rem)] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy md:min-h-[calc(100vh-5.5rem)]"
    >
      {/* Background team photo */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={reduced ? undefined : { y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.28 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <Image
          src="/momcad.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      {/* Navy gradient for legibility */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-navy/70 via-brand-navy/40 to-brand-navy/90" />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        >
          <Image
            src="/grb-vrapce.png"
            alt=""
            width={56}
            height={56}
            priority
            className="h-12 w-12 object-contain md:h-14 md:w-14"
          />
          <p className="text-[0.6rem] font-medium uppercase tracking-[0.3em] text-brand-yellow sm:text-xs sm:tracking-[0.4em]">
            {taglinePrefix}
          </p>
        </motion.div>

        <motion.h1
          aria-label={tenant.displayName}
          className="mt-8 select-none text-balance font-black uppercase leading-[0.95] tracking-tighter text-white md:mt-10"
        >
          {nameParts.map((part, idx) => (
            <span key={part} className="block overflow-hidden">
              <motion.span
                className={`block text-[16vw] md:text-[13vw] ${
                  idx === nameParts.length - 1 ? "text-brand-yellow" : "text-white"
                }`}
                initial={{ y: reduced ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + idx * 0.15,
                  ease: EXPO_OUT,
                }}
              >
                {part}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        {tenant.branding?.motto && (
          <motion.p
            className="mt-6 max-w-md text-sm font-medium uppercase tracking-[0.25em] text-white/70 sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8, ease: EASE }}
          >
            {tenant.branding.motto}
          </motion.p>
        )}
      </motion.div>

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-2 md:bottom-10"
        style={reduced ? undefined : { opacity: indicatorOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4, ease: EASE }}
      >
        <span className="text-[0.55rem] font-medium uppercase tracking-[0.4em] text-white/60">
          Istraži
        </span>
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
          }}
        >
          <ArrowDown className="h-4 w-4 text-brand-yellow" strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}
