import React, { useEffect, useRef, useState } from "react";

import { Desktop, Moon, Sun } from "@phosphor-icons/react";

const MODES = [
  { key: "light", label: "Light", Icon: Sun },
  { key: "dark", label: "Dark", Icon: Moon },
  { key: "system", label: "System", Icon: Desktop },
];

const CYCLE_ORDER = ["light", "dark", "system"];

const getInitialTheme = () => {
  if (typeof window === "undefined") return "system";
  return window.__percentoTheme || "system";
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getInitialTheme);
  const [nonce, setNonce] = useState(0);
  const [swapping, setSwapping] = useState(null);
  const swapTimeoutRef = useRef(null);

  const cycle = () => {
    const next =
      CYCLE_ORDER[(CYCLE_ORDER.indexOf(theme) + 1) % CYCLE_ORDER.length];
    setTheme(next);
    setNonce((current) => current + 1);
    window.__percentoSetTheme?.(next);

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      setSwapping({ prev: theme, current: next });
      if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
      swapTimeoutRef.current = setTimeout(() => {
        setSwapping(null);
      }, 300);
    }
  };

  useEffect(() => {
    return () => {
      if (swapTimeoutRef.current) clearTimeout(swapTimeoutRef.current);
    };
  }, []);

  const current = MODES.find((mode) => mode.key === theme) ?? MODES[2];
  const prevMode = swapping
    ? MODES.find((mode) => mode.key === swapping.prev)
    : null;
  const nextLabel =
    MODES.find(
      (mode) =>
        mode.key ===
        CYCLE_ORDER[(CYCLE_ORDER.indexOf(theme) + 1) % CYCLE_ORDER.length]
    )?.label ?? "Light";
  const { label, Icon } = current;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to switch to ${nextLabel}.`}
      className="fixed bottom-5 left-5 z-[60] flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-stone-200/80 bg-white/80 text-stone-500 shadow-lg shadow-stone-900/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-stone-900 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 dark:border-stone-700/80 dark:bg-stone-900/80 dark:text-stone-400 dark:shadow-black/30 dark:hover:bg-stone-900 dark:hover:text-stone-100 dark:focus-visible:ring-offset-stone-950"
    >
      <span className="relative h-5 w-5">
        {swapping && prevMode && (
          <prevMode.Icon size={20} className="absolute inset-0 animate-theme-out" />
        )}
        <Icon
          key={nonce}
          size={20}
          className={`absolute inset-0 ${
            swapping ? "animate-theme-in" : ""
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;