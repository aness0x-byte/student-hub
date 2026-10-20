import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost" | "link" | "danger";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-zinc-950";
    
    const variants = {
      default: "bg-zinc-950 text-white shadow-xs hover:bg-zinc-800",
      secondary: "bg-zinc-100 text-zinc-900 shadow-xs hover:bg-zinc-200",
      outline: "border border-zinc-200 bg-white text-zinc-900 shadow-2xs hover:bg-zinc-50 hover:border-zinc-300",
      ghost: "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900",
      link: "text-zinc-900 underline-offset-4 hover:underline p-0 h-auto",
      danger: "bg-red-600 text-white shadow-xs hover:bg-red-700",
    };

    const sizes = {
      default: "h-9 px-3.5 py-2",
      sm: "h-8 px-2.5 text-xs",
      lg: "h-10 px-5 text-sm",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
