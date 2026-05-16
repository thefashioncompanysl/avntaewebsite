import * as React from 'react';

export const Tooltip: React.FC<{ content: React.ReactNode; children: React.ReactElement; className?: string }> = ({ content, children, className }) => {
    return (
        <span className={`relative inline-block group ${className}`}>
            {children}
            <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute z-50 whitespace-nowrap bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-primary)] rounded-md px-3 py-1 text-xs -top-8 left-1/2 transform -translate-x-1/2">
                {content}
            </span>
        </span>
    );
};

export default Tooltip;
