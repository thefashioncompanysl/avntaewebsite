import * as React from "react";

export const Label = ({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className={`text-[10px] uppercase tracking-[0.4em] text-[var(--text-primary)] opacity-30 font-bold block mb-4 transition-colors group-focus-within:text-luxury-accent ${className}`}>
    {children}
  </label>
);

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`input-luxury text-lg placeholder:text-[var(--text-primary)] placeholder:opacity-10 ${className}`}
      {...props}
    />
  )
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={`input-luxury text-lg placeholder:text-[var(--text-primary)] placeholder:opacity-10 min-h-[120px] resize-none ${className}`}
      {...props}
    />
  )
);
