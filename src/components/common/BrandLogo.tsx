import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useBrandingConfig } from '@/hooks/useBrandingConfig';
import { landingEnv } from '@/config/landingEnv';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showCompanyName?: boolean;
  className?: string;
  onError?: () => void;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-xl'
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showCompanyName = true,
  className = '',
  onError
}) => {
  const { logoUrl, companyName, logoAltText, isLoading } = useBrandingConfig();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const resolvedLogoUrl = logoUrl || landingEnv.logoUrl;
  const resolvedCompanyName = companyName || 'PoupeJá!';

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Skeleton className={`${sizeClasses[size]} rounded-lg`} />
        {showCompanyName && <Skeleton className="h-6 w-24" />}
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {resolvedLogoUrl && !imageError ? (
        <div className="relative" style={{ width: `${landingEnv.logoWidth}px`, height: `${landingEnv.logoHeight}px` }}>
          {!imageLoaded && (
            <Skeleton className="absolute inset-0 rounded-lg" style={{ width: `${landingEnv.logoWidth}px`, height: `${landingEnv.logoHeight}px` }} />
          )}
          <img
            src={resolvedLogoUrl}
            alt={logoAltText || `Logo ${resolvedCompanyName}`}
            className={`object-contain ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            style={{ width: `${landingEnv.logoWidth}px`, height: `${landingEnv.logoHeight}px` }}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="eager"
          />
        </div>
      ) : (
        <div className={`${sizeClasses[size]} bg-primary rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className="text-primary-foreground font-bold text-sm">{resolvedCompanyName.charAt(0) || 'P'}</span>
        </div>
      )}

      {showCompanyName && (
        <span className={`${textSizeClasses[size]} font-bold text-primary`}>{resolvedCompanyName}</span>
      )}
    </div>
  );
};
