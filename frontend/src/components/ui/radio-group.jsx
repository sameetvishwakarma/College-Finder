import React, { forwardRef } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";

import { cn } from "../../libs/utils";   // 👉 change this path if your utils live elsewhere

/* ────────────────────────────
   Root wrapper
────────────────────────────── */
const RadioGroup = forwardRef(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Root
        ref={ref}
        className={cn("grid gap-2", className)}
        {...props}
    />
));

RadioGroup.displayName = "RadioGroup";

/* ────────────────────────────
   Radio item
────────────────────────────── */
const RadioGroupItem = forwardRef(({ className, ...props }, ref) => (
    <RadioGroupPrimitive.Item
        ref={ref}
        className={cn(
            "aspect-square h-4 w-4 rounded-full border border-primary text-primary " +
            "ring-offset-background focus:outline-none focus-visible:ring-2 " +
            "focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    >
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
            <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = "RadioGroupItem";

/* ────────────────────────────
   Exports
────────────────────────────── */
export { RadioGroup, RadioGroupItem };
