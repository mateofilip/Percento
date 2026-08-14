import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-stone-50 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.97] dark:ring-offset-stone-950",
  {
    variants: {
      variant: {
        default:
          "bg-orange-700 text-white shadow-sm shadow-orange-900/20 hover:bg-orange-800 dark:bg-orange-500 dark:text-stone-950 dark:shadow-none dark:hover:bg-orange-400",
        secondary:
          "bg-stone-200/70 text-stone-900 hover:bg-stone-300/70 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700",
        outline:
          "border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 dark:border-stone-700 dark:bg-neutral-900 dark:text-stone-100 dark:hover:bg-stone-800",
        ghost:
          "text-stone-600 hover:bg-stone-200/60 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100",
      },
      size: {
        default: "h-10 rounded-full px-5",
        sm: "h-9 rounded-full px-4",
        lg: "h-12 rounded-full px-8",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = "Button";

export { Button, buttonVariants };
