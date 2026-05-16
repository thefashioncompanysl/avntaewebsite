import * as React from 'react';

type AvatarProps = {
    src?: string | null;
    alt?: string;
    size?: number;
    className?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt = '', size = 48, className }) => {
    const initials = (alt || '').split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();

    return (
        <div
            className={`rounded-full overflow-hidden bg-[var(--glass-bg)] border border-[var(--glass-border)] inline-flex items-center justify-center text-[var(--text-primary)] ${className}`}
            style={{ width: size, height: size }}
            title={alt}
        >
            {src ? (
                // eslint-disable-next-line jsx-a11y/img-redundant-alt
                <img src={src} alt={alt || 'avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" decoding="async" />
            ) : (
                <span className="font-serif text-sm opacity-90">{initials || 'A'}</span>
            )}
        </div>
    );
};

export default Avatar;
