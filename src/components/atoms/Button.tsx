"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "cursor-pointer w-fit rounded-xs",
    "inline-flex items-center justify-center text-sm font-medium",
    "transition-colors focus-visible:outline-none focus-visible:ring-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:ring-accent-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-dark-secondary",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-accent text-dark-secondary hover:bg-accent/75",
        secondary: "bg-accent-secondary text-dark hover:bg-accent-secondary/90",
        outline:
          "border border-dark/40 bg-transparent text-light hover:bg-dark/20",
        ghost: "bg-transparent text-light hover:text-accent",
        destructive: "bg-red-600 text-white hover:bg-red-500",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-11 px-5",
        icon: "size-10 flex-shrink-0 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
