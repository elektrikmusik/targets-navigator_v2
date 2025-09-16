import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import type { SidebarLinkProps } from '../../../types/ui-shell';

export function SidebarLink({ 
  href, 
  label, 
  icon: Icon, 
  className,
  isActive: forcedActive
}: SidebarLinkProps) {
  const location = useLocation();
  const isActive = forcedActive ?? location.pathname === href;

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isActive && 'bg-accent text-accent-foreground',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span className="truncate">{label}</span>
    </Link>
  );
}
