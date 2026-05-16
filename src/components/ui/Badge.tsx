import * as React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-primary)] ${className}`}>
        {children}
    </span>
);

export default Badge;
