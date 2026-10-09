
import React from 'react';

export interface VeriviaLogoProps {
  className?: string;
  variant?: 'header' | 'footer' | 'full' | 'hero' | 'mark-only';
  showTagline?: boolean;
  inverted?: boolean;
  onClick?: () => void;
  logoSrc?: string;
}

/**
 * Builds an asset URL that works on both GitHub Pages and a custom domain.
 * Vite's BASE_URL includes the repository path when using GitHub Pages.
 */
function logoAsset(filename: string): string {
  const baseUrl = import.meta.env.BASE_URL || '/';
  const cleanFilename = filename.replace(/^\/+/, '');
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;

  return `${cleanBaseUrl}${cleanFilename}`;
}

/**
 * Converts local logo paths into deployment-safe URLs.
 * External and data URLs are preserved.
 */
function normalizeLogoUrl(src?: string): string {
  if (!src) {
    return logoAsset('verivia-header-logo.svg');
  }

  if (/^(https?:\/\/|data:|blob:)/i.test(src)) {
    return src;
  }

  return logoAsset(src);
}

/**
 * Switches to a fallback image if the requested logo cannot load.
 * The fallback is attempted only once to prevent an error loop.
 */
function handleLogoError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackSrc: string
): void {
  const image = event.currentTarget;

  if (image.dataset.fallbackApplied === 'true') {
    return;
  }

  image.dataset.fallbackApplied = 'true';
  image.src = fallbackSrc;
}

export const VeriviaLogo: React.FC<VeriviaLogoProps> = ({
  className = '',
  variant = 'header',
  showTagline = false,
  inverted = false,
  onClick,
  logoSrc,
}) => {
  const cleanLogoSrc = logoSrc ? normalizeLogoUrl(logoSrc) : null;
  const headerFallback = logoAsset('verivia-header-logo.svg');
  const footerFallback = logoAsset('verivia-footer-logo.svg');

  // 1. Mark-only variant: compact emblem for sidebars and badges.
  if (variant === 'mark-only') {
    const markSrc = logoAsset(
      inverted ? 'verivia-mark-white.svg' : 'verivia-mark.svg'
    );

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center shrink-0 ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
        title="VERIVIA HEALTH"
      >
        <img
          src={markSrc}
          alt="VERIVIA Health emblem"
          className="w-full h-full object-contain select-none"
          onError={(event) => handleLogoError(event, headerFallback)}
        />
      </div>
    );
  }

  // 2. Footer variant: white logo for dark backgrounds.
  if (variant === 'footer' || inverted) {
    const footerSrc =
      cleanLogoSrc &&
      !cleanLogoSrc.includes('verivia') &&
      !cleanLogoSrc.includes('1791174945789')
        ? cleanLogoSrc
        : footerFallback;

    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <div className="relative shrink-0 flex items-center justify-center py-1">
          <img
            src={footerSrc}
            alt="VERIVIA HEALTH - International Patient Services"
            className="h-12 sm:h-14 md:h-[54px] w-auto max-w-[330px] sm:max-w-[370px] object-contain select-none transition-opacity hover:opacity-95"
            onError={(event) => handleLogoError(event, footerFallback)}
          />
        </div>
      </div>
    );
  }

  // 3. Full and hero variants.
  if (variant === 'full' || variant === 'hero') {
    const heroSrc =
      cleanLogoSrc && !cleanLogoSrc.includes('1791174945789')
        ? cleanLogoSrc
        : headerFallback;

    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center select-none ${
          onClick ? 'cursor-pointer' : ''
        } ${className}`}
      >
        <div className="relative shrink-0 flex items-center justify-center">
          <img
            src={heroSrc}
            alt="VERIVIA HEALTH - International Patient Services"
            className={`${
              variant === 'hero' ? 'h-16 sm:h-20' : 'h-14 sm:h-16'
            } w-auto max-w-[380px] object-contain select-none transition-transform hover:scale-[1.02]`}
            onError={(event) => handleLogoError(event, headerFallback)}
          />
        </div>
      </div>
    );
  }

  // 4. Header variant: main website navigation.
  const headerSrc =
    cleanLogoSrc &&
    !cleanLogoSrc.includes('1791174945789') &&
    !cleanLogoSrc.includes('footer')
      ? cleanLogoSrc
      : headerFallback;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="relative shrink-0 flex items-center justify-center">
        <img
          src={headerSrc}
          alt="VERIVIA HEALTH - International Patient Services"
          className="h-12 sm:h-14 md:h-[54px] w-auto max-w-[330px] sm:max-w-[370px] object-contain transition-all duration-200 group-hover:scale-[1.01] select-none"
          onError={(event) => handleLogoError(event, headerFallback)}
        />
      </div>
    </div>
  );
};