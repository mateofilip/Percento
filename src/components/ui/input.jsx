import * as React from "react";

import { cn } from "../../lib/utils";

const variantClasses = {
  light:
    "border-b border-stone-300 text-stone-900 caret-orange-600 selection:bg-orange-500/20 placeholder:text-stone-500 hover:border-stone-400 focus-visible:border-orange-500 aria-invalid:border-red-500 dark:border-stone-600 dark:text-stone-100 dark:caret-orange-400 dark:selection:bg-orange-400/20 dark:placeholder:text-stone-500 dark:hover:border-stone-500 dark:focus-visible:border-orange-400 dark:aria-invalid:border-red-400",
  dark: "border-b border-white/25 text-white caret-orange-200 selection:bg-white/25 placeholder:text-white/60 hover:border-white/40 focus-visible:border-white aria-invalid:border-red-400",
};

const Input = React.forwardRef(
  ({ className, type = "text", variant = "light", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-10 w-full appearance-none border-0 rounded-none bg-transparent px-1 py-2 text-center font-semibold tabular-nums transition-colors duration-200 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export { Input };