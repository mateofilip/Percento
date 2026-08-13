import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

import { CaretDown, Check } from "@phosphor-icons/react";

import { cn } from "../../lib/utils";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "group/select flex h-12 w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-4 py-2 text-base font-semibold text-stone-900 shadow-sm shadow-black/[0.03] tabular-nums transition-all duration-200 hover:border-stone-400 hover:shadow-md hover:shadow-black/[0.05] focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:shadow-[0_4px_14px_-4px_rgba(249,115,22,0.3)] data-[placeholder]:text-stone-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:bg-stone-950/60 dark:text-stone-100 dark:shadow-none dark:hover:border-stone-600 dark:focus:border-orange-400 dark:focus:ring-orange-400/30 dark:focus:shadow-[0_4px_14px_-4px_rgba(251,146,60,0.25)] dark:data-[placeholder]:text-stone-400",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <CaretDown
          size={14}
          weight="bold"
          className="shrink-0 text-stone-500 transition-transform duration-200 group-data-[state=open]/select:-rotate-180 dark:text-stone-400"
          aria-hidden="true"
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1 shadow-xl shadow-stone-900/10 data-[state=open]:animate-select-in data-[state=closed]:animate-select-out dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40",
          position === "popper" &&
            "w-[var(--radix-select-trigger-width)] min-w-[8rem]",
          className
        )}
        position={position}
        sideOffset={8}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-0.5",
            position === "popper" && "w-full"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);

SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100", className)}
    {...props}
  />
));

SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2 pl-3 pr-8 text-sm font-medium text-stone-900 outline-none transition-colors duration-200 focus:bg-orange-600/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:text-stone-100 dark:focus:bg-orange-500/10",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2.5 inline-flex items-center justify-center text-orange-600 dark:text-orange-400">
        <Check size={15} weight="bold" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
);

SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-stone-200/70 dark:bg-stone-800", className)}
    {...props}
  />
));

SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
