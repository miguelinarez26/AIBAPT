"use client";

import * as React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-2xl font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[0_8px_20px_-6px_rgba(227,27,35,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(227,27,35,0.6)] before:absolute before:inset-0 before:bg-white/20 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300",
        secondary:
          "bg-secondary text-white shadow-[0_8px_20px_-6px_rgba(11,81,62,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(11,81,62,0.6)] before:absolute before:inset-0 before:bg-white/20 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-300",
        ghost:
          "bg-transparent text-secondary dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
        outline:
          "border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-secondary dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 shadow-sm backdrop-blur-md",
      },
      size: {
        default: "h-14 px-8 py-4 text-base",
        sm: "h-10 rounded-xl px-5 text-sm",
        lg: "h-16 rounded-2xl px-10 text-lg",
        icon: "h-14 w-14",
      },
      fullWidth: {
        true: "w-full",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onAnimationStart" | "onDragStart" | "onDragEnd" | "onDrag">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
