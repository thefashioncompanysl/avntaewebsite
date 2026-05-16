import * as React from 'react';

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
};

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, label, ...props }, ref) => (
        <label className={`inline-flex items-center gap-3 rounded-xl border border-[var(--border-primary)] bg-[var(--text-primary)]/5 px-4 py-3 text-sm cursor-pointer transition-all hover:border-luxury-accent ${className}`}>
            <input
                type="checkbox"
                ref={ref}
                className="h-4 w-4 rounded border-[var(--border-primary)] text-luxury-accent focus:ring-luxury-accent outline-none"
                {...props}
            />
            {label && <span className="text-[var(--text-primary)]">{label}</span>}
        </label>
    )
);
Checkbox.displayName = 'Checkbox';
