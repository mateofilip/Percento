import React, { useEffect, useRef, useState } from "react";

import { Check, Copy, TrashSimple } from "@phosphor-icons/react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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

const IconSwapButton = ({
  disabled,
  ariaLabel,
  title,
  titleDisabled,
  onAction,
  DefaultIcon,
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

    setNonce((current) => current + 1);
    setIsAnimating(true);
    setIsDone(true);

    if (animTimeoutRef.current) clearTimeout(animTimeoutRef.current);
    animTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 220);

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
        className={`h-9 w-9 rounded-full border border-stone-200/70 bg-white/70 text-stone-500 shadow-sm backdrop-blur transition-all duration-200 hover:-translate-y-px hover:border-stone-300 hover:bg-white hover:text-stone-900 active:scale-95 disabled:pointer-events-none disabled:opacity-40 dark:border-stone-700/70 dark:bg-stone-950/40 dark:text-stone-400 dark:hover:border-stone-600 dark:hover:bg-stone-950/70 dark:hover:text-stone-100 ${
          isAnimating ? "scale-105" : "scale-100"
        }`}
        onClick={handleClick}
      >
        <span className="relative h-4 w-4">
          <DefaultIcon
            size={16}
            className={`absolute inset-0 transition-all duration-150 ${
              isDone ? "scale-75 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          <Check
            key={nonce}
            size={16}
            weight="bold"
            className={`absolute inset-0 text-emerald-500 transition-all duration-150 dark:text-emerald-400 ${
              isDone ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          />
        </span>
      </Button>
      <span className="pointer-events-none absolute right-0 bottom-full z-50 mb-2 w-max max-w-56 whitespace-nowrap opacity-0 transition-all duration-200 translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:translate-y-0">
        <span className="relative block rounded-xl border border-stone-800 bg-stone-900 p-2 text-xs font-semibold text-white shadow-lg dark:border-stone-200 dark:bg-white dark:text-stone-900">
          {tooltipText}
          <span className="absolute -bottom-1 right-3 h-2 w-2 rotate-45 border-b border-r border-stone-800 bg-stone-900 dark:border-stone-200 dark:bg-white" />
        </span>
      </span>
    </span>
  );
};

const CalculatorFrame = ({
  title,
  description,
  badge,
  children,
  result,
  onClear,
  answerPlaceholder,
  resultNode,
}) => {
  const canCopy =
    Boolean(result) &&
    !Boolean(result?.placeholder) &&
    !Boolean(result?.error) &&
    typeof result?.value === "string";

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200/80 bg-white shadow-sm shadow-stone-900/5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-stone-300/80 hover:shadow-xl hover:shadow-orange-900/5 dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20 dark:hover:border-stone-700 dark:hover:shadow-black/40">
      <CardHeader className="flex flex-row items-start justify-between gap-3 px-6 pb-0 pt-6">
        <div className="min-w-0">
          {badge ? (
            <span className="mb-1.5 inline-block rounded-full bg-orange-600/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
              {badge}
            </span>
          ) : null}
          <CardTitle className="text-[15px] font-semibold tracking-tight text-stone-900 dark:text-stone-100">
            {title}
          </CardTitle>
          <CardDescription className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
            {description}
          </CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <IconSwapButton
            disabled={!canCopy}
            ariaLabel="Copy result"
            title="Copy result"
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
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-6 pb-5 pt-4">
        <div className="flex flex-1 items-center justify-center py-2">
          {children}
        </div>
        {resultNode ?? (
          <AnswerDisplay result={result} placeholderValue={answerPlaceholder} />
        )}
      </CardContent>
    </Card>
  );
};

export { CalculatorFrame };
