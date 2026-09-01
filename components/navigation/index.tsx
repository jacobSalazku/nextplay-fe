'use client';

import { type FC } from 'react';
import { useTeam } from '@/context/team-context';
import { useNavRoute } from '@/hooks/use-nav-route';
import { useNavigationStore } from '@/store/use-navigation-store';
import {
  BookOpen,
  Calendar,
  ChartArea,
  Menu,
  User as UserIcon,
  type LucideIcon,
} from 'lucide-react';
import { DesktopNavigation } from './desktop-navigation';
import { MobileNav } from './mobile-nav';

export type NavItemType = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type NavigationProps = {
  children: React.ReactNode;
};

const Navigation: FC<NavigationProps> = ({ children }) => {
  const { routeKey } = useTeam();

  const { navOpen, setNavOpen, setMobileNavOpen, mobileNavOpen } =
    useNavigationStore();

  const navItems = [
    {
      label: 'Schedule',
      href: `/team/${routeKey}/schedule`,
      icon: Calendar,
      active: false,
    },
    {
      label: 'Players',
      href: `/team/${routeKey}/players`,
      icon: UserIcon,
      active: false,
    },
    {
      label: 'Statistics',
      href: `/team/${routeKey}/statistics`,
      icon: ChartArea,
      active: false,
    },
    {
      label: 'Playbook',
      href: `/team/${routeKey}/playbook`,
      icon: BookOpen,
      active: false,
    },
  ];

  const title = useNavRoute();

  return (
    <div className="flex h-screen flex-col bg-white text-gray-950">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-orange-200/30 bg-white/95 p-4 backdrop-blur md:hidden">
        <div className="flex w-full items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2">
            <button
              aria-label="Open Mobile Navigation"
              onClick={() => setMobileNavOpen(true)}
              className="cursor-pointer rounded p-2 transition-colors duration-300 hover:bg-gray-900 hover:text-white"
            >
              <Menu className="py h-5 w-5" />
            </button>
            <h1 className="font-righteous text-xl font-bold">{title}</h1>
          </div>
        </div>
      </header>

      {mobileNavOpen && (
        <MobileNav
          items={navItems}
          onClose={() => setMobileNavOpen(false)}
          routeKey={routeKey}
        />
      )}
      <div className="flex flex-1 overflow-hidden">
        <DesktopNavigation
          items={navItems}
          isOpen={navOpen}
          routeKey={routeKey}
          onToggle={() => setNavOpen(!navOpen)}
        >
          {children}
        </DesktopNavigation>
      </div>
    </div>
  );
};

export { Navigation };
