import React from 'react';
import { cn } from '../../lib/utils';
import type { StatusBadgeProps } from '../../types/ui-shell';

const statusConfig = {
  success: {
    className: 'bg-green-500 text-white hover:bg-green-600',
    defaultLabel: 'Success',
  },
  pending: {
    className: 'bg-yellow-500 text-white hover:bg-yellow-600',
    defaultLabel: 'Pending',
  },
  failed: {
    className: 'bg-red-500 text-white hover:red-600',
    defaultLabel: 'Failed',
  },
} as const;

export function StatusBadge({ 
  code, 
  label, 
  className 
}: StatusBadgeProps) {
  const config = statusConfig[code];
  const displayLabel = label || config.defaultLabel;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors',
        config.className,
        className
      )}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      {displayLabel}
    </span>
  );
}
