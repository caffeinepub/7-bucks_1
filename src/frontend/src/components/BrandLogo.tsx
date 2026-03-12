import { useState } from "react";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function BrandLogo({
  className = "",
  size = "md",
}: BrandLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-24",
  };

  if (imageError) {
    // Fallback: styled text wordmark
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-teal-600 to-amber-600 text-white font-bold rounded-lg px-4 ${className}`}
      >
        <span className="text-xl">7 Bucks</span>
      </div>
    );
  }

  return (
    <img
      src="/assets/Untitled design_20260217_200738_0000.png"
      alt="7 Bucks Logo"
      className={`${sizeClasses[size]} w-auto ${className}`}
      onError={() => setImageError(true)}
    />
  );
}
