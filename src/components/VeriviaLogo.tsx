import React from 'react';

export interface VeriviaLogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'full' | 'hero' | 'mark-only';
  showTagline?: boolean;
  inverted?: boolean; // for dark backgrounds
  onClick?: () => void;
  logoSrc?: string;
}

/**
 * Normalizes logo URL ensuring it is a valid web path
 */
function normalizeLogoUrl(src?: string): string {
  if (!src) return '/verivia-header-logo.svg';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  if (src.startsWith('/')) {
    return src;
  }
  return `/${src}`;
}

export const VeriviaLogo: React.FC<VeriviaLogoProps> = ({
  className = '',
  variant = 'header',
  showTagline = false,
  inverted = false,
  onClick,
  logoSrc
}) => {
  const cleanLogoSrc = logoSrc ? normalizeLogoUrl(logoSrc) : null;

  // 1. Mark Only Variant (Small emblem icon for admin sidebar, badges, etc.)
  if (variant === 'mark-only') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
        title="VERIVIA HEALTH"
      >
        <img
          src={inverted ? '/verivia-mark-white.svg' : '/verivia-mark.svg'}
          alt="VERIVIA Emblem"
          className="w-full h-full object-contain select-none"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('verivia-header-logo.svg')) {
              target.src = '/verivia-header-logo.svg';
            }
          }}
        />
      </div>
    );
  }

  // 2. Footer Variant (Tailored dark-theme vector logo in pure white for 100% legibility)
  if (variant === 'footer' || inverted) {
    const footerSrc = cleanLogoSrc && !cleanLogoSrc.includes('verivia') && !cleanLogoSrc.includes('1791174945789')
      ? cleanLogoSrc
      : '/verivia-footer-logo.svg';

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="relative shrink-0 flex items-center justify-center py-1">
          <img
            src={footerSrc}
            alt="VERIVIA HEALTH - International Patient Services"
            className="h-12 sm:h-14 md:h-[54px] w-auto max-w-[330px] sm:max-w-[370px] object-contain select-none transition-opacity hover:opacity-95"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('verivia-footer-logo.svg')) {
                target.src = '/verivia-footer-logo.svg';
              }
            }}
          />
        </div>
      </div>
    );
  }

  // 3. Full / Hero Stacked Badge
  if (variant === 'full' || variant === 'hero') {
    const heroSrc = inverted
      ? '/verivia-footer-logo.svg'
      : (cleanLogoSrc && !cleanLogoSrc.includes('1791174945789') ? cleanLogoSrc : '/verivia-header-logo.svg');
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src={heroSrc}
            alt="VERIVIA HEALTH - International Patient Services"
            className={`${variant === 'hero' ? 'h-16 sm:h-20' : 'h-14 sm:h-16'} w-auto max-w-[380px] object-contain select-none transition-transform hover:scale-[1.02]`}
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('verivia-header-logo.svg')) {
                target.src = '/verivia-header-logo.svg';
              }
            }}
          />
        </div>
      </div>
    );
  }

  // 4. Header Variant (Main Website Navbar)
  // Maintains selector hierarchy: header > ... > div#brand-logo-container > div > div > img
  const headerSrc = cleanLogoSrc && !cleanLogoSrc.includes('1791174945789') && !cleanLogoSrc.includes('footer')
    ? cleanLogoSrc
    : '/verivia-header-logo.svg';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={headerSrc}
          alt="VERIVIA HEALTH - International Patient Services"
          className="h-12 sm:h-14 md:h-[54px] w-auto max-w-[330px] sm:max-w-[370px] object-contain transition-all duration-200 group-hover:scale-[1.01] select-none"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.includes('verivia-header-logo.svg')) {
              target.src = '/verivia-header-logo.svg';
            }
          }}
        />
      </div>
    </div>
  );
};
