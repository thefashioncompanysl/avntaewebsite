import * as React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className, children, ...props }, ref) => (
        <div className={`relative w-full ${className}`}>
            <select
                ref={ref}
                className="appearance-none w-full rounded-xl border border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-3 pr-10 text-sm outline-none transition-all focus:border-luxury-accent focus:ring-0"
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-primary)] opacity-70" />
        </div>
    )
);
Select.displayName = 'Select';
