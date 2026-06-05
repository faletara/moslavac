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

/** Fina filmska grain tekstura (SVG fractal noise) — daje dubinu navy podlozi. */
const GRAIN_URL =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const crestY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-[calc(100svh-5.5rem)] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy md:min-h-[calc(100vh-5.5rem)]"
    >
      {/* Bolnica Vrapče — povijesni motiv kluba, usidren na dnu kao "tlo" */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-40 h-[64%]"
        style={reduced ? undefined : { y: bgY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <Image
          src="/bolnica.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%] brightness-[0.82]"
        />
      </motion.div>
      {/* Navy fade preko zgrade — vrh navy (za tipografiju), dno propušta zgradu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-30 h-[64%] bg-gradient-to-t from-brand-navy/35 via-brand-navy/85 to-brand-navy"
      />

      {/* Brand glow — topla žuta gore */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-[18%] left-1/2 -z-20 h-[55vmax] w-[55vmax] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,203,5,0.20), rgba(255,203,5,0) 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, x: ["-50%", "-42%", "-50%"], y: [0, 24, 0] }
        }
        transition={
          reduced
            ? { duration: 1.4, ease: EASE }
            : {
                opacity: { duration: 1.4, ease: EASE },
                x: { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                y: { duration: 13, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }
        }
      />
      {/* Brand glow — sky plava dolje */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-[22%] left-[12%] -z-20 h-[48vmax] w-[48vmax] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(27,160,224,0.22), rgba(27,160,224,0) 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={
          reduced
            ? { opacity: 1 }
            : { opacity: 1, x: [0, 36, 0], y: [0, -20, 0] }
        }
        transition={
          reduced
            ? { duration: 1.4, ease: EASE }
            : {
                opacity: { duration: 1.4, ease: EASE },
                x: { duration: 19, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                y: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }
        }
      />

      {/* Grb kao suptilni watermark iza tipografije */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[78vmin] w-[78vmin] -translate-x-1/2 -translate-y-1/2"
        style={reduced ? undefined : { y: crestY }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        <Image
          src="/grb-vrapce.png"
          alt=""
          fill
          priority
          sizes="78vmin"
          className="object-contain"
        />
      </motion.div>

      {/* Vignette + grain za dubinu i čitljivost */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,14,26,0.55)_100%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN_URL }}
      />

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center px-6 text-center"
      >
        {/* Editorial eyebrow: linija — osnovan — linija */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: reduced ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-brand-yellow sm:block" />
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-brand-yellow sm:text-xs">
            {founded ? `Osnovan ${founded}.` : tenant.displayName}
          </p>
          <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-brand-yellow sm:block" />
        </motion.div>

        <motion.h1
          aria-label={tenant.displayName}
          className="mt-7 select-none text-balance font-black uppercase leading-[0.9] tracking-tighter text-white md:mt-9"
        >
          {nameParts.map((part, idx) => (
            <span key={part} className="block overflow-hidden py-[0.06em]">
              <motion.span
                className={`block text-[17vw] md:text-[13.5vw] ${
                  idx === nameParts.length - 1
                    ? "bg-gradient-to-b from-brand-yellow to-brand-yellow-dark bg-clip-text text-transparent drop-shadow-[0_8px_40px_rgba(255,203,5,0.25)]"
                    : "text-white"
                }`}
                initial={{ y: reduced ? 0 : "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.3 + idx * 0.14,
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
            className="mt-7 max-w-md text-sm font-medium uppercase tracking-[0.28em] text-white/65 sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.95, ease: EASE }}
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
        transition={{ duration: 0.6, delay: 1.5, ease: EASE }}
      >
        <span className="text-[0.55rem] font-medium uppercase tracking-[0.4em] text-white/55">
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
