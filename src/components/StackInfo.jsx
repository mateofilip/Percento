import React, { useEffect, useRef, useState } from "react";

import { Info, X } from "@phosphor-icons/react";

export default function StackInfo() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedElementRef = useRef(null);

  const modalId = "tech-stack-modal";
  const titleId = "tech-stack-title";

  const open = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    previouslyFocusedElementRef.current = document.activeElement;
    setShouldRender(true);
    requestAnimationFrame(() => setIsOpen(true));
  };

  const close = () => {
    setIsOpen(false);
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    closeTimeoutRef.current = setTimeout(() => {
      setShouldRender(false);
      const el = previouslyFocusedElementRef.current;
      if (el && typeof el.focus === "function") el.focus();
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!shouldRender) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!isOpen) return undefined;

    closeButtonRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const stack = [
    { name: "Astro", description: "Web Framework" },
    { name: "React", description: "UI Library" },
    { name: "Tailwind CSS", description: "Styling" },
    { name: "shadcn/ui", description: "UI Components" },
    { name: "Vercel", description: "Infrastructure" },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (isOpen ? close() : open())}
        aria-expanded={isOpen}
        aria-controls={modalId}
        className={`fixed bottom-5 right-5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-stone-200/80 bg-white/80 text-stone-500 shadow-lg shadow-stone-900/10 backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-stone-900 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50 dark:border-stone-700/80 dark:bg-stone-900/80 dark:text-stone-400 dark:shadow-black/30 dark:hover:bg-stone-900 dark:hover:text-stone-100 dark:focus-visible:ring-offset-stone-950 ${
          isOpen ? "z-[80]" : "z-[60]"
        }`}
        aria-label="View Tech Stack"
        title="View Tech Stack"
      >
        <Info size={20} />
      </button>

      {shouldRender && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-stone-950/40 p-4 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none dark:bg-black/60 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={close}
        >
          <div
            id={modalId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`w-full max-w-sm rounded-3xl border border-stone-200 bg-white p-6 shadow-2xl shadow-stone-900/15 transform-gpu transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/50 ${
              isOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-2 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2
                id={titleId}
                className="text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100"
              >
                Tech Stack
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 dark:hover:bg-stone-800 dark:hover:text-stone-100"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <ul className="space-y-2.5">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-stone-50 px-4 py-3 transition-colors hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-950/40 dark:hover:bg-stone-800/60"
                >
                  <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-orange-600/10 px-2.5 py-1 text-[11px] font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Made by Mateo Filip
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
