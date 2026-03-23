import React, { useEffect, useRef, useState } from "react";

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
        className={`animate-in fade-in slide-in-from-bottom-4 fixed right-4 bottom-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-neutral-700 bg-neutral-800 text-white shadow-lg transition-transform hover:scale-110 hover:bg-neutral-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 ${
          isOpen ? "z-[80]" : "z-[60]"
        }`}
        aria-label="View Tech Stack"
        title="View Tech Stack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </button>

      {shouldRender && (
        <div
          className={`fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity duration-200 motion-reduce:transition-none ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={close}
        >
          <div
            id={modalId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={`w-full max-w-sm rounded-2xl border border-neutral-700 bg-neutral-900/95 p-6 shadow-2xl transform-gpu transition-all duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isOpen
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-2 scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 id={titleId} className="text-xl font-bold text-white">
                Tech Stack
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={close}
                className="cursor-pointer rounded-full p-1 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <ul className="space-y-3">
              {stack.map((item) => (
                <li
                  key={item.name}
                  className="flex items-center justify-between rounded-xl border border-neutral-700/50 bg-neutral-800/50 p-3 transition-colors hover:bg-neutral-800"
                >
                  <span className="font-semibold text-slate-100">
                    {item.name}
                  </span>
                  <span className="rounded-full bg-orange-400/10 px-2 py-1 text-xs font-medium text-orange-400">
                    {item.description}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-500">Built with ❤️ by Mateo</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
