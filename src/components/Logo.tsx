import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 32 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle with gradient */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      
      {/* Main circle background */}
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="url(#logoGradient)"
        stroke="#1E40AF"
        strokeWidth="1"
      />
      
      {/* Musical staff lines */}
      <g opacity="0.3">
        <line x1="8" y1="12" x2="32" y2="12" stroke="white" strokeWidth="0.5" />
        <line x1="8" y1="16" x2="32" y2="16" stroke="white" strokeWidth="0.5" />
        <line x1="8" y1="20" x2="32" y2="20" stroke="white" strokeWidth="0.5" />
        <line x1="8" y1="24" x2="32" y2="24" stroke="white" strokeWidth="0.5" />
        <line x1="8" y1="28" x2="32" y2="28" stroke="white" strokeWidth="0.5" />
      </g>
      
      {/* Flowing wave representing lyrics */}
      <path
        d="M8 20 Q14 16 20 20 T32 20"
        stroke="url(#waveGradient)"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Secondary wave for flow effect */}
      <path
        d="M8 24 Q14 20 20 24 T32 24"
        stroke="url(#waveGradient)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Musical note accent */}
      <circle cx="26" cy="16" r="1.5" fill="white" opacity="0.8" />
      <rect x="27.2" y="10" width="0.6" height="6" fill="white" opacity="0.8" />
      
      {/* Text flow indicators */}
      <circle cx="12" cy="20" r="1" fill="white" opacity="0.6" />
      <circle cx="16" cy="18" r="0.8" fill="white" opacity="0.5" />
      <circle cx="24" cy="22" r="0.8" fill="white" opacity="0.5" />
      <circle cx="28" cy="20" r="1" fill="white" opacity="0.6" />
    </svg>
  );
}