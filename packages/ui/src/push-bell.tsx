"use client";

import * as React from "react";
import { Bell, BellRing, Check, Share, X } from "lucide-react";
import { cn } from "@/lib/utils";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const TENANT_SLUG = process.env.NEXT_PUBLIC_TENANT_SLUG ?? "";
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "";

const DISMISS_KEY = "push-prompt-dismissed";
const VISITS_KEY = "push-visits";
const PROMPT_AFTER_VISITS = 2;

type Status =
  | "unsupported"
  | "idle"
  | "subscribing"
  | "subscribed"
  | "denied";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    // iPadOS reports as Mac but has touch
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}

export function PushBell({ className }: { className?: string }) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [open, setOpen] = React.useState(false);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const iosNeedsInstall = isIOS() && !isStandalone();

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      !("PushManager" in window)
    ) {
      setStatus("unsupported");
      return;
    }

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => reg.pushManager.getSubscription())
      .then((sub) => {
        if (sub) setStatus("subscribed");
        else if (Notification.permission === "denied") setStatus("denied");
      })
      .catch(() => {
        /* registration failure — bell stays idle */
      });

    // One-time engagement prompt: only after a couple of visits.
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY) === "1";
      const visits = Number(localStorage.getItem(VISITS_KEY) ?? "0") + 1;
      localStorage.setItem(VISITS_KEY, String(visits));
      if (
        !dismissed &&
        visits >= PROMPT_AFTER_VISITS &&
        Notification.permission === "default"
      ) {
        setShowPrompt(true);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const dismissPrompt = React.useCallback(() => {
    setShowPrompt(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  const subscribe = React.useCallback(async () => {
    if (iosNeedsInstall) {
      setOpen(true);
      return;
    }
    if (!VAPID_PUBLIC_KEY || !CMS_URL || !TENANT_SLUG) {
      console.error("[push] missing NEXT_PUBLIC_VAPID_PUBLIC_KEY / CMS_URL / TENANT_SLUG");
      return;
    }
    setStatus("subscribing");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "idle");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
      const res = await fetch(`${CMS_URL}/api/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantSlug: TENANT_SLUG, subscription: sub.toJSON() }),
      });
      if (!res.ok) throw new Error(`subscribe failed: ${res.status}`);
      setStatus("subscribed");
      setShowPrompt(false);
    } catch (err) {
      console.error("[push] subscribe error", err);
      setStatus("idle");
    }
  }, [iosNeedsInstall]);

  if (status === "unsupported") return null;

  const subscribed = status === "subscribed";

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label={subscribed ? "Obavijesti uključene" : "Uključi obavijesti"}
        onClick={() => {
          if (subscribed) return;
          if (iosNeedsInstall) setOpen((v) => !v);
          else void subscribe();
        }}
        className="relative inline-flex size-9 items-center justify-center rounded-md text-current transition-colors hover:bg-foreground/10"
      >
        {subscribed ? (
          <BellRing className="size-5" />
        ) : (
          <Bell className="size-5" />
        )}
        {subscribed && (
          <Check className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-green-600 text-white" />
        )}
      </button>

      {/* iOS install instructions */}
      {open && iosNeedsInstall && (
        <Panel onClose={() => setOpen(false)}>
          <p className="font-semibold">Uključi obavijesti na iPhoneu</p>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm">
            <li>
              Dodirni <Share className="inline size-4 align-text-bottom" /> (Podijeli).
            </li>
            <li>Odaberi „Dodaj na početni zaslon”.</li>
            <li>Otvori aplikaciju s početnog zaslona i ponovno dodirni zvonce.</li>
          </ol>
        </Panel>
      )}

      {/* Engagement prompt */}
      {showPrompt && !open && !subscribed && (
        <Panel onClose={dismissPrompt}>
          <p className="font-semibold">Primaj obavijesti kluba</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Najava utakmica, rezultati i nove vijesti — odmah na tvoj uređaj.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => void subscribe()}
              disabled={status === "subscribing"}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {status === "subscribing" ? "Uključujem…" : "Uključi"}
            </button>
            <button
              type="button"
              onClick={dismissPrompt}
              className="rounded-md px-3 py-1.5 text-sm hover:bg-foreground/10"
            >
              Ne sad
            </button>
          </div>
        </Panel>
      )}
    </div>
  );
}

function Panel({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border bg-background p-4 text-foreground shadow-lg">
      <button
        type="button"
        aria-label="Zatvori"
        onClick={onClose}
        className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
      >
        <X className="size-4" />
      </button>
      {children}
    </div>
  );
}
