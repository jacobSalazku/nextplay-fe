'use client';

import { useEffect, useRef, useState } from 'react';
import { useLogout } from '@/features/auth/use-logout';
import { User } from 'lucide-react';
import { Button } from '@/components/foundation/button/button';
import { Link } from '@/components/foundation/button/link';

const ProfileDropDown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const logout = useLogout();

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

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-white/50 px-4 py-2 hover:bg-gray-600"
      >
        <User className="h-5 w-5" />
        <span>Profile</span>
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-800 p-2 shadow-lg">
          <Link
            aria-label="join team"
            href="/create/join-team"
            className="block px-4 py-2 hover:bg-gray-700 hover:text-white"
          >
            Join Team
          </Link>
          <Link
            aria-label="create team"
            href="/create/create-team"
            className="block px-4 py-2 hover:bg-gray-700 hover:text-white"
          >
            Create Team
          </Link>
          <Button
            size="full"
            onClick={() => logout()}
            className="justify-start px-4 py-2 hover:bg-gray-700 hover:text-white"
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
