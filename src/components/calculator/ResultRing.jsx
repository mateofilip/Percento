import React from "react";

import { createEmptyResult } from "./utils";

const RADIUS = 62;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const ResultRing = ({ percent, base, result }) => {
  const output = result ?? createEmptyResult();
  const isPlaceholder = Boolean(output.placeholder);
  const hasError = Boolean(output.error);

  const numericPercent = Number.isFinite(percent) ? percent : 0;
  const clamped = Math.min(Math.max(numericPercent, 0), 100);
  const dashOffset = CIRCUMFERENCE * (1 - clamped / 100);

  const value =
    !isPlaceholder && !hasError && typeof output.value === "string"
      ? output.value
      : "0";
  const digitCount = String(value).replace(/[^0-9]/g, "").length;
  const valueSizeClass =
    digitCount > 12
      ? "text-2xl"
      : digitCount > 8
        ? "text-3xl"
        : "text-4xl";

  const caption = isPlaceholder
    ? "Enter values above"
    : `= ${numericPercent}% of ${base}`;

  return (
    <div
      className="relative mx-auto h-44 w-44 md:h-48 md:w-48"
      aria-hidden="true"
    >
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          strokeWidth="13"
          className="stroke-stone-200/80 dark:stroke-stone-800"
        />
        <circle
          cx="80"
          cy="80"
          r={RADIUS}
          fill="none"
          strokeWidth="13"
          strokeLinecap="round"
          className="ring-progress stroke-orange-600 dark:stroke-orange-500"
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        {hasError ? (
          <p
            role="alert"
            className="text-sm font-medium text-red-600 dark:text-red-400"
          >
            {output.error}
          </p>
        ) : (
          <>
            <p
              aria-live="polite"
              aria-atomic="true"
              className={`w-full truncate font-semibold leading-none tabular-nums tracking-tight text-orange-600 dark:text-orange-400 ${valueSizeClass}`}
            >
              {value}
            </p>
            <p className="mt-1.5 text-xs text-stone-500 dark:text-stone-400">
              {caption}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export { ResultRing };
