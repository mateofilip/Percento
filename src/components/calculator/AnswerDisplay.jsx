import React, { useEffect, useRef, useState } from "react";

import { ArrowDownRight, ArrowUpRight } from "@phosphor-icons/react";

import { createEmptyResult } from "./utils";

const useBump = (value, active) => {
  const [isBumping, setIsBumping] = useState(false);
  const previousValueRef = useRef(value);
  const bumpTimeoutRef = useRef(null);

  useEffect(() => {
    if (!active) {
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
  }, [value, active]);

  return isBumping;
};

const useFitText = (ref, text, min, max) => {
  const [fontSize, setFontSize] = useState(max);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const container = element.parentElement;
    if (!container) return undefined;

    let disposed = false;

    const measure = () => {
      if (disposed) return;
      if (container.clientWidth === 0) return;

      const leading = container.firstElementChild;
      const leadingWidth =
        leading && leading !== element
          ? leading.getBoundingClientRect().width
          : 0;
      const available =
        container.clientWidth - leadingWidth - (leadingWidth > 0 ? 8 : 0);
      if (available <= 0) return;

      const clone = element.cloneNode(true);
      clone.style.fontSize = `${max}px`;
      clone.style.position = "absolute";
      clone.style.visibility = "hidden";
      clone.style.maxWidth = "none";
      document.body.appendChild(clone);
      const textWidth = clone.scrollWidth;
      document.body.removeChild(clone);

      if (textWidth <= 0) return;

      const next =
        textWidth <= available
          ? max
          : Math.max(min, Math.floor((max * available) / textWidth));

      setFontSize((current) => (current === next ? current : next));
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(container);

    const onFontsReady = () => measure();
    if (document.fonts) {
      document.fonts.ready.then(onFontsReady);
      document.fonts.addEventListener("loadingdone", onFontsReady);
    }

    return () => {
      disposed = true;
      observer.disconnect();
      if (document.fonts) {
        document.fonts.removeEventListener("loadingdone", onFontsReady);
      }
    };
  }, [ref, text, min, max]);

  return fontSize;
};

const AnswerDisplay = ({ result, placeholderValue = "0" }) => {
  const output = result ?? createEmptyResult();

  const isPlaceholder = Boolean(output.placeholder);
  const hasError = Boolean(output.error);
  const value =
    !isPlaceholder && !hasError && typeof output.value === "string"
      ? output.value
      : placeholderValue;

  const numberRef = useRef(null);
  const fontSize = useFitText(numberRef, value, 16, 36);
  const isBumping = useBump(value, !isPlaceholder && !hasError);
  const showDirection = !isPlaceholder && !hasError && output.direction;

  return (
    <div className="flex min-h-10 shrink-0 items-center justify-end gap-2">
      {hasError ? (
        <p
          role="alert"
          className="w-full text-left text-sm font-medium text-red-600 dark:text-red-400"
        >
          {output.error}
        </p>
      ) : (
        <>
          {showDirection ? (
            <span className="flex shrink-0 items-center text-orange-600 dark:text-orange-400">
              {output.direction === "up" ? (
                <ArrowUpRight size={20} weight="bold" />
              ) : (
                <ArrowDownRight size={20} weight="bold" />
              )}
            </span>
          ) : (
            <span className="shrink-0 text-2xl font-semibold leading-none text-orange-600 dark:text-orange-400">
              =
            </span>
          )}
          <p
            ref={numberRef}
            aria-live="polite"
            aria-atomic="true"
            className={`overflow-hidden whitespace-nowrap text-clip font-semibold tabular-nums leading-none transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              isPlaceholder
                ? "text-stone-300 dark:text-stone-600"
                : `text-stone-900 dark:text-stone-100 ${
                    isBumping ? "scale-105" : "scale-100"
                  }`
            }`}
            style={{ fontSize: `${fontSize}px` }}
          >
            {value}
          </p>
        </>
      )}
    </div>
  );
};

export { AnswerDisplay, useBump, useFitText };