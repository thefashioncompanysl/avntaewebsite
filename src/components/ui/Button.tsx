import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-mono font-bold uppercase tracking-[0.4em] transition-all duration-700 disabled:opacity-50 disabled:pointer-events-none active:scale-95 border";
    
    const variants = {
      default: "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent hover:border-luxury-accent/40 hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-2",
      outline: "border-[var(--text-primary)]/20 text-[var(--text-primary)] hover:border-luxury-accent/40 hover:bg-[rgba(255,255,255,0.02)] hover:backdrop-blur-md hover:-translate-y-2",
      ghost: "border-transparent text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.02)] hover:backdrop-blur-md hover:text-luxury-accent",
    };

    const sizes = {
      md: "px-8 py-4 text-[10px]",
      lg: "px-8 py-4 sm:px-12 sm:py-6 text-[10px]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    );
  }
);
