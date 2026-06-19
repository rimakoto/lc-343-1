import React from 'react';
import { cn } from '@/lib/utils';

interface CircleProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  colorClass?: string;
  trackClass?: string;
  children?: React.ReactNode;
  className?: string;
}

export default function CircleProgress({
  progress,
  size = 240,
  strokeWidth = 12,
  colorClass = 'stroke-tomato-500',
  trackClass = 'stroke-white/20',
  children,
  className,
}: CircleProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(1, progress));
  const dashOffset = circumference * (1 - clamped);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClass}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn(colorClass, 'transition-all duration-1000 ease-linear')}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
