import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/tw-merge';
import type { LucideIcon } from 'lucide-react';

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  isCollapsed?: boolean;
  onClick?: () => void;
};

export function NavItem({
  href,
  icon: Icon,
  children,
  isCollapsed,
  onClick,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex w-full items-center rounded-lg px-4 py-7 text-sm transition-colors',
        isCollapsed ? 'justify-center' : 'justify-start',
        isActive
          ? 'bg-gray-800 font-medium text-orange-300'
          : 'text-gray-950 hover:bg-gray-800 hover:text-white',
      )}
    >
      <Icon
        strokeWidth={2}
        className={cn('h-5', !isCollapsed ? 'mr-2' : 'mr-3 w-full')}
      />
      {!isCollapsed && <span>{children}</span>}
    </Link>
  );
}
