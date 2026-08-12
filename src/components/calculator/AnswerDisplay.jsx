import React, { useEffect, useRef, useState } from "react";

import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";

import { createEmptyResult } from "./utils";

const AnswerDisplay = ({ result, placeholderValue = "0" }) => {
  const output = result ?? createEmptyResult();

  const isPlaceholder = Boolean(output.placeholder);
  const hasError = Boolean(output.error);
  const value =
    !isPlaceholder && !hasError && typeof output.value === "string"
      ? output.value
      : placeholderValue;

  const digitCount = String(value).replace(/[^0-9]/g, "").length;
  const valueSizeClass =
    digitCount > 18
      ? "text-2xl"
      : digitCount > 13
        ? "text-3xl"
        : digitCount > 9
          ? "text-4xl"
          : "text-5xl";

  const [isBumping, setIsBumping] = useState(false);
  const previousValueRef = useRef(value);
  const bumpTimeoutRef = useRef(null);

  useEffect(() => {
    if (isPlaceholder || hasError) {
      previousValueRef.current = value;
      return undefined;
    }

    if (previousValueRef.current !== value) {
      setIsBumping(true);
      if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
      bumpTimeoutRef.current = setTimeout(() => {
        setIsBumping(false);
      }, 180);
    }

    previousValueRef.current = value;

    return () => {
      if (bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
    };
  }, [value, isPlaceholder, hasError]);

  const showDirection = !isPlaceholder && !hasError && output.direction;

  return (
    <div className="h-24 shrink-0 border-t border-stone-200/80 pt-4 dark:border-stone-800">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
        Answer
      </p>
      <div className="mt-1.5 flex items-center gap-2">
        {showDirection ? (
          <span className="text-orange-600 dark:text-orange-400">
            {output.direction === "up" ? (
              <ArrowUpRight size={20} weight="bold" />
            ) : (
              <ArrowDownRight size={20} weight="bold" />
            )}
          </span>
        ) : null}
        <p
          aria-live="polite"
          aria-atomic="true"
          className={
            isPlaceholder || hasError
              ? `w-full select-none overflow-hidden whitespace-nowrap text-clip font-semibold leading-none tabular-nums tracking-tight text-orange-400 transition-transform duration-200 ease-out motion-reduce:transition-none dark:text-orange-500/60 ${valueSizeClass}`
              : `w-full overflow-hidden whitespace-nowrap text-clip font-semibold leading-none tabular-nums tracking-tight text-orange-600 transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none dark:text-orange-400 ${valueSizeClass} ${
                  isBumping ? "scale-105" : "scale-100"
                }`
          }
        >
          {value}
        </p>
      </div>
      {hasError ? (
        <p role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
          {output.error}
        </p>
      ) : null}
    </div>
  );
};

export { AnswerDisplay };
