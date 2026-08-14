import React, { useEffect, useRef, useState } from "react";

import { Check, Copy, TrashSimple } from "@phosphor-icons/react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { AnswerDisplay } from "./AnswerDisplay";

const copyTextToClipboard = async (text) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return Boolean(ok);
  } catch {
    return false;
  }
};

const iconButtonVariants = {
  light:
    "border-stone-200/70 bg-white/70 text-stone-500 hover:border-stone-300 hover:bg-white hover:text-stone-900 dark:border-stone-700/70 dark:bg-stone-950/40 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-950/70 dark:hover:text-stone-100",
  orange:
    "border-white/25 bg-white/15 text-white hover:border-white/40 hover:bg-white/25 hover:text-white dark:border-white/25 dark:bg-white/15 dark:text-white dark:hover:border-white/40 dark:hover:bg-white/25 dark:hover:text-white",
};

const IconSwapButton = ({
  disabled,
  ariaLabel,
  title,
  titleDisabled,
  onAction,
  DefaultIcon,
  variant = "light",
  className = "",
}) => {
  const tooltipText = disabled ? titleDisabled : title;
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [nonce, setNonce] = useState(0);
  const animTimeoutRef = useRef(null);
  const doneTimeoutRef = useRef(null);

  const handleClick = async () => {
    if (disabled) return;

    const ok = await onAction();
    if (!ok) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setNonce((current) => current + 1);
    setIsAnimating(!reduce);
    setIsDone(true);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 300);

    if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);
    doneTimeoutRef.current = setTimeout(() => {
      setIsDone(false);
    }, 900);
  };

  useEffect(() => {
    return () => {
      if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
      if (doneTimeoutRef.current) clearTimeout(doneTimeoutRef.current);
    };
  }, []);

  return (
    <span
      className={`group/tooltip relative inline-flex ${
        disabled ? "cursor-not-allowed" : ""
      }`}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "h-9 w-9 rounded-full border shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-px active:scale-95 disabled:pointer-events-none disabled:opacity-40",
          iconButtonVariants[variant],
          className
        )}
        onClick={handleClick}
      >
        <span className="relative h-4 w-4">
          <DefaultIcon
            size={16}
            className={`absolute inset-0 transition-all duration-200 motion-reduce:transition-none ${
              isAnimating ? "animate-theme-out" : ""
            } ${isDone ? "opacity-0" : "opacity-100"}`}
          />
          <Check
            key={nonce}
            size={16}
            weight="bold"
            className={`absolute inset-0 text-current transition-all duration-200 motion-reduce:transition-none ${
              isAnimating ? "animate-theme-in" : ""
            } ${isDone ? "opacity-100" : "opacity-0"}`}
          />
        </span>
      </Button>
      <span className="pointer-events-none absolute right-0 bottom-full z-50 mb-2 w-max max-w-56 translate-y-1 whitespace-nowrap opacity-0 transition-all duration-200 ease-out group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-hover/tooltip:delay-200">
        <span className="relative block rounded-xl border border-stone-800 bg-stone-900 p-2 text-xs font-semibold text-white shadow-lg dark:border-stone-200 dark:bg-white dark:text-neutral-900">
          {tooltipText}
          <span className="absolute -bottom-1 right-3 h-2 w-2 rotate-45 rounded-[3px] border-b border-r border-stone-800 bg-stone-900 dark:border-stone-200 dark:bg-white" />
        </span>
      </span>
    </span>
  );
};

const CalculatorFrame = ({
  title,
  children,
  result,
  onClear,
  answerPlaceholder,
}) => {
  const canCopy =
    Boolean(result) &&
    !Boolean(result?.placeholder) &&
    !Boolean(result?.error) &&
    typeof result?.value === "string";

  return (
    <div className="flex h-full flex-col rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm shadow-stone-900/5 transition-all duration-200 ease-out hover:border-stone-300/80 hover:shadow-lg hover:shadow-stone-900/10 dark:border-stone-800 dark:bg-neutral-900 dark:shadow-black/20 dark:hover:border-stone-700 dark:hover:shadow-black/40">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          <IconSwapButton
            disabled={!canCopy}
            ariaLabel="Copy result"
            title="Copy"
            titleDisabled="Nothing to copy yet"
            DefaultIcon={Copy}
            onAction={async () => {
              if (!canCopy) return false;
              return copyTextToClipboard(result.value);
            }}
          />
          <IconSwapButton
            disabled={false}
            ariaLabel="Clear inputs"
            title="Clear"
            titleDisabled="Clear"
            DefaultIcon={TrashSimple}
            onAction={async () => {
              onClear();
              return true;
            }}
          />
        </div>
      </div>

      <div className="flex flex-1 items-center py-5">{children}</div>

      <AnswerDisplay result={result} placeholderValue={answerPlaceholder} />
    </div>
  );
};

export { CalculatorFrame, IconSwapButton, copyTextToClipboard };
