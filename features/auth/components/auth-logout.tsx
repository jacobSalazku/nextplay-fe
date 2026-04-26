'use client';

import { useNavigationStore } from '@/store/use-navigation-store';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/foundation/button/button';

const AuthLogoutModal = () => {
  const { setOpenLogOutModal } = useNavigationStore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-1/2 max-w-md overflow-auto rounded-xl border border-gray-800 bg-black">
        <div className="flex min-h-52 flex-col items-center justify-center gap-8 border-b border-gray-800">
          <p className="text-lg text-white">
            Are you sure you want to Log out ?
          </p>
          <div className="flex flex-row gap-4">
            <Button
              aria-label="Close Button"
              size="lg"
              onClick={() => setOpenLogOutModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              aria-label="Logout Button"
              size="lg"
              onClick={() => signOut({ callbackUrl: '/login' })}
              variant="danger"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export { AuthLogoutModal };
