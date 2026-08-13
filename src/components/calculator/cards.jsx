import React, { useEffect, useMemo, useRef, useState } from "react";

import { Copy, TrashSimple } from "@phosphor-icons/react";

import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useBump, useFitText } from "./AnswerDisplay";
import {
  CalculatorFrame,
  IconSwapButton,
  copyTextToClipboard,
} from "./CalculatorFrame";
import { createEmptyResult, formatNumber, formatPercent } from "./utils";

const compactSentenceClass =
  "flex w-full flex-wrap items-center justify-center gap-2 text-base text-stone-600 dark:text-stone-400";
const compactInputClass = "w-24 text-center text-lg";

const quickExamples = [
  { percent: "15", base: "84" },
  { percent: "20", base: "150" },
  { percent: "7.5", base: "120" },
];

const FeaturedCalculator = () => {
  const [percent, setPercent] = useState("");
  const [base, setBase] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const percentInvalid =
    Boolean(result?.error) &&
    percent.trim() !== "" &&
    !Number.isFinite(parseFloat(percent));
  const baseInvalid =
    Boolean(result?.error) &&
    base.trim() !== "" &&
    !Number.isFinite(parseFloat(base));

  const isPlaceholder = Boolean(result?.placeholder);
  const hasError = Boolean(result?.error);
  const value =
    !isPlaceholder && !hasError && typeof result?.value === "string"
      ? result.value
      : "0";

  const numberRef = useRef(null);
  const fontSize = useFitText(numberRef, value, 24, 96);
  const isBumping = useBump(value, !isPlaceholder && !hasError);

  const canCopy = !isPlaceholder && !hasError;

  const calculate = () => {
    if (percent.trim() === "" || base.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const p = parseFloat(percent);
    const b = parseFloat(base);
    if (!Number.isFinite(p) || !Number.isFinite(b)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    const formatted = formatNumber((p / 100) * b);
    setResult({ value: formatted });
  };

  const clear = () => {
    setPercent("");
    setBase("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [percent, base]);

  return (
    <div className="relative h-full rounded-3xl bg-[radial-gradient(70%_60%_at_90%_0%,rgba(255,255,255,0.18),transparent_60%),radial-gradient(60%_60%_at_0%_110%,rgba(120,53,15,0.35),transparent_65%),linear-gradient(135deg,#f97316,#ea580c,#c2410c)] px-6 pb-8 pt-14 shadow-[0_24px_60px_-24px_rgba(234,88,12,0.45)] md:px-8 md:pb-10 md:pt-16">
      <div className="absolute right-5 top-5 z-10 flex items-center gap-1.5 md:right-6 md:top-6">
        <IconSwapButton
          variant="orange"
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
          variant="orange"
          disabled={false}
          ariaLabel="Clear inputs"
          title="Clear"
          titleDisabled="Clear"
          DefaultIcon={TrashSimple}
          onAction={async () => {
            clear();
            return true;
          }}
        />
      </div>

      <div className="relative flex min-h-full flex-col justify-between gap-9">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-100/80">
            Percentage of
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-start gap-2 text-lg text-orange-50">
            <span>What is</span>
            <Input
              variant="dark"
              aria-label="Percent"
              aria-invalid={percentInvalid}
              inputMode="decimal"
              type="number"
              step="any"
              value={percent}
              onChange={(e) => setPercent(e.target.value)}
              className="w-28 text-center"
              placeholder="0"
            />
            <span>% of</span>
            <Input
              variant="dark"
              aria-label="Base value"
              aria-invalid={baseInvalid}
              inputMode="decimal"
              type="number"
              step="any"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              className="w-28 text-center"
              placeholder="0"
            />
            <span>?</span>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-start gap-2">
            <span className="text-xs font-semibold text-orange-100/70">
              Try:
            </span>
            {quickExamples.map((example) => (
              <button
                key={`${example.percent}-${example.base}`}
                type="button"
                onClick={() => {
                  setPercent(example.percent);
                  setBase(example.base);
                }}
                className="cursor-pointer rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-orange-50 transition-all duration-200 hover:border-white/50 hover:bg-white/25 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                {example.percent}% of {example.base}
              </button>
            ))}
          </div>
        </div>

        <div className="text-right">
          {hasError ? (
            <p
              role="alert"
              className="inline-block rounded-lg bg-white/15 px-3 py-1.5 text-sm font-semibold text-white"
            >
              {result.error}
            </p>
          ) : (
            <>
              <p
                ref={numberRef}
                aria-live="polite"
                aria-atomic="true"
                className={`overflow-hidden whitespace-nowrap text-clip font-semibold tabular-nums leading-none text-white transition-transform duration-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
                  isPlaceholder ? "text-white/30" : isBumping ? "scale-105" : "scale-100"
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {value}
              </p>
              <p className="mt-3 text-sm font-medium text-orange-100/80">
                {isPlaceholder
                  ? "Start typing"
                  : `= ${percent.trim()}% of ${base.trim()}`}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const WhatPercentCard = () => {
  const [part, setPart] = useState("");
  const [whole, setWhole] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const partInvalid =
    Boolean(result?.error) &&
    part.trim() !== "" &&
    !Number.isFinite(parseFloat(part));
  const wholeInvalid =
    (Boolean(result?.error) &&
      whole.trim() !== "" &&
      !Number.isFinite(parseFloat(whole))) ||
    result?.error === "Cannot divide by zero";

  const calculate = () => {
    if (part.trim() === "" || whole.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const p = parseFloat(part);
    const w = parseFloat(whole);
    if (!Number.isFinite(p) || !Number.isFinite(w)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (w === 0) {
      setResult({ error: "Cannot divide by zero" });
      return;
    }

    setResult({ value: formatPercent((p / w) * 100) });
  };

  const clear = () => {
    setPart("");
    setWhole("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [part, whole]);

  return (
    <CalculatorFrame
      title="What percentage"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className={compactSentenceClass}>
        <Input
          aria-label="Part value"
          aria-invalid={partInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className={compactInputClass}
          placeholder="0"
        />
        <span>is what % of</span>
        <Input
          aria-label="Whole value"
          aria-invalid={wholeInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={whole}
          onChange={(e) => setWhole(e.target.value)}
          className={compactInputClass}
          placeholder="0"
        />
        <span>?</span>
      </div>
    </CalculatorFrame>
  );
};

const PercentageChangeCard = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const fromInvalid =
    (Boolean(result?.error) &&
      from.trim() !== "" &&
      !Number.isFinite(parseFloat(from))) ||
    result?.error === "Initial value cannot be zero";
  const toInvalid =
    Boolean(result?.error) &&
    to.trim() !== "" &&
    !Number.isFinite(parseFloat(to));

  const calculate = () => {
    if (from.trim() === "" || to.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const a = parseFloat(from);
    const b = parseFloat(to);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (a === 0) {
      setResult({ error: "Initial value cannot be zero" });
      return;
    }

    const pct = ((b - a) / a) * 100;
    setResult({
      value: formatPercent(Math.abs(pct)),
      direction: pct > 0 ? "up" : "down",
    });
  };

  const clear = () => {
    setFrom("");
    setTo("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [from, to]);

  return (
    <CalculatorFrame
      title="Percentage change"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className="mx-auto flex w-full flex-col gap-2.5">
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <span className="w-12 text-sm">From…</span>
          <Input
            aria-label="From value"
            aria-invalid={fromInvalid}
            inputMode="decimal"
            type="number"
            step="any"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="flex-1 text-center text-lg"
            placeholder="Start"
          />
        </div>
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <span className="w-12 text-sm">to…</span>
          <Input
            aria-label="To value"
            aria-invalid={toInvalid}
            inputMode="decimal"
            type="number"
            step="any"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="flex-1 text-center text-lg"
            placeholder="End"
          />
        </div>
      </div>
    </CalculatorFrame>
  );
};

const FindTotalCard = () => {
  const [value, setValue] = useState("");
  const [percent, setPercent] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const valueInvalid =
    Boolean(result?.error) &&
    value.trim() !== "" &&
    !Number.isFinite(parseFloat(value));
  const percentInvalid =
    (Boolean(result?.error) &&
      percent.trim() !== "" &&
      !Number.isFinite(parseFloat(percent))) ||
    result?.error === "Percentage cannot be zero";

  const calculate = () => {
    if (value.trim() === "" || percent.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const v = parseFloat(value);
    const p = parseFloat(percent);
    if (!Number.isFinite(v) || !Number.isFinite(p)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (p === 0) {
      setResult({ error: "Percentage cannot be zero" });
      return;
    }

    setResult({ value: formatNumber(v / (p / 100)) });
  };

  const clear = () => {
    setValue("");
    setPercent("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [value, percent]);

  return (
    <CalculatorFrame
      title="Find total"
      result={result}
      onClear={clear}
      answerPlaceholder="0"
    >
      <div className={compactSentenceClass}>
        <Input
          aria-label="Known value"
          aria-invalid={valueInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={compactInputClass}
          placeholder="0"
        />
        <span>is</span>
        <Input
          aria-label="Percent"
          aria-invalid={percentInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={percent}
          onChange={(e) => setPercent(e.target.value)}
          className={compactInputClass}
          placeholder="0"
        />
        <span>% of what?</span>
      </div>
    </CalculatorFrame>
  );
};

const PercentageDifferenceCard = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [result, setResult] = useState(createEmptyResult);

  const aInvalid =
    (Boolean(result?.error) &&
      a.trim() !== "" &&
      !Number.isFinite(parseFloat(a))) ||
    result?.error === "Both values cannot be zero";
  const bInvalid =
    (Boolean(result?.error) &&
      b.trim() !== "" &&
      !Number.isFinite(parseFloat(b))) ||
    result?.error === "Both values cannot be zero";

  const calculate = () => {
    if (a.trim() === "" || b.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const v1 = parseFloat(a);
    const v2 = parseFloat(b);
    if (!Number.isFinite(v1) || !Number.isFinite(v2)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    if (v1 === 0 && v2 === 0) {
      setResult({ error: "Both values cannot be zero" });
      return;
    }

    const base = Math.min(Math.abs(v1), Math.abs(v2));
    if (base === 0) {
      setResult({ value: "∞%" });
      return;
    }

    setResult({ value: formatPercent((Math.abs(v1 - v2) / base) * 100) });
  };

  const clear = () => {
    setA("");
    setB("");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [a, b]);

  return (
    <CalculatorFrame
      title="Difference"
      result={result}
      onClear={clear}
      answerPlaceholder="0%"
    >
      <div className="grid w-full grid-cols-2 gap-2">
        <Input
          aria-label="Value A"
          aria-invalid={aInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={a}
          onChange={(e) => setA(e.target.value)}
          className="w-full text-center text-lg"
          placeholder="Value A"
        />
        <Input
          aria-label="Value B"
          aria-invalid={bInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={b}
          onChange={(e) => setB(e.target.value)}
          className="w-full text-center text-lg"
          placeholder="Value B"
        />
      </div>
    </CalculatorFrame>
  );
};

const ValueChangeCard = () => {
  const [start, setStart] = useState("");
  const [percent, setPercent] = useState("");
  const [operator, setOperator] = useState("increase");
  const [result, setResult] = useState(createEmptyResult);

  const startInvalid =
    Boolean(result?.error) &&
    start.trim() !== "" &&
    !Number.isFinite(parseFloat(start));
  const percentInvalid =
    Boolean(result?.error) &&
    percent.trim() !== "" &&
    !Number.isFinite(parseFloat(percent));

  const verb = useMemo(
    () => (operator === "increase" ? "increased" : "decreased"),
    [operator],
  );

  const calculate = () => {
    if (start.trim() === "" || percent.trim() === "") {
      setResult(createEmptyResult());
      return;
    }

    const s = parseFloat(start);
    const p = parseFloat(percent);
    if (!Number.isFinite(s) || !Number.isFinite(p)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    const multiplier = operator === "increase" ? 1 + p / 100 : 1 - p / 100;
    setResult({
      value: formatNumber(s * multiplier),
      explanation: `${s} ${verb} by ${p}% is ${formatNumber(s * multiplier)}`,
    });
  };

  const clear = () => {
    setStart("");
    setPercent("");
    setOperator("increase");
    setResult(createEmptyResult());
  };

  useEffect(() => {
    calculate();
  }, [start, percent, operator]);

  return (
    <CalculatorFrame
      title="Increase or decrease"
      result={result}
      onClear={clear}
      answerPlaceholder="0"
    >
      <div className="mx-auto flex w-full flex-col gap-2.5">
        <Input
          aria-label="Start value"
          aria-invalid={startInvalid}
          inputMode="decimal"
          type="number"
          step="any"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="text-center text-lg"
          placeholder="Start value"
        />
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="increase">Increase by</SelectItem>
            <SelectItem value="decrease">Decrease by</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-400">
          <Input
            aria-label="Percent change"
            aria-invalid={percentInvalid}
            inputMode="decimal"
            type="number"
            step="any"
            value={percent}
            onChange={(e) => setPercent(e.target.value)}
            className="flex-1 text-center text-lg"
            placeholder="0"
          />
          <span className="text-sm">%</span>
        </div>
      </div>
    </CalculatorFrame>
  );
};

export {
  FeaturedCalculator,
  FindTotalCard,
  PercentageChangeCard,
  PercentageDifferenceCard,
  ValueChangeCard,
  WhatPercentCard,
};
