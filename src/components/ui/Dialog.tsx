import * as React from 'react';
import { createPortal } from 'react-dom';

type DialogProps = {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    title?: React.ReactNode;
    children?: React.ReactNode;
};

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, title, children }) => {
    const [portalRoot, setPortalRoot] = React.useState<HTMLDivElement | null>(null);

    React.useEffect(() => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        setPortalRoot(element);

        return () => {
            document.body.removeChild(element);
            setPortalRoot(null);
        };
    }, []);

    if (!open || !portalRoot) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-black/60" onClick={() => onOpenChange?.(false)} />
            <div
                role="dialog"
                aria-modal="true"
                className="relative z-50 glass rounded-3xl border border-[var(--border-primary)] max-w-2xl w-full max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-[var(--border-primary)]">
                    <div className="min-w-0">
                        {title && <h3 className="text-xl font-serif leading-tight">{title}</h3>}
                    </div>
                    <button
                        type="button"
                        className="shrink-0 rounded-full border border-[var(--border-primary)] px-3 py-2 text-xs uppercase tracking-[0.35em] opacity-70 hover:opacity-100 hover:border-luxury-accent transition-colors"
                        onClick={() => onOpenChange?.(false)}
                        aria-label="Close dialog"
                    >
                        Close
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {children}
                </div>
            </div>
        </div>,
        portalRoot
    );
};

export default Dialog;
