import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full appearance-none rounded-xl border border-stone-300 bg-white px-3 py-2 text-base font-medium text-stone-900 shadow-sm shadow-black/[0.03] tabular-nums transition-all duration-200 ring-offset-stone-50 placeholder:text-stone-500 hover:border-stone-400 focus-visible:border-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:ring-offset-2 aria-invalid:border-red-500 aria-invalid:ring-red-500/25 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-950/50 dark:text-stone-100 dark:shadow-none dark:ring-offset-stone-950 dark:placeholder:text-stone-400 dark:hover:border-stone-600 dark:focus-visible:border-orange-400 dark:focus-visible:ring-orange-400/30 dark:aria-invalid:border-red-400 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };
