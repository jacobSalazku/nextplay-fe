'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTeam } from '@/context/team-context';
import { useLogout } from '@/features/auth/use-logout';
import { useUserStore } from '@/store/user-store';
import { cn } from '@/utils/tw-merge';
import { ChevronRight, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';

const capitalize = (text: string) =>
  text.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

export const Breadcrumb = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const logout = useLogout();
  const { data: session } = useSession();
  const { teamSlug, routeKey } = useTeam();
  const { user } = useUserStore();

  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const visibleSegments = segments.slice(2);

  // A play's own id makes an ugly, meaningless crumb (view/edit/sheet all carry it) — collapse the whole play-detail chain to one link back.

  const isPlayDetail =
    visibleSegments[0] === 'playbook' &&
    visibleSegments[1] === 'play' &&
    visibleSegments.length >= 3 &&
    visibleSegments[2] !== 'new';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const teamLabel = capitalize(teamSlug);
  const crumbLink =
    'font-medium bg:hover-text p-0 bg-transparent text-lg transition-colors duration-200 hover:bg-transparent hover:text-orange-300';

  if (!user?.user) {
    return null;
  }
  const userName = user.user.name ?? session?.user?.name ?? 'User';

  return (
    <div className="-mx-4 mb-4 hidden items-center border-b border-orange-200/30 px-10 py-4 text-sm text-orange-200 md:flex">
      <div className="flex items-center gap-2">
        <Link
          aria-label={teamLabel}
          href={{
            pathname: `/team/${routeKey}`,
          }}
          className={crumbLink}
        >
          {teamLabel}
        </Link>

        {isPlayDetail ? (
          <>
            <ChevronRight className="h-5 w-5" />
            <Link
              aria-label="Playbook"
              href={`/team/${routeKey}/playbook`}
              className={crumbLink}
            >
              Playbook
            </Link>
          </>
        ) : (
          visibleSegments.map((segment, index) => {
            const label = capitalize(segment);
            const isLast = index === visibleSegments.length - 1;

            const href = '/' + segments.slice(0, index + 3).join('/');

            return (
              <div className="flex items-center gap-2" key={index}>
                <ChevronRight className="h-5 w-5" />
                {isLast ? (
                  <span
                    className={cn('text-orange-300', 'text-lg font-medium')}
                  >
                    {label}
                  </span>
                ) : (
                  <Link aria-label={label} href={href} className={crumbLink}>
                    {label}
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="relative ml-auto text-xs text-white" ref={dropdownRef}>
        <button
          aria-label="dropdown settings"
          onClick={() => setOpen((prev) => !prev)}
          className="flex cursor-pointer items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:bg-gray-600"
        >
          <User className="h-5 w-5" />
          <span>{userName}</span>
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-48 rounded-md p-2 shadow-lg">
            <Link
              aria-label="go back to dashboard"
              href="/"
              className="block w-full rounded px-4 py-2 text-white hover:bg-gray-700 hover:text-white"
            >
              Go back to Dashboard
            </Link>
            <Button
              aria-label="logout"
              className="block w-full rounded px-4 py-2 text-left text-white hover:bg-gray-700 hover:text-white"
              onClick={() => {
                setOpen(false);
                logout();
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
